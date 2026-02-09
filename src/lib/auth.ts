import { NextResponse } from "next/server";

/**
 * Set authentication token in cookies
 */
export function setAuthToken(token: string) {
    // Only run on client-side
    if (typeof window !== "undefined") {
        // Set in localStorage for client-side access
        localStorage.setItem("token", token);

        // Set in cookies for server-side (middleware) access
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
}

/**
 * Set user profile in localStorage and cookies
 */
export function setUserProfile(user: any) {
    if (typeof window !== "undefined") {
        localStorage.setItem("profile", JSON.stringify(user));
    }
}

/**
 * Clear authentication (logout)
 */
export function clearAuth() {
    // Only run on client-side
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("profile");
        localStorage.removeItem("pending_verification_email");

        // Clear token cookie
        document.cookie = "token=; path=/; max-age=0";
    }
}

/**
 * Get token from localStorage
 */
export function getAuthToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
}

/**
 * Get user profile from localStorage
 */
export function getUserProfile(): any | null {
    if (typeof window !== "undefined") {
        const profile = localStorage.getItem("profile");
        return profile ? JSON.parse(profile) : null;
    }
    return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!getAuthToken();
}
