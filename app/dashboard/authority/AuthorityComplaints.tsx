
"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

type Complaint = {
  id: string;
  complaint_code: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  priority: "low" | "medium" | "high" | "urgent";
  status:
    | "Submitted"
    | "Under Review"
    | "In Progress"
    | "Resolved"
    | "Rejected";
  evidence_name: string | null;
  evidence_path?: string | null;
  created_at: string;
  updated_at?: string | null;
};

const STATUSES = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
  "Rejected",
] as const;

const STATUS_STYLES: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-700",
  "Under Review": "bg-amber-100 text-amber-700",
  "In Progress": "bg-purple-100 text-purple-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

export default function AuthorityComplaints() {
  const supabase = createClient();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [updatingId, setUpdatingId] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [evidenceLoading, setEvidenceLoading] = useState(false);

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    setError("");
    setAccessDenied(false);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setSignedIn(false);
        setError(
          "No active Supabase session found. Please sign in using your Supabase Auth account."
        );
        return;
      }

      setSignedIn(true);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || profile?.role !== "authority") {
        setAccessDenied(true);
        return;
      }

      const { data, error: complaintsError } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

      if (complaintsError) {
        throw complaintsError;
      }

      setComplaints((data ?? []) as Complaint[]);
    } catch (err) {
      console.error("Authority dashboard error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not load complaints. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void loadComplaints();
  }, [loadComplaints]);

  const updateStatus = async (
    complaint: Complaint,
    newStatus: Complaint["status"]
  ) => {
    if (complaint.status === newStatus) return;

    setUpdatingId(complaint.id);
    setError("");

    try {
      const { data, error: updateError } = await supabase
        .from("complaints")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", complaint.id)
        .select("*")
        .single();

      if (updateError) throw updateError;

      const updatedComplaint = data as Complaint;

      setComplaints((previous) =>
        previous.map((item) =>
          item.id === complaint.id ? updatedComplaint : item
        )
      );

      setSelected((previous) =>
        previous?.id === complaint.id ? updatedComplaint : previous
      );
    } catch (err) {
      console.error("Status update error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Status update failed. Please try again."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const openComplaint = async (complaint: Complaint) => {
    setSelected(complaint);
    setEvidenceUrl("");
    setEvidenceLoading(false);

    if (!complaint.evidence_path) return;

    setEvidenceLoading(true);

    try {
      const { data, error: storageError } = await supabase.storage
        .from("complaint-evidence")
        .createSignedUrl(complaint.evidence_path, 300);

      if (storageError) throw storageError;

      setEvidenceUrl(data.signedUrl);
    } catch (err) {
      console.error("Evidence access error:", err);
      setError(
        "Evidence could not be opened. Check the Storage policies and evidence path."
      );
    } finally {
      setEvidenceLoading(false);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus =
      filter === "All" || complaint.status === filter;

    const searchText = search.toLowerCase();

    const matchesSearch = [
      complaint.complaint_code,
      complaint.title,
      complaint.category,
      complaint.location,
      complaint.description,
    ].some((value) => value?.toLowerCase().includes(searchText));

    return matchesStatus && matchesSearch;
  });

  const counts = {
    total: complaints.length,
    submitted: complaints.filter((c) => c.status === "Submitted").length,
    progress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading authority dashboard...
        </div>
      </main>
    );
  }

  if (accessDenied) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h1 className="text-2xl font-bold text-slate-900">
            Access denied
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            This dashboard is only available to accounts with the authority
            role. Ask the project administrator to assign your role.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  if (!signedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
          <h1 className="text-2xl font-bold text-slate-900">
            Sign in required
          </h1>
          <p className="mt-3 text-sm text-slate-600">{error}</p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-900 p-3 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">
                Authority Dashboard
              </h1>
              <p className="text-sm text-slate-500">
                CivicProof · Complaint management
              </p>
            </div>
          </div>

          <button
            onClick={() => void loadComplaints()}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total complaints",
              value: counts.total,
              icon: FileText,
              color: "text-blue-600",
            },
            {
              label: "New submissions",
              value: counts.submitted,
              icon: AlertCircle,
              color: "text-amber-600",
            },
            {
              label: "In progress",
              value: counts.progress,
              icon: Clock,
              color: "text-purple-600",
            },
            {
              label: "Resolved",
              value: counts.resolved,
              icon: CheckCircle2,
              color: "text-emerald-600",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <p className="mt-3 text-3xl font-bold">{item.value}</p>
              </div>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-4 border-b border-slate-200 p-5 sm:flex sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h2 className="text-lg font-bold">All complaints</h2>
              <p className="mt-1 text-sm text-slate-500">
                Review reports and update their status.
              </p>
            </div>

            <div className="relative sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaints..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-500"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-slate-200 p-4">
            {["All", ...STATUSES].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === status
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
                {status === "All" ? ` (${complaints.length})` : ""}
              </button>
            ))}
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-4 font-semibold">No complaints found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Try changing the search or status filter.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Complaint</th>
                      <th className="px-5 py-4">Priority</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredComplaints.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <p className="font-semibold">
                            {complaint.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {complaint.complaint_code} · {complaint.category}
                          </p>
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                            {complaint.location}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                              PRIORITY_STYLES[complaint.priority] ??
                              PRIORITY_STYLES.low
                            }`}
                          >
                            {complaint.priority}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              STATUS_STYLES[complaint.status] ??
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {complaint.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                          {new Date(complaint.created_at).toLocaleDateString(
                            "en-IN"
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => void openComplaint(complaint)}
                            className="rounded-lg border border-slate-200 px-3 py-2 font-semibold hover:bg-slate-100"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 p-4 md:hidden">
                {filteredComplaints.map((complaint) => (
                  <article
                    key={complaint.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          STATUS_STYLES[complaint.status]
                        }`}
                      >
                        {complaint.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {complaint.complaint_code}
                      </span>
                    </div>
                    <h3 className="mt-3 font-bold">{complaint.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {complaint.category} · {complaint.location}
                    </p>
                    <button
                      onClick={() => void openComplaint(complaint)}
                      className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      View details
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="complaint-dialog-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {selected.complaint_code}
                </p>
                <h2
                  id="complaint-dialog-title"
                  className="mt-2 text-xl font-bold"
                >
                  {selected.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.category}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                aria-label="Close complaint details"
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Location</p>
                <p className="mt-1 text-sm font-semibold">
                  {selected.location}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Priority</p>
                <p className="mt-1 text-sm font-semibold capitalize">
                  {selected.priority}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Submitted</p>
                <p className="mt-1 text-sm font-semibold">
                  {new Date(selected.created_at).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Last updated</p>
                <p className="mt-1 text-sm font-semibold">
                  {selected.updated_at
                    ? new Date(selected.updated_at).toLocaleString("en-IN")
                    : "Not available"}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="font-semibold">Description</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {selected.description}
              </p>
            </div>

            <div className="mt-5">
              <h3 className="font-semibold">Evidence</h3>

              {selected.evidence_path ? (
                <div className="mt-2">
                  {evidenceLoading ? (
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading evidence...
                    </p>
                  ) : evidenceUrl ? (
                    <a
                      href={evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open evidence
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Evidence link is unavailable.
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  {selected.evidence_name || "No evidence attached."}
                </p>
              )}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <label
                htmlFor="complaint-status"
                className="text-sm font-semibold"
              >
                Update complaint status
              </label>

              <select
                id="complaint-status"
                value={selected.status}
                disabled={updatingId === selected.id}
                onChange={(e) =>
                  void updateStatus(
                    selected,
                    e.target.value as Complaint["status"]
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 disabled:opacity-60"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              {updatingId === selected.id && (
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating status...
                </p>
              )}

              <button
                onClick={() => setSelected(null)}
                className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
