import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a new Apni Sec account to start managing your Cloud Security, Red Team Assessment, and VAPT issues efficiently.",
  openGraph: {
    title: "Register - Apni Sec",
    description:
      "Create a new Apni Sec account to start managing your security issues efficiently.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
