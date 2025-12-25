"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center font-sans overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/8470706-hd_1280_720_25fps.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50 -z-10"></div>
      <div className="max-w-4xl mx-auto space-y-8 text-center p-8 relative z-10">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            Apni Sec
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
            Manage your security issues with ease
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-white/90 drop-shadow-md">
            Track Cloud Security, Reteam Assessment, and VAPT issues in one
            place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="default" className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-lg border bg-white/90 backdrop-blur-sm dark:bg-zinc-900/90 dark:border-zinc-800">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold mb-2">Secure</h3>
            <p className="text-sm text-muted-foreground">
              JWT-based authentication with rate limiting
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-white/90 backdrop-blur-sm dark:bg-zinc-900/90 dark:border-zinc-800">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Organized</h3>
            <p className="text-sm text-muted-foreground">
              Track issues by type, priority, and status
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-white/90 backdrop-blur-sm dark:bg-zinc-900/90 dark:border-zinc-800">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-lg font-semibold mb-2">Notified</h3>
            <p className="text-sm text-muted-foreground">
              Email notifications for all important events
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
