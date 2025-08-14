import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import login from "@/model/login";

export async function GET(req) {
    const cookie = await cookies();
    try {
        const url = new URL(req.url);
        const _device_fingerprint = url.searchParams.get("f");
        const _known_fingerprint = (await login.findOne({ _id: jwt.verify(cookie.get("__mr_session").value, process.env.JWT_KEY).ref })).deviceId;
        const response = _known_fingerprint === _device_fingerprint ? true : false;
        if (!response) cookie.delete("__mr_session");
        return NextResponse.json(response);
    } catch (error) {
        cookie.delete("__mr_session");
        return NextResponse.json(false);
    }
}