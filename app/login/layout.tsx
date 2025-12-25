import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your Apni Sec account to manage your security issues, track vulnerabilities, and monitor your security operations.",
  openGraph: {
    title: "Login - Apni Sec",
    description:
      "Sign in to your Apni Sec account to manage your security issues and track vulnerabilities.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
