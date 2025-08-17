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
        const role = formdata.get("role");
        const stock = formdata.get("stock");
        const data = { name: formdata.get("name"), category: formdata.get("category"), label: formdata.getAll("label"), price: formdata.getAll("price") }
        const priceCheck = data.label.length ? !data.label.map(e => e === "").includes(true) && !data.price.map(e => e < 10).includes(true) : Number(data.price) > 10;
        const query = { name: data.name, category: data.category, price: data.label.length ? data.label.map((e, i) => { return { label: e, price: Number(data.price[i]) } }) : Number(data.price[0]) }
        if (priceCheck) {
            if (data.name.length > 2) {
                if (data.name.length < 80) {
                    if (data.category.length) {
                        const uid = (await login.findOne({ _id: jwt.verify(cookie.get("__mr_session").value, process.env.JWT_KEY).ref })).accountId;
                        const slug = query.name.trim().toLowerCase().replaceAll(" ", "") + query.category;
                        if (role === "new") {
                            const categoryExist = await category.countDocuments({ _id: data.category, $or: [{ uid: "" }, { uid }] });
                            if (categoryExist) {
                                const isExist = await item.countDocuments({ slug, uid });
                                if (isExist) {
                                    return NextResponse.json({ status: 401, msg: "This item is already existed in this category." });
                                } else {
                                    const itemQuery = { ...query, uid, slug, inStock: stock === "true" };
                                    await item.create(itemQuery);
                                    return NextResponse.json({ status: 200, msg: "Item successfully added." });
                                }
                            } else {
                                return NextResponse.json({ status: 401, msg: "Selected category isn't existed." });
                            }
                        } else {
                            const eid = formdata.get("id");
                            const itemQuery = { ...query, slug, inStock: stock === "true" };
                            await item.updateOne({ _id: eid, uid }, { $set: itemQuery });
                            return NextResponse.json({ status: 200, msg: "Item successfully updated." });
                        }
                    } else {
                        return NextResponse.json({ status: 401, msg: "Must select one category for this item." });
                    }
                } else {
                    return NextResponse.json({ status: 401, msg: "Item name is too long." });
                }
            } else {
                return NextResponse.json({ status: 401, msg: "Item name can not be empty." });
            }
        } else {
            return NextResponse.json({ status: 401, msg: "Missing price value or label." });
        }
    } catch (error) {
        return NextResponse.json({ status: 401, msg: "Something went wrong." });
    }
}