import account from "@/model/account";
import login from "@/model/login";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookie = await cookies();
        const _id = (await login.findOne({ _id: jwt.verify(cookie.get("__mr_session").value, process.env.JWT_KEY).ref })).accountId;
        const username = (await account.findOne({ _id }).select("username")).username;
        return NextResponse.json({ username });
    } catch (error) {
        return NextResponse.json(401);
    }
}