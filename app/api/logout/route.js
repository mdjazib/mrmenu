import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookie = await cookies();
    cookie.delete("__mr_session");
    return NextResponse.json(200);
}