import { connection } from "@/lib/db";
import account from "@/model/account";
import category from "@/model/category";
import deal from "@/model/deal";
import item from "@/model/item";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connection();
        const { id: username } = await params;
        const uid = (await account.findOne({ username }))._id;
        const items = await item.find({ uid });
        const deals = await deal.find({ uid });
        const categoryIds = [...new Set(items.map(i => i.category?.toString()))];
        const categoriesData = await category.find({ _id: { $in: categoryIds } }).select("name");
        const categoryMap = Object.fromEntries(categoriesData.map(c => [c._id.toString(), c.name]));
        for (let i = 0; i < deals.length; i++) {
            deals[i].uid = undefined;
            deals[i].slug = undefined;
            deals[i].available = undefined;
            deals[i]._doc._id = undefined;
            deals[i]._doc.createdAt = undefined;
            deals[i]._doc.updatedAt = undefined;
            deals[i]._doc.__v = undefined;
        }
        for (let j = 0; j < items.length; j++) {
            items[j].uid = undefined;
            items[j].slug = undefined;
            items[j]._doc._id = undefined;
            items[j]._doc.createdAt = undefined;
            items[j]._doc.updatedAt = undefined;
            items[j]._doc.__v = undefined;
            items[j].category = categoryMap[items[j].category?.toString()] || null;
        }
        const groupingItems = items.reduce((acc, item) => {
            let group = acc.find(g => g.category === item.category);
            if (group) {
                group.items.push(item);
            } else {
                acc.push({ category: item.category, items: [item] });
            }
            return acc;
        }, []);
        return NextResponse.json({ deals, items: groupingItems });
    } catch (error) {
        return NextResponse.json({ status: 401, msg: "Something went wrong" });
    }
}
