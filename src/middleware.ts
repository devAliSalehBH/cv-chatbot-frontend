import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    const protectedRoutes = ["/dashboard", "/profile", "/settings"];
    const authRoutes = [
        "/auth/login",
        "/auth/signup",
        "/auth/verify-otp",
        "/auth/forgot-password",
    ];

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.includes(route)
    );

    const isAuthRoute = authRoutes.some((route) =>
        pathname.includes(route)
    );

    const intlResponse = intlMiddleware(request);
    if (intlResponse) {
        return intlResponse;
    }

    const segments = pathname.split("/");
    const locale = segments[1] || "en";
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(
            new URL(`/${locale}/auth/login`, request.url)
        );
    }
    if (token && isAuthRoute) {
        return NextResponse.redirect(
            new URL(`/${locale}/dashboard`, request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};