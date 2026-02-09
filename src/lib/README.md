# API Configuration

This directory contains the API configuration and client setup for the application.

## Files

- **`apiConfig.ts`** - Base URL configuration from environment variables
- **`api.ts`** - Main axios client with interceptors (works in both client and server)

## Usage

### Client Side (Browser)

```typescript
"use client";
import { apiPost } from "@/lib/api";

export default function LoginForm() {
  const handleLogin = async () => {
    try {
      const response = await apiPost(
        "/auth/login",
        {
          email: "user@example.com",
          password: "password123",
        },
        {
          locale: "ar", // Optional, defaults to 'en'
        },
      );

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
}
```

### Server Side (Server Components/Actions)

```typescript
import { apiGet } from "@/lib/api";

export async function getUserData(userId: string) {
  try {
    const response = await apiGet(`/users/${userId}`, {
      token: "server-token", // Optional
      locale: "en",
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
```

## Features

- ✅ Automatic token injection from localStorage
- ✅ Automatic 401 handling (redirect to login)
- ✅ Locale support on all requests
- ✅ TypeScript support
- ✅ Error handling with interceptors
- ✅ Works in both client and server environments

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com/api
```
