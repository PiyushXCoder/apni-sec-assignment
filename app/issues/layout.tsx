import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Issues",
  description:
    "Manage and track all your security issues including Cloud Security vulnerabilities, Red Team Assessment findings, and VAPT results.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function IssuesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
