import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/providers/AuthProvider";
import UnifiedQueryProvider from "@/providers/UnifiedQueryProvider";
import ReduxProvider from "@/providers/reduxProvider";
import IntercomProvider from "@/providers/IntercomProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import ClientLayout from "@/components/layout/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZehMizeh | The Jewish Freelancing Platform",
  description:
    "ZehMizeh is the Jewish freelancing platform, connecting businesses with skilled freelancers. Find remote talent for your projects today!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <IntercomProvider>
          <AuthProvider>
            <UnifiedQueryProvider>
              <ReduxProvider>
                <ThemeProvider>
                  <ClientLayout>{children}</ClientLayout>
                  <Toaster position="top-center" />
                </ThemeProvider>
              </ReduxProvider>
            </UnifiedQueryProvider>
          </AuthProvider>
        </IntercomProvider>
      </body>
    </html>
  );
}
