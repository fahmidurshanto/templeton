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

const API_URL = process.env.API_HOST || process.env.LOCAL_API_HOST;

async function verifyTokenOnServer(request) {
    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            headers: {
                'Cookie': request.headers.get('cookie') || '',
            },
        });
        const data = await response.json();
        return {
            isValid: response.ok,
            user: data?.user || null,
            setCookie: response.headers.get('set-cookie')
        };
    } catch (error) {
        console.error('Middleware verification failed:', error);
        return { isValid: false, user: null };
    }
}

// This proxy acts to protect your routes based on the refreshToken
export async function proxy(request) {
    const token = request.cookies.get('refreshToken')?.value;
    const { pathname } = request.nextUrl;

    const isPublicFile = pathname.match(/\.[^/]+$/);
    if (isPublicFile) {
        return NextResponse.next();
    }

    const isPublicRoute =
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname === '/favicon.ico' ||
        pathname === '/verify';

    if (isPublicRoute) {
        return NextResponse.next();
    }

    const isLoginRoute = pathname === '/login';

    // 1. Handle unauthenticated users
    if (!token) {
        if (isLoginRoute) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Authenticated user logic
    const { isValid, user, setCookie } = await verifyTokenOnServer(request);
    
    if (!isValid) {
        if (isLoginRoute) {
            return NextResponse.next(); // Allow them to stay on login if token is invalid
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. User is valid, handle redirects
    const isAdminRoute = pathname.startsWith('/admin');

    // Case: User is already on /login but already has a valid session
    if (isLoginRoute) {
        const dest = (user?.role === 'admin') ? '/admin' : '/';
        const response = NextResponse.redirect(new URL(dest, request.url));
        if (setCookie) response.headers.set('set-cookie', setCookie);
        return response;
    }

    // Case: User is an 'admin' and tries to access non-admin routes
    // They are restricted ONLY to /admin
    if (user?.role === 'admin' && !isAdminRoute) {
        const response = NextResponse.redirect(new URL('/admin', request.url));
        if (setCookie) response.headers.set('set-cookie', setCookie);
        return response;
    }

    // Case: Non-admin trying to access /admin routes
    if (isAdminRoute && user?.role !== 'admin' && user?.role !== 'superadmin') {
        const response = NextResponse.redirect(new URL('/', request.url));
        if (setCookie) response.headers.set('set-cookie', setCookie);
        return response;
    }

    // Otherwise, allow access
    const response = NextResponse.next();
    if (setCookie) response.headers.set('set-cookie', setCookie);
    return response;
}

export const config = {
    // Apply this proxy to all routes except Next.js internals and static files
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
