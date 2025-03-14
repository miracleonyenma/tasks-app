import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import SiteHeader from "@/components/Site/Header";
import { Toaster } from "sonner";
import "./globals.css";

const RethinkSans = Rethink_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tasks App",
  description: "A simple tasks app built with Next.js and Firebase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${RethinkSans.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <SiteHeader />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
