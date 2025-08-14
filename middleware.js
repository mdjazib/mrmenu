import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'

export async function middleware(request) {
    const url = process.env.PROD === "false" ? process.env.CLIENT : request.nextUrl.origin;
    if (request.nextUrl.pathname === '/') {
        const auth = await (await fetch(`${url}/api/auth`, { credentials: "include", method: "GET", headers: { cookie: request.headers.get("cookie") || "" } })).json();
        if (auth.status === 200) {
            return NextResponse.next();
        } else {
            const cookie = await cookies();
            cookie.delete("__mr_session");
            return NextResponse.redirect(new URL('/auth', request.url));
        }
    }
    if (request.nextUrl.pathname.startsWith("/auth")) {
        const auth = await (await fetch(`${url}/api/auth`, { credentials: "include", method: "GET", headers: { cookie: request.headers.get("cookie") || "" } })).json();
        if (auth.status === 200) {
            return NextResponse.redirect(new URL('/', request.url));
        } else {
            const cookie = await cookies();
            cookie.delete("__mr_session");
            return NextResponse.next();
        }
    }
}