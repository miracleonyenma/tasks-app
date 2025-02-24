import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/Site/Header";

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
      >
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
