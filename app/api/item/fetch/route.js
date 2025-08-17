import category from "@/model/category";
import item from "@/model/item";
import login from "@/model/login";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const cookie = await cookies();
        const formdata = await req.formData();
        const skip = formdata.get("skip");
        const search = formdata.get("search");
        const _category = formdata.get("category");
        const inStock = formdata.get("stock");
        const uid = (await login.findOne({ _id: jwt.verify(cookie.get("__mr_session").value, process.env.JWT_KEY).ref })).accountId;
        const queryStock = inStock === "both" ? {} : { inStock: inStock === "true" };
        const __category = _category !== "all" && (await category.findOne({ _id: _category }))._id;
        const queryCategory = _category === "all" ? {} : { category: __category };
        const response = await item.find({ uid, name: { $regex: search, $options: "i" }, ...queryStock, ...queryCategory }).sort({ _id: -1 }).skip(skip).limit(20);
        for (let i = 0; i < response.length; i++) {
            const id = response[i]._doc.category;
            response[i]._doc.category = (await category.findOne({ _id: response[i].category })).name;
            response[i]._doc.cid = id;
            response[i].uid = undefined;
            response[i].slug = undefined;
            response[i].__v = undefined;
            response[i]._doc.createdAt = undefined;
            response[i]._doc.updatedAt = undefined;
        }
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(400);
    }
}