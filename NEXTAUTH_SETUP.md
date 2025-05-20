# NextAuth Integration Setup

This document explains how to set up and configure NextAuth in the ZehMizeh application.

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/zehmiez_db"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:5005
NEXTAUTH_SECRET=your_nextauth_secret_key

# OAuth Providers
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

## Database Setup

1. Set up your PostgreSQL database
2. Initialize the Prisma client:

```bash
npx prisma generate
npx prisma db push
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

For server components, use the new data fetching utilities:

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

## Cache Revalidation

To revalidate the cache after data changes:

```jsx
"use client";

import { mutateData } from "@/lib/fetch";
import { useState } from "react";

export default function CreateJobForm() {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await mutateData("/jobs/create", "POST", { title }, ["jobs"]);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit">Create Job</button>
    </form>
  );
}
```

## Migration Notes

- The application now uses a hybrid authentication system that supports both NextAuth and the legacy token-based system
- The middleware checks for both NextAuth sessions and legacy tokens
- Zustand user store has been preserved for backward compatibility
- Redux auth state will continue to work alongside NextAuth
