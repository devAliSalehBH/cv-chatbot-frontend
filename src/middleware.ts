import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    // Get locale from pathname
    const locale = pathname.split("/")[1]; // e.g., 'ar' or 'en'

    // Define protected routes (require authentication)
    const protectedRoutes = ["/dashboard", "/profile", "/settings"];

    // Define auth routes (should redirect away if authenticated)
    const authRoutes = [
        "/auth/login",
        "/auth/signup",
        "/auth/verify-otp",
        "/auth/forgot-password",
    ];

    // Check if current path is a protected route
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.includes(route)
    );

    // Check if current path is an auth route
    const isAuthRoute = authRoutes.some((route) => pathname.includes(route));

    // Check if it's the homepage (landing page)
    const isHomepage = pathname === `/${locale}` || pathname === "/";

    // If user is NOT authenticated and trying to access protected route
    if (!token && isProtectedRoute) {
        const loginUrl = new URL(`/${locale}/auth/login`, request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If user IS authenticated and trying to access auth routes
    if (token && isAuthRoute) {
        const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    // For all other routes (including homepage), continue with i18n middleware
    return intlMiddleware(request);
}

export const config = {
    matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};