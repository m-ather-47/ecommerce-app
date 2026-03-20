"use client";

import { AuthView } from "@neondatabase/auth/react/ui";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
              <span className="text-2xl font-bold text-white">V</span>
            </div>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to your account to continue
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <AuthView pathname="sign-in" />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="font-medium text-gray-900 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
