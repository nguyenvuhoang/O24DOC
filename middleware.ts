import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const isAuthenticated = request.cookies.has('site_access')
    const isLoginPage = request.nextUrl.pathname === '/login'

    // If trying to access login page while authenticated, redirect to home
    if (isLoginPage && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js)).*)',
    ],
}
