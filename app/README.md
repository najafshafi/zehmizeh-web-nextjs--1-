# App Router Implementation

This directory contains the Next.js App Router implementation for the application.

## Added Routes

- `/messages` - Renders the original messaging page component from `/pages/messaging-page/index.tsx`
- `/messages-new` - Renders the new messaging page component from `/pages/newmessaging-page/index.tsx`

## Implementation Notes

### Dynamic Imports

All page components are imported dynamically with `ssr: false` to avoid hydration issues and ensure compatibility between the Pages Router components and App Router.

### Middleware

A middleware.ts file has been added to the root directory to ensure proper routing between pages and app router paths.

### Folder Structure

Each route has its own folder with:

- `page.tsx` - The main page component that renders the legacy component
- `layout.tsx` - A simple layout wrapper
- `route.ts` - Handling any API requests to the same path
- `README.md` - Documentation for the route

## Usage

Access the routes at:

- http://localhost:5005/messages
- http://localhost:5005/messages-new
