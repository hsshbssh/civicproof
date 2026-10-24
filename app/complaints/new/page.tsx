
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const categories = [
  "Roads & potholes",
  "Drainage & waterlogging",
  "Water supply & leakage",
  "Waste management",
  "Streetlights",
  "Footpaths & public infrastructure",
  "Other civic issue",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function NewComplaintPage() {
  const [category, setCategory] = useState(categories[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError("");

    if (title.trim().length < 5 || title.trim().length > 100) {
      setError("Title must be between 5 and 100 characters.");
      return;
    }

    if (
      description.trim().length < 20 ||
      description.trim().length > 1500
    ) {
      setError("Description must be between 20 and 1,500 characters.");
      return;
    }

    if (location.trim().length < 5 || location.trim().length > 200) {
      setError("Location must be between 5 and 200 characters.");
      return;
    }

    if (evidenceFile) {
      if (!ALLOWED_TYPES.includes(evidenceFile.type)) {
        setError("Please select a JPG, PNG or WebP image.");
        return;
      }

      if (evidenceFile.size > MAX_FILE_SIZE) {
        setError("Image must be 5 MB or smaller.");
        return;
      }
    }

    setSubmitting(true);

    const supabase = createClient();
    let uploadedPath: string | null = null;

    try {
      // Require a real Supabase Auth session.
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(
          "Please sign in using Supabase Auth before submitting a complaint."
        );
      }

      // Upload evidence to the private bucket, if a file was selected.
      if (evidenceFile) {
        const extension = evidenceFile.name.split(".").pop()?.toLowerCase();

        const safeExtension =
          extension && ["jpg", "jpeg", "png", "webp"].includes(extension)
            ? extension
            : "jpg";

        const filePath = `${user.id}/${crypto.randomUUID()}.${safeExtension}`;

        const { error: uploadError } = await supabase.storage
          .from("complaint-evidence")
          .upload(filePath, evidenceFile, {
            contentType: evidenceFile.type,
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        uploadedPath = filePath;
      }

      // Save the complaint and evidence path in Supabase.
      const { data, error: insertError } = await supabase
        .from("complaints")
        .insert({
          user_id: user.id,
          title: title.trim(),
          category,
          description: description.trim(),
          location: location.trim(),
          priority: priority.toLowerCase(),
          status: "Submitted",
          evidence_name: evidenceFile?.name ?? null,
          evidence_path: uploadedPath,
        })
        .select("complaint_code")
        .single();

      if (insertError) {
        // Avoid leaving an orphaned file if the database insert fails.
        if (uploadedPath) {
          const { error: cleanupError } = await supabase.storage
            .from("complaint-evidence")
            .remove([uploadedPath]);

          if (cleanupError) {
            console.error("Evidence cleanup failed:", cleanupError.message);
          }
        }

        throw new Error(`Complaint could not be saved: ${insertError.message}`);
      }

      setSuccessId(data.complaint_code);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (successId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 size={34} />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Complaint submitted
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Submission recorded
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Save this reference ID to track your complaint.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold text-slate-500">
              Complaint reference
            </p>
            <p className="mt-2 break-all text-2xl font-black tracking-wide">
              {successId}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={`/complaints/track/${encodeURIComponent(successId)}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#102b46] px-5 py-4 text-sm font-bold text-white hover:bg-teal-700"
            >
              Track complaint <ArrowRight size={17} />
            </Link>

            <Link
              href="/dashboard/citizen"
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Return to dashboard
            </Link>
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Your complaint is recorded in CivicProof. This does not by itself
            mean a government department has accepted or resolved it.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102b46] text-white">
              <ShieldCheck size={22} />
            </div>
            <span className="text-lg font-black">
              Civic<span className="text-teal-600">Proof</span>
            </span>
          </Link>

          <Link
            href="/dashboard/citizen"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700"
          >
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <Link
          href="/dashboard/citizen"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-700"
        >
          <ArrowLeft size={16} /> Back to citizen dashboard
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_300px]">
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
              Citizen services
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Report a civic issue
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Provide accurate details so the responsible authority can review
              and assign the issue.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
            >
              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-bold">
                  Issue category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-bold">
                  Short title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  minLength={5}
                  maxLength={100}
                  placeholder="e.g. Large pothole near the market entrance"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
                />
                <p className="mt-2 text-xs text-slate-400">
                  5–100 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-bold"
                >
                  Describe the issue <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  minLength={20}
                  maxLength={1500}
                  rows={5}
                  placeholder="Explain what happened, how long it has been present and how it affects the area."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
                />
                <p className="mt-2 text-xs text-slate-400">
                  20–1,500 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 flex items-center gap-2 text-sm font-bold"
                >
                  <MapPin size={16} className="text-teal-700" />
                  Issue location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  required
                  minLength={5}
                  maxLength={200}
                  placeholder="Area, sector, street or nearby landmark"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Avoid private home details unless necessary.
                </p>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="mb-2 block text-sm font-bold"
                >
                  Suggested priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <p className="mt-2 text-xs text-slate-400">
                  This is the citizen&apos;s suggestion, not an official severity decision.
                </p>
              </div>

              <div>
                <label
                  htmlFor="evidence"
                  className="mb-2 block text-sm font-bold"
                >
                  Supporting photo (optional)
                </label>

                <label
                  htmlFor="evidence"
                  className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-slate-300 p-4 transition hover:border-teal-400 hover:bg-teal-50/50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Upload size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">Choose an image</p>
                    <p className="mt-1 text-xs text-slate-500">
                      JPG, PNG or WebP · Maximum 5 MB
                    </p>
                    {evidenceFile && (
                      <p className="mt-2 break-all text-xs font-semibold text-teal-700">
                        {evidenceFile.name}
                      </p>
                    )}
                  </div>

                  {evidenceFile && (
                    <button
                      type="button"
                      aria-label="Remove selected image"
                      onClick={(event) => {
                        event.preventDefault();
                        setEvidenceFile(null);
                        setError("");
                        const input = document.getElementById(
                          "evidence"
                        ) as HTMLInputElement | null;
                        if (input) input.value = "";
                      }}
                      className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-red-600"
                    >
                      <X size={17} />
                    </button>
                  )}

                  <input
                    id="evidence"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (!file) {
                        setEvidenceFile(null);
                        return;
                      }

                      if (!ALLOWED_TYPES.includes(file.type)) {
                        setError("Please select a JPG, PNG or WebP image.");
                        setEvidenceFile(null);
                        event.target.value = "";
                        return;
                      }

                      if (file.size > MAX_FILE_SIZE) {
                        setError("Image must be 5 MB or smaller.");
                        setEvidenceFile(null);
                        event.target.value = "";
                        return;
                      }

                      setError("");
                      setEvidenceFile(file);
                    }}
                  />
                </label>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  The photo will be uploaded to private Supabase Storage.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#102b46] px-5 py-4 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    {evidenceFile ? "Uploading evidence..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    Submit complaint <ArrowRight size={17} />
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-slate-400">
                Submitting saves a complaint record in CivicProof. It does not
                automatically contact a government department.
              </p>
            </form>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                <FileText size={22} />
              </div>
              <h2 className="mt-4 font-extrabold">What happens next?</h2>

              <ol className="mt-4 space-y-4">
                {[
                  ["01", "Complaint recorded", "A reference ID is created."],
                  [
                    "02",
                    "Authority review",
                    "The responsible team can review and assign it.",
                  ],
                  [
                    "03",
                    "Track progress",
                    "Follow updates and eventual verification.",
                  ],
                ].map(([number, heading, detail]) => (
                  <li key={number} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-600">
                      {number}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{heading}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <ShieldCheck size={22} className="text-blue-800" />
              <h2 className="mt-3 font-extrabold text-blue-950">
                Evidence matters
              </h2>
              <p className="mt-2 text-sm leading-6 text-blue-900/80">
                Share factual details. A complaint requests a review; it is not
                proof that a person or organisation has done something wrong.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
