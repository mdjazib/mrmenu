import category from "@/model/category";
import login from "@/model/login";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const cookie = await cookies();
        const formdata = await req.formData();
        const _id = formdata.get("id");
        const uid = (await login.findOne({ _id: jwt.verify(cookie.get("__mr_session").value, process.env.JWT_KEY).ref })).accountId;
        await category.deleteOne({ _id, uid });
        return NextResponse.json(200);
    } catch (error) {
        return NextResponse.json(401);
    }
}