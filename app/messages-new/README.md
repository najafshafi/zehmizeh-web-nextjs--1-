# New Messaging Route

This directory contains the app router implementation for the `/messages-new` route.

## Structure

- `page.tsx`: The main entry point for the route that loads the new messaging page component from `/pages/newmessaging-page/index.tsx`

## Notes

- The component is wrapped in a dynamic import and Suspense to ensure proper loading and hydration
- SSR is disabled for this component to avoid hydration issues
- No code was removed from the original implementation
