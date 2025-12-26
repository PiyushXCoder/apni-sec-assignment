"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/app/logo.svg";

export default function NavbarClient({ hasAccessToken }: { hasAccessToken: boolean }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const homeLink = hasAccessToken ? "/dashboard" : "/";

  return (
    <nav className="absolute top-0 left-0 w-fit z-50 bg-transparent">
      <div className="container mx-auto px-4 py-3">
        <Link href={homeLink}>
          <Image
            src={logo}
            alt="Logo"
            width={120}
            height={40}
            priority
            className={`h-10 w-auto ${isHomePage ? "invert" : ""}`}
          />
        </Link>
      </div>
    </nav>
  );
}
