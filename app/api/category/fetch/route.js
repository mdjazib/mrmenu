import category from "@/model/category";
import login from "@/model/login";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookie = await cookies();
        const uid = (await login.findOne({ _id: jwt.verify(cookie.get("__mr_session").value, process.env.JWT_KEY).ref })).accountId;
        const categories = await category.find({ $or: [{ uid: "" }, { uid }] }).sort({ _id: -1 });
        return NextResponse.json(categories.map((e) => { return { name: e.name, id: e._id, default: e.fixed } }));
    } catch (error) {
        return NextResponse.json(401);
    }
}