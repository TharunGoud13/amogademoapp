import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const session = await auth();
    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    const res = NextResponse.next();
    res.headers.set('x-pathname', pathname);

    if (!session?.user && !['/login', '/signIn', '/storejoin'].includes(pathname)) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    if (session?.user && ['/login', '/signIn', '/storejoin'].includes(pathname)) {
        url.pathname = "/email";
        return NextResponse.redirect(url);
    }

    if(session?.user && !['/email','/dashboard','/storemenu','taskbox','/storechat','/products','/profile'].includes(pathname)){
        url.pathname = "/email"
        return NextResponse.redirect(url);
    }

    return res;
}

export const config = { 
    matcher: ['/', '/dashboard/:path*', '/storechat', '/menu', '/login', '/signIn', '/storejoin'] 
};
