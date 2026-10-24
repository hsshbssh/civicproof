
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShieldCheck,
  Users,
  Building2,
  HardHat,
  ClipboardCheck,
  ArrowRight,
  LockKeyhole,
  Info,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const roles = [
  {
    id: "citizen",
    title: "Citizen",
    description: "Report civic issues and track complaints.",
    icon: Users,
  },
  {
    id: "authority",
    title: "Government Authority",
    description: "Manage projects, assignments and escalations.",
    icon: Building2,
  },
  {
    id: "contractor",
    title: "Contractor",
    description: "Update assigned work and submit evidence.",
    icon: HardHat,
  },
  {
    id: "inspector",
    title: "Independent Inspector",
    description: "Inspect work and record verification results.",
    icon: ClipboardCheck,
  },
];

export default function LoginPage() {
  const [selected, setSelected] = useState("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const supabase = createClient();

  const handleAuth = async () => {
    setAuthError("");
    setAuthMessage("");

    if (!email.trim() || !password) {
      setAuthError("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }

    setAuthLoading(true);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: email.trim().split("@")[0],
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          // Signup may automatically sign in when email confirmation is disabled.
          window.location.href =
            selected === "citizen"
              ? "/complaints/new"
              : `/dashboard/${selected}`;
        } else {
          setAuthMessage(
            "Account created! Check your email to verify your account, then sign in."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        // The role selection does not grant permissions.
        // Authority access must be assigned and checked by the backend.
        window.location.href =
          selected === "citizen"
            ? "/complaints/new"
            : `/dashboard/${selected}`;
      }
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Authentication failed. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-2">
        <section className="relative overflow-hidden bg-[#102b46] p-8 text-white sm:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />

          <Link href="/" className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <ShieldCheck size={25} />
            </div>
            <span className="text-xl font-black">
              Civic<span className="text-teal-300">Proof</span>
            </span>
          </Link>

          <div className="relative mt-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
              Public accountability
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Trust should be built on proof.
            </h1>

            <p className="mt-5 max-w-sm leading-7 text-slate-300">
              Connect civic complaints, public works, evidence and independent
              verification in one transparent workflow.
            </p>
          </div>

          <div className="relative mt-12 space-y-4">
            {[
              "Track issues from report to resolution",
              "Keep progress evidence attached to work",
              "Separate contractor claims from inspection",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 text-sm text-slate-200"
              >
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-teal-300"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="relative mt-16 text-xs text-slate-400">
            CivicProof prototype · Not an official government portal
          </p>
        </section>

        <section className="p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Welcome to CivicProof
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight">
            Choose your workspace
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Select a role to explore its workspace. Your selection does not
            grant access to protected dashboards.
          </p>

          <div className="mt-7 space-y-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const active = selected === role.id;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelected(role.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-teal-500 bg-teal-50 ring-2 ring-teal-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      active
                        ? "bg-teal-700 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{role.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {role.description}
                    </p>
                  </div>

                  <span
                    className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                      active
                        ? "border-teal-600 bg-teal-600 ring-2 ring-teal-100"
                        : "border-slate-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-7 space-y-4 border-t border-slate-200 pt-6">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !authLoading) {
                    void handleAuth();
                  }
                }}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            {authError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {authError}
              </div>
            )}

            {authMessage && (
              <div
                role="status"
                className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800"
              >
                {authMessage}
              </div>
            )}

            <button
              type="button"
              disabled={authLoading}
              onClick={() => void handleAuth()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#102b46] px-5 py-4 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {isSignup ? "Create account" : "Sign in"}
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-600">
              {isSignup
                ? "Already have an account?"
                : "New to CivicProof?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignup((previous) => !previous);
                  setAuthError("");
                  setAuthMessage("");
                }}
                className="font-bold text-teal-700 hover:underline"
              >
                {isSignup ? "Sign in" : "Create account"}
              </button>
            </p>
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            <Info size={16} className="mt-0.5 shrink-0" />
            <p>
              Selecting a role does not verify your identity or grant
              permissions. Authority, contractor and inspector access must be
              authorized separately.
            </p>
          </div>

          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
            <LockKeyhole size={14} />
            Authentication powered by Supabase
          </p>

          <p className="mt-4 text-center text-xs text-slate-500">
            <Link href="/" className="font-medium hover:text-teal-700">
              Back to home
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
