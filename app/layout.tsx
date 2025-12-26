import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Apni Sec - Security Issue Management System",
    template: "%s | Apni Sec",
  },
  description:
    "Track and manage your Cloud Security, Red Team Assessment, and VAPT issues in one centralized platform. Secure, organized, and efficient security issue tracking.",
  keywords: [
    "security management",
    "issue tracking",
    "cloud security",
    "VAPT",
    "vulnerability assessment",
    "penetration testing",
    "red team assessment",
    "security operations",
    "vulnerability management",
    "security issue tracker",
  ],
  authors: [{ name: "Apni Sec" }],
  creator: "Apni Sec",
  publisher: "Apni Sec",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Apni Sec",
    title: "Apni Sec - Security Issue Management System",
    description:
      "Track and manage your Cloud Security, Red Team Assessment, and VAPT issues in one centralized platform.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Apni Sec - Security Issue Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apni Sec - Security Issue Management System",
    description:
      "Track and manage your Cloud Security, Red Team Assessment, and VAPT issues in one centralized platform.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "",
    yandex: "",
    yahoo: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="canonical"
          href={process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <div>{children}</div>
      </body>
    </html>
  );
}
