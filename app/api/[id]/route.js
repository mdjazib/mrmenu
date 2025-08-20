import { connection } from "@/lib/db";
import category from "@/model/category";
import deal from "@/model/deal";
import item from "@/model/item";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connection();
        const categories = [];
        const { id: uid } = await params;
        const items = await item.find({ uid });
        for (let i = 0; i < items.length; i++) { if (!categories.includes(items[i].category)) categories.push(items[i].category); }
        const existedCategories = (await category.find({ _id: { $in: categories } }).select("name"));
        const deals = await deal.find({ uid });
        return NextResponse.json({ deals, existedCategories, items });
    } catch (error) {
        return NextResponse.json(401);
    }
}