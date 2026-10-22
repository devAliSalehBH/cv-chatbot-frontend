import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getApiBaseURL } from "@/lib/apiConfig";

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

/**
 * Asks the backend whether the user has an active subscription.
 * Returns `null` when the answer is unknown (network/server error) so the
 * page-level guard in create-bot/layout.tsx can still handle it.
 */
async function hasActiveSubscription(token: string, locale: string): Promise<boolean | null> {
    try {
        const response = await fetch(`${getApiBaseURL()}/users/profile?locale=${locale}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            cache: "no-store",
        });

        // 401 (expired token) is left to the client, which logs the user out
        if (!response.ok) return null;

        const body = await response.json();
        const value = body?.data?.has_active_subscription;
        return typeof value === "boolean" ? value : null;
    } catch {
        return null;
    }
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    // Get locale from pathname
    const locale = pathname.split("/")[1]; // e.g., 'ar' or 'en'

    // Define protected routes (require authentication)
    const protectedRoutes = ["/dashboard", "/profile", "/settings", "/pricing", "/payment", "/create-bot"];

    // Routes that additionally require a paid (active) subscription
    const subscriptionRoutes = ["/create-bot"];

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

    // Create-bot is only available after payment
    const isSubscriptionRoute = subscriptionRoutes.some((route) => pathname.includes(route));
    if (token && isSubscriptionRoute) {
        const subscribed = await hasActiveSubscription(token, locale || routing.defaultLocale);
        if (subscribed === false) {
            const pricingUrl = new URL(`/${locale}/pricing`, request.url);
            return NextResponse.redirect(pricingUrl);
        }
    }

    // For all other routes (including homepage), continue with i18n middleware
    return intlMiddleware(request);
}

export const config = {
    matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
