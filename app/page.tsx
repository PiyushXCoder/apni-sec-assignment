"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateStructuredData } from "@/lib/structured-data";

export default function Home() {
  const structuredData = generateStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative flex min-h-screen items-center justify-center font-sans overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
          aria-hidden="true"
        >
          <source src="/8470706-hd_1280_720_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 -z-10"></div>
        <main className="max-w-4xl mx-auto space-y-8 text-center p-8 relative z-10">
          <header className="space-y-4">
            <h1 className="text-6xl font-bold text-white drop-shadow-lg max-lg:text-5xl max-lg:pt-10">
              Security Issue Management - Apni Sec
            </h1>
            <p className="text-xl text-white/90 drop-shadow-md">
              Streamline your security operations with comprehensive issue
              tracking and management
            </p>
          </header>

          <section className="space-y-4">
            <p className="text-lg text-white/90 drop-shadow-md">
              Track Cloud Security vulnerabilities, Red Team Assessment
              findings, and VAPT issues in one centralized platform
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register" aria-label="Register for Apni Sec account">
                <Button
                  size="lg"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/login" aria-label="Sign in to your account">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-6 mt-12">
            <article className="p-6 rounded-lg border bg-white/90 backdrop-blur-sm dark:bg-zinc-900/90 dark:border-zinc-800">
              <div className="text-4xl mb-4" role="img" aria-label="Security">
                🔒
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Enterprise-Grade Security
              </h3>
              <p className="text-sm text-muted-foreground">
                JWT-based authentication with advanced rate limiting and bcrypt
                password hashing
              </p>
            </article>
            <article className="p-6 rounded-lg border bg-white/90 backdrop-blur-sm dark:bg-zinc-900/90 dark:border-zinc-800">
              <div
                className="text-4xl mb-4"
                role="img"
                aria-label="Organization"
              >
                📊
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Comprehensive Organization
              </h3>
              <p className="text-sm text-muted-foreground">
                Categorize and prioritize security issues by type, severity, and
                current status
              </p>
            </article>
            <article className="p-6 rounded-lg border bg-white/90 backdrop-blur-sm dark:bg-zinc-900/90 dark:border-zinc-800">
              <div
                className="text-4xl mb-4"
                role="img"
                aria-label="Notifications"
              >
                📧
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Real-Time Notifications
              </h3>
              <p className="text-sm text-muted-foreground">
                Instant email alerts for critical security events and issue
                updates
              </p>
            </article>
          </section>
        </main>
      </div>
    </>
  );
}
