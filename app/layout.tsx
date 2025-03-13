"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';
import Loader from "@/components/Loader";

// Dynamic imports for client components
const ClientProvider = dynamic(() => import("../components/ClientProvider/ClientProvider"), {
  ssr: false,
  loading: () => <Loader />
});

const NavbarConditional = dynamic(() => import("@/components/navbar-profile/NavbarConditional"), {
  ssr: false,
  loading: () => null
});

// Font configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata is handled in a separate metadata.ts file for Next.js 13+ app router

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>ZehMizeh | The Jewish Freelancing Platform</title>
        <meta name="description" content="ZehMizeh - The Jewish Freelancing Platform" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProvider>
          <NavbarConditional />
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
