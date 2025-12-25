"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Apni Sec</p>
        <div className="flex gap-3 justify-center">
          <Link href="/issues">
            <Button variant="default">Issues</Button>
          </Link>
          <Link href="/profile">
            <Button variant="default">Profile</Button>
          </Link>
          <Button onClick={handleLogout} disabled={isLoading} variant="outline">
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
