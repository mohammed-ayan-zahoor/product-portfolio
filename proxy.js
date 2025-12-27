import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function proxy(request) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        if (!token || !verifyToken(token)) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Prevent logged in users from visiting login page
    if (pathname === '/login') {
        if (token && verifyToken(token)) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
};
