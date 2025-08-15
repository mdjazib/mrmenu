import category from "@/model/category";
import login from "@/model/login";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const cookie = await cookies();
        const formdata = await req.formData();
        const name = formdata.get("name").trim();
        if (name.length > 2 && name.length < 40) {
            if (/^[\p{L}]+(?:\s+[\p{L}]+)*$/u.test(name)) {
                const slug = name.toLocaleLowerCase().replaceAll("-", "");
                const uid = (await login.findOne({ _id: jwt.verify(cookie.get("__mr_session").value, process.env.JWT_KEY).ref })).accountId;
                const preventDuplicate = await category.countDocuments({ $or: [{ uid: "" }, { uid }], slug });
                if (preventDuplicate) {
                    return NextResponse.json({ status: false, msg: "This category is already existed." });
                } else {
                    const limit = await category.countDocuments({ uid });
                    if (limit <= 16) {
                        await category.create({ uid, name, slug });
                        return NextResponse.json({ status: true, msg: "New category successfully added." });
                    } else {
                        return NextResponse.json({ status: false, msg: "You can't add categories more than 16." });
                    }
                }
            } else {
                return NextResponse.json({ status: false, msg: "Invalid formate of category name." });
            }
        } else {
            return NextResponse.json({ status: false, msg: "Invalid length of category name." });
        }
    } catch (error) {
        return NextResponse.json({ status: false, msg: "Something went wrong." });
    }
}