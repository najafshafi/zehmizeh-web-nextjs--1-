This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, set up your environment variables by creating a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_BACKEND_API=https://apidev.zehmizeh.com

NEXT_PUBLIC_PUSHER_API_KEY=your_pusher_api_key
NEXT_PUBLIC_PUSHER_API_KEY_PROD=your_pusher_api_key_prod

NEXT_PUBLIC_INTERCOM_APP_ID=your_intercom_app_id
NEXT_PUBLIC_GA_TRACKING_CODE=your_api_key
NEXT_PUBLIC_WSC_WPROOFREADER_SERVICE_ID=your_api_key


NEXT_PUBLIC_TALKJS_APP_ID=your_api_key
NEXT_PUBLIC_TALKJS_APP_SECRET_KEY=your_api_key
NEXT_PUBLIC_TALKJS_APP_ID_PROD=your_api_key
NEXT_PUBLIC_TALKJS_APP_SECRET_KEY_PROD=your_api_key


```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:5005](http://localhost:5005) with your browser to see the result.

## Recent Fixes

### useSearchParams Issue Resolved

The application previously had issues during the production build with errors related to the `useSearchParams()` hook:

```
useSearchParams() should be wrapped in a suspense boundary at page "/[page]"
```

This has been fixed by:

1. Creating a safe wrapper for `useSearchParams()` in the auth-context.tsx file:

   ```typescript
   function useSafeSearchParams() {
     const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
       null
     );
     const [isClient, setIsClient] = useState(false);

     // Only call this on the client side
     const nextSearchParams =
       typeof window !== "undefined" ? useNextSearchParams() : null;

     useEffect(() => {
       setIsClient(true);
       if (nextSearchParams) {
         setSearchParams(nextSearchParams);
       }
     }, [nextSearchParams]);

     return isClient ? nextSearchParams : null;
   }
   ```

2. Adding proper client-side wrappers with Suspense boundaries for pages that access client-side hooks (like the customer-support page).

The production build now works correctly!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployed on Netlify - [Link](https://zehmizeh.netlify.app/home)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
