# NextAuth Integration for Frontend Project

This document explains how to set up and configure NextAuth in the ZehMizeh frontend application without requiring a database.

## Overview

This implementation:

- Uses NextAuth with JWT strategy (no database required)
- Integrates with your existing APIs for authentication
- Maintains compatibility with your existing token system
- Uses TanStack Query (formerly React Query) for data fetching

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:5005
NEXTAUTH_SECRET=your_nextauth_secret_key

# OAuth Providers (Optional - if you want to add social logins)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# API Configuration
NEXT_PUBLIC_BACKEND_API=http://localhost:8000/api/
NEXT_PUBLIC_FRONTEND_URL=http://localhost:5005

# Intercom Configuration
NEXT_PUBLIC_INTERCOM_APP_ID=your_intercom_app_id

# Analytics
NEXT_PUBLIC_GA_TRACKING_CODE=your_ga_tracking_code

# Revalidation
REVALIDATION_TOKEN=your_revalidation_secret_token
```

## Authentication Integration

### Using NextAuth in Components

```jsx
"use client";

import { useAuth } from "@/helpers/hooks/useAuth";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Login Form Integration

Update your login forms to use the new auth hooks:

```jsx
"use client";

import { useAuth } from "@/helpers/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login.mutateAsync({
        email_id: email,
        password,
      });

      if (!result?.error) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

## Server-Side Data Fetching

For server components, use the data fetching utilities:

```jsx
// In a Server Component
import { fetchApi } from "@/lib/fetch";

export default async function JobsPage() {
  const jobs = await fetchApi("/jobs/list", {
    tags: ["jobs"],
    revalidate: 60, // Cache for 60 seconds
  });

  return (
    <div>
      <h1>Jobs</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>{job.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## How It Works

1. **Token Management**:

   - Your API token is stored in the NextAuth JWT token
   - The JWT is encrypted and stored in cookies by NextAuth
   - The API token is also stored in localStorage for backward compatibility

2. **Authentication Flow**:

   - Login via your existing API endpoints
   - NextAuth creates a session using the response
   - Both NextAuth session and your API token can be used for authentication

3. **Coexistence with Existing Code**:
   - Middleware checks for both NextAuth session and legacy token
   - Existing code that uses the token from localStorage continues to work
   - New code can use the NextAuth session

## Migration Strategy

You can gradually migrate components to use NextAuth:

1. Start by using NextAuth for new components
2. Existing components can continue using the current auth approach
3. When refactoring, update components to use the new `useAuth` hook
