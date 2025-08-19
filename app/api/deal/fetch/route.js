import login from "@/model/login";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import deal from "@/model/deal";

export async function POST() {
    try {
        const cookie = await cookies();
        const uid = (await login.findOne({ _id: jwt.verify(cookie.get("__mr_session").value, process.env.JWT_KEY).ref })).accountId;
        const response = await deal.find({ uid }).sort({ _id: -1 });
        for (let i = 0; i < response.length; i++) {
            response[i].__v = undefined;
            response[i].slug = undefined;
            response[i].uid = undefined;
            response[i]._doc.createdAt = undefined;
            response[i]._doc.updatedAt = undefined;
            response[i].available = undefined;
        }
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(401);
    }
}