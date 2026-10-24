"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  FileText,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Complaint = {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  evidenceName: string;
  createdAt: string;
};

function TrackComplaintContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = decodeURIComponent(params.id);

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadComplaint() {
      setLoading(true);
      setError("");

      try {
        const supabase = createClient();

        // A user can only retrieve complaints allowed by the database RLS policy.
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          throw new Error("Please log in with the account used to submit this complaint.");
        }

        const { data, error: fetchError } = await supabase
          .from("complaints")
          .select(
            "complaint_code, title, category, description, location, priority, status, evidence_name, created_at"
          )
          .eq("complaint_code", id)
          .single();

        if (fetchError) throw fetchError;

        if (!cancelled) {
          setComplaint({
            id: data.complaint_code,
            title: data.title,
            category: data.category,
            description: data.description,
            location: data.location,
            priority: data.priority,
            status: data.status,
            evidenceName: data.evidence_name ?? "",
            createdAt: data.created_at,
          });
        }
      } catch (err) {
        console.error("Unable to load complaint:", err);

        if (!cancelled) {
          setComplaint(null);
          setError(
            err instanceof Error
              ? err.message
              : "Could not load complaint details."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadComplaint();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
        <div className="text-center">
          <RefreshCw size={26} className="mx-auto animate-spin text-teal-700" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading complaint details...
          </p>
        </div>
      </main>
    );
  }

  if (!complaint) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle size={40} className="mx-auto mb-4 text-amber-500" />

          <h1 className="text-xl font-bold text-slate-900">
            Unable to load complaint
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error ||
              "This complaint could not be found or you may not have permission to view it."}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => router.refresh()}
              className="rounded-xl bg-[#102b46] px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Try again
            </button>

            <Link
              href="/dashboard/citizen"
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const statusStyles: Record<string, string> = {
    Submitted: "bg-blue-50 text-blue-700",
    "Under Review": "bg-amber-50 text-amber-700",
    "In Progress": "bg-indigo-50 text-indigo-700",
    Resolved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-700",
  };

  const createdDate = complaint.createdAt
    ? new Date(complaint.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Date unavailable";

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/citizen"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-700">
              CivicProof · Complaint tracking
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              {complaint.title}
            </h1>

            <p className="mt-2 break-all text-sm text-slate-500">
              Complaint ID: {complaint.id}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${
              statusStyles[complaint.status] ??
              "bg-slate-100 text-slate-700"
            }`}
          >
            {complaint.status}
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Complaint details
            </h2>

            <div className="mt-5 space-y-5">
              <div className="flex gap-3">
                <FileText
                  className="mt-0.5 shrink-0 text-teal-700"
                  size={20}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Category
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {complaint.category}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin
                  className="mt-0.5 shrink-0 text-teal-700"
                  size={20}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Location
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {complaint.location}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <AlertCircle
                  className="mt-0.5 shrink-0 text-teal-700"
                  size={20}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Priority
                  </p>
                  <p className="mt-1 text-sm capitalize text-slate-600">
                    {complaint.priority}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Description
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {complaint.description}
                </p>
              </div>

              {complaint.evidenceName && (
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Evidence filename
                  </p>
                  <p className="mt-1 break-all text-sm text-slate-600">
                    {complaint.evidenceName}
                  </p>
                  <p className="mt-1 text-xs text-amber-700">
                    Only the filename is stored currently; the image itself has
                    not been uploaded.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Status timeline
            </h2>

            <div className="mt-6 flex gap-3">
              <div className="flex flex-col items-center">
                <CheckCircle2
                  className="shrink-0 text-teal-600"
                  size={22}
                />
                <div className="mt-2 min-h-10 w-px bg-slate-200" />
              </div>

              <div className="pb-5">
                <p className="text-sm font-semibold text-slate-800">
                  Complaint submitted
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Your complaint was saved in the CivicProof database.
                </p>
                <p className="mt-2 text-xs text-slate-400">{createdDate}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock3 className="shrink-0 text-slate-400" size={22} />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Current status: {complaint.status}
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  This shows the status currently stored in the database.
                  Further authority updates require the authority workflow to
                  be connected.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarDays size={17} />
                Submission record
              </div>

              <p className="mt-2 break-all text-xs leading-5 text-slate-500">
                Reference ID: {complaint.id}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-teal-900">
                <ShieldCheck size={17} />
                Accountability record
              </div>
              <p className="mt-2 text-xs leading-5 text-teal-800">
                A submitted complaint is not proof that the issue has been
                inspected or resolved. Verification should be recorded
                separately.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function TrackComplaintPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
          <p className="text-sm font-semibold text-slate-500">
            Loading complaint...
          </p>
        </main>
      }
    >
      <TrackComplaintContent />
    </Suspense>
  );
}