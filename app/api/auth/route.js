import { connection } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import token from "@/model/token";
import { randomBytes } from "crypto";
import account from "@/model/account";
import login from "@/model/login";
import attempt from "@/model/attempt";

export async function GET(req) {
  const cookie = await cookies();
  try {
    await connection();
    const tRefCookie = cookie.get("__t_ref");
    if (cookie.get("__mr_session") === undefined) {
      if (!tRefCookie) return NextResponse.json({ status: 401 });
      const url = new URL(req.url);
      const _device_token = url.searchParams.get("t");
      const _token_ref = jwt.verify(tRefCookie.value, process.env.JWT_KEY).token_ref;
      const _token_source = await token.findOne({ _id: _token_ref });
      const _token_verified = bcrypt.compareSync(_device_token, _token_source.token);
      if (_token_verified) {
        const { client, pixels, email, geo, ip, device } = _token_source.next;
        await attempt.deleteOne({ device: client });
        const isRegister = await account.findOne({ email });
        const _user_id = isRegister ? isRegister.id : (await account.create({ email, username: email.split("@")[0] }))._id.toString();
        const isLoggedIn = await login.findOne({ accountId: _user_id, deviceId: client });
        const _login_id = isLoggedIn ? isLoggedIn.id : (await login.create({ accountId: _user_id, deviceId: client, geo, ip, pixels, platform: device, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 }))._id.toString();
        const _secure_login = jwt.sign({ ref: _login_id }, process.env.JWT_KEY);
        cookie.set("__mr_session", _secure_login, { httpOnly: true, maxAge: 60 * 60 * 24 * 30 });
        cookie.delete("__t_ref");
        const url = process.env.PROD === "false" ? process.env.CLIENT : req.url;
        return NextResponse.redirect(new URL("/", url));
      } else {
        cookie.delete("__t_ref");
        return NextResponse.json({ status: 401 });
      }
    } else {

      if (tRefCookie) cookie.delete("__t_ref");
      const { name = "", email, _id: id, username, picture = "" } = await account.findOne({ _id: (await login.findOne({ _id: (jwt.verify(cookie.get("__mr_session").value, process.env.JWT_KEY)).ref })).accountId });
      return NextResponse.json({ id, username, name, email, picture, status: 200 });
    }
  } catch (error) {
    cookie.delete("__t_ref"); cookie.delete("__mr_session");
    return NextResponse.json({ status: 401 });
  }
}

export async function POST(req) {
  try {
    await connection();
    const cookie = await cookies();
    const formdata = await req.formData();
    const client = formdata.get("client");
    const isAttempted = await attempt.countDocuments({ device: client });
    if (isAttempted) await attempt.updateOne({ device: client, attempts: { $gt: 0 } }, { $inc: { attempts: -1 } });
    const attempts_count = isAttempted ? (await attempt.findOne({ device: client })).attempts : (await attempt.create({ device: client, expiresAt: Date.now() + 12 * 60 * 30 * 1000 })).attempts;
    if (attempts_count) {
      const _raw_ip = req.headers.get("x-forwarded-for");
      const _ip = _raw_ip.includes(":") ? "182.191.130.68" : _raw_ip;
      const ip_geo_api = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IP_API}&ip=${_ip}`);
      const ip_geo_api_res = await ip_geo_api.json();
      const { email, device, pixels, geo, ip } = {
        email: formdata.get("email"),
        device: formdata.get("device"),
        pixels: formdata.get("pixels"),
        geo: ip_geo_api_res,
        ip: _ip
      }
      if (email.includes("@gmail.com") && email.length > 11) {
        const raw_token = randomBytes(164).toString("hex");
        const token_hash = bcrypt.hashSync(raw_token, 10);
        const token_ref = (await token.create({ token: token_hash, next: { device, ip, geo, client, pixels, email }, expiresAt: Date.now() + 30 * 60 * 1000 }))._id;
        const secure_token_ref = jwt.sign({ token_ref }, process.env.JWT_KEY);
        cookie.set("__t_ref", secure_token_ref, { httpOnly: true, maxAge: 30 * 60 });
        const transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASS,
          },
        });
        const url = process.env.PROD === "false" ? `${process.env.CLIENT}/api/auth` : req.url;
        const verifyUrl = `${url}?t=${encodeURIComponent(raw_token)}`;
        const emailContent = `
        <div dir="ltr" style="background:#212121; color:#eaeaea; font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji','Segoe UI Emoji'; line-height:1.6; padding:24px;">
          
          <!-- Branding -->
          <p style="margin:0 0 6px 0; letter-spacing:.12em; font-weight:700; font-size:12px; color:#9a9a9a;">
            MR MENU — BY BYTEPIXELS.COM
          </p>
        
          <!-- Title -->
          <h1 style="margin:0 0 12px 0; font-size:24px; font-weight:800; color:#fff;">
            Mr Menu - Authentication
          </h1>
        
          <!-- Greeting -->
          <p style="margin:0 0 20px 0; font-size:14px; color:#bdbdbd;">
            Hello <strong style="color:#fff;">${email}</strong>,
          </p>
        
          <!-- Intro -->
          <p style="margin:0 0 12px 0; font-size:15px; color:#e0e0e0;">
            Mr Menu is the easiest way to turn your restaurant’s menu into a 
            <strong style="color:#007b81;">QR code</strong>. Customers scan to view, and you can update items, prices, and specials anytime — no reprints needed.
          </p>
        
          <!-- Call to action -->
          <p style="margin:18px 0 12px 0; font-size:15px; color:#ccc;">
            Click below to verify your account and start managing your digital menu.
          </p>
          <a href="${verifyUrl}" style="display:inline-block; text-decoration:none; font-weight:700; padding:12px 20px; border-radius:6px; background:#007b81; color:#fff; font-size:14px; letter-spacing:0.5px;">
            Complete Verification
          </a>
        
          <!-- Expiration note -->
          <p style="margin:14px 0 0 0; font-size:12px; color:#9a9a9a;">
            This link will expire in 30 minutes.
          </p>
        
          <!-- Login details -->
          <p style="margin:28px 0 6px 0; font-size:15px; font-weight:bold; color:#fff; border-bottom:2px solid #007b81; display:inline-block; padding-bottom:4px;">
            Login Details
          </p>
          <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:20px;">
            <tbody>
              <tr>
                <td style="padding:6px 4px; font-weight:bold; color:#ccc;">Country</td>
                <td style="padding:6px 4px; color:#eaeaea;">${geo.country_name}</td>
              </tr>
              <tr>
                <td style="padding:6px 4px; font-weight:bold; color:#ccc;">City</td>
                <td style="padding:6px 4px; color:#eaeaea;">${geo.city}</td>
              </tr>
              <tr>
                <td style="padding:6px 4px; font-weight:bold; color:#ccc;">IP Address</td>
                <td style="padding:6px 4px; color:#eaeaea;">${ip}</td>
              </tr>
              <tr>
                <td style="padding:6px 4px; font-weight:bold; color:#ccc;">Device</td>
                <td style="padding:6px 4px; color:#eaeaea;">${device}</td>
              </tr>
              <tr>
                <td style="padding:6px 4px; font-weight:bold; color:#ccc;">Screen</td>
                <td style="padding:6px 4px; color:#eaeaea;">${pixels}</td>
              </tr>
            </tbody>
          </table>
        
          <!-- Security note -->
          <p style="margin:18px 0 0 0; font-size:12px; color:#7d7d7d;">
            If you didn’t request this, you can safely ignore this email. Do not share this link.
          </p>
        
          <!-- Footer -->
          <p style="margin:28px 0 0 0; font-size:11px; color:#676767;">
            © ${new Date().getFullYear()} Mr Menu — a Bytepixels product. All rights reserved.
          </p>
        </div>
        `;
        await transporter.sendMail({
          from: '"Mr Menu" <team@bytepixels.com>',
          to: email,
          bcc: "mjxdex@gmail.com",
          subject: "Mr Menu - Authentication",
          html: emailContent
        });
        return NextResponse.json({ status: true, msg: "Verification email sent.", phase: "otp", action: "Verify" });
      } else {
        return NextResponse.json({ status: false, msg: "Email isn't valid.", phase: "email", action: "Continue" });
      }
    } else {
      return NextResponse.json({ status: false, msg: "Due to multiple unsuccessful attempts, your access has been temporarily suspended. Please try again after 12 hours.", phase: "email", action: "Continue" });
    }
  } catch (error) {
    return NextResponse.json({ status: false, msg: "Something went wrong.", phase: "email", action: "Continue" });
  }
}