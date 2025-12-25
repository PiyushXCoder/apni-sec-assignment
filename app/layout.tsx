import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import logo from "./logo.svg";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apni Sec assignment",
  description: "Apni Sec assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="absolute top-0 left-0 w-fit z-50 bg-transparent">
          <div className="container mx-auto px-4 py-3">
            <Link href="/">
              <Image
                src={logo}
                alt="Logo"
                width={120}
                height={40}
                priority
                className="h-10 w-auto invert"
              />
            </Link>
          </div>
        </nav>
        <div>{children}</div>
      </body>
    </html>
  );
}
