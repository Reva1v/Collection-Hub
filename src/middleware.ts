export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth/session';
import { cookies } from 'next/headers';

// 1. Specify protected and public routes
const protectedRoutes = ['/items', '/collections', '/profile', "/collections:id"];
const publicRoutes = ['/login', '/signup'];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // 2. Check if the current route is protected or public
    const isProtectedRoute = protectedRoutes.some(route =>
        path.startsWith(route)
    );
    const isPublicRoute = publicRoutes.some(route =>
        path.startsWith(route)
    );

    // 3. Decrypt the session from the cookie
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    // 4. Redirect to login if accessing protected route without session
    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // 5. Redirect to home if accessing public route with valid session
    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
