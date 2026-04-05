import { NextResponse } from 'next/server';

// Lightweight JWT payload decoder (no verification — that's the backend's job).
// We only need the role claim to gate admin routes on the frontend.
function decodeJwtPayload(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(
            Buffer.from(parts[1], 'base64url').toString('utf-8')
        );
        return payload;
    } catch {
        return null;
    }
}

// This proxy acts to protect your routes based on the refreshToken
export function proxy(request) {
    const token = request.cookies.get('refreshToken')?.value;
    const accessToken = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;

    const isPublicFile = pathname.match(/\.[^/]+$/);
    // matches anything like /logo.png, /image.jpg, /file.css, etc.

    if (isPublicFile) {
        return NextResponse.next();
    }


    // Define routes that shouldn't be protected by this proxy
    const isPublicRoute =
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        // Add any other public asset paths here if needed
        pathname === '/favicon.ico';

    if (isPublicRoute) {
        return NextResponse.next();
    }

    const isLoginRoute = pathname === '/login';

    // 1. If user HAS a token and tries to access /login -> Redirect to dashboard (/)
    if (token && isLoginRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. If user DOES NOT HAVE a token and tries to access any page EXCEPT /login -> Redirect to /login
    if (!token && !isLoginRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Admin route protection — block non-admin users from /admin/*
    const isAdminRoute = pathname.startsWith('/admin');

    if (isAdminRoute && accessToken) {
        const payload = decodeJwtPayload(accessToken);
        if (!payload || (payload.role !== 'admin' && payload.role !== 'superadmin')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // If admin route but no accessToken yet (token might be refreshing),
    // let it through — the client-side guard in AdminLayout will handle it.

    // Otherwise, let them proceed normally
    return NextResponse.next();
}

export const config = {
    // Apply this proxy to all routes except Next.js internals and static files
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
