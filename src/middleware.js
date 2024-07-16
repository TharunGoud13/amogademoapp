import { auth } from "@/auth";
import { NextResponse } from "next/server";


export async function middleware(req) {
    const session = await auth()
    // If token does not exist, redirect to home page
    if (!session?.user) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // If token exists, allow the request to proceed
    return NextResponse.next();
}

export const config = { 
    matcher: ['/', '/dashboard/:path*', '/storechat', '/menu'] 
};
