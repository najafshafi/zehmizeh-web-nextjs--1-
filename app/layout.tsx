// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// // import 'bootstrap/dist/css/bootstrap.min.css';
// import "./globals.css";

// import ClientProvider from "../components/ClientProvider/ClientProvider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "ZehMizeh | The Jewish Freelancing Platform",
//   description: "",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

//         <ClientProvider>{children}</ClientProvider>

//       </body>
//     </html>
//   );
// }

// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "../components/ClientProvider/ClientProvider";
// import NavbarConditional from "@/components/navbar-profile/NavbarConditional";
// import FooterConditional from "@/components/footer/FooterConditional";
import { Providers } from "@/store/provider";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ClientProvider>
            {/* <NavbarConditional /> */}
            {children}
            {/* <FooterConditional /> */}
          </ClientProvider>
        </Providers>
      </body>
    </html>
  );
}
