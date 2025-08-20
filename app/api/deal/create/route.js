import deal from "@/model/deal";
import login from "@/model/login";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const cookie = await cookies()
        const formdata = await req.formData();
        const editId = formdata.get("edit");
        const data = {
            name: formdata.get("name"),
            price: formdata.get("price"),
            save: formdata.get("benifit"),
            slug: formdata.get("name").trim().toLowerCase().replaceAll(" ", "-"),
            items: formdata.getAll("item").map((_, i) => { return { name: formdata.getAll("item")[i], price: formdata.getAll("rs")[i], quantity: formdata.getAll("quantity")[i] } })
        }
        const uid = (await login.findOne({ _id: jwt.verify(cookie.get("__mr_session").value, process.env.JWT_KEY).ref })).accountId;
        const isExist = await deal.countDocuments({ uid, slug: data.slug });
        if (editId === "undefined") {
            if (isExist) {
                return NextResponse.json({ status: 401, msg: "A deal with this name already exists. Please choose a different name." });
            } else {
                const limit = await deal.countDocuments({ uid });
                if (limit < 20) {
                    await deal.create({ ...data, uid });
                    return NextResponse.json({ status: 200, msg: "Deal successfully added." });
                } else {
                    return NextResponse.json({ status: 401, msg: "You’ve reached the maximum limit of 20 deals." });
                }
            }
        } else {
            await deal.updateOne({ uid, _id: editId }, { $set: { ...data } });
            return NextResponse.json({ status: 200, msg: "Deal successfully updated." });
        }
    } catch (error) {
        return NextResponse.json({ status: 401, msg: "Something went wrong." });
    }
}