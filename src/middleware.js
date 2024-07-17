import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const session = await auth();
    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    // Add the current pathname to the request headers
    const res = NextResponse.next();
    res.headers.set('x-pathname', pathname);

    // If token does not exist, redirect to login page
    if (!session?.user && !['/login', '/signIn', '/storejoin'].includes(pathname)) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // If token exists and trying to access login or storejoin page, redirect to home page
    if (session?.user && ['/login', '/signIn', '/storejoin'].includes(pathname)) {
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    // Allow the request to proceed
    return res;
}

export const config = { 
    matcher: ['/', '/dashboard/:path*', '/storechat', '/menu', '/login', '/signIn', '/storejoin'] 
};
