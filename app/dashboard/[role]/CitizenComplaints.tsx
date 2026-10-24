
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  MapPin,
  Plus,
  ArrowUpRight,
  Inbox,
} from "lucide-react";

type Complaint = {
  id: string;
  title: string;
  category: string;
  location: string;
  status: string;
  priority?: string;
  description?: string;
};

const statusStyles: Record<string, string> = {
  Submitted: "bg-blue-50 text-blue-700",
  "Under Review": "bg-amber-50 text-amber-700",
  "In Progress": "bg-teal-50 text-teal-700",
  Resolved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
};

export default function CitizenComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("civicproof_complaints");
      const parsed: unknown = saved ? JSON.parse(saved) : [];

      if (Array.isArray(parsed)) {
        setComplaints(parsed as Complaint[]);
      }
    } catch (error) {
      console.error("Could not load complaints:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  return (
    <section
      id="my-complaints"
      className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
            Citizen services
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900">
            My complaints
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Follow the progress of issues you have reported.
          </p>
        </div>

        <Link
          href="/complaints/new"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#102b46] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#193e60]"
        >
          <Plus size={17} />
          Report an issue
        </Link>
      </div>

      <div className="p-5 sm:p-6">
        {!loaded ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Loading complaints...
          </p>
        ) : complaints.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
            <Inbox className="mx-auto text-slate-400" size={34} />
            <h3 className="mt-4 font-bold text-slate-800">
              No complaints yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Report a civic issue to start tracking its progress here.
            </p>
            <Link
              href="/complaints/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Create your first complaint
              <ArrowUpRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map((complaint) => (
              <article
                key={complaint.id}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-teal-300 sm:p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                      <FileText size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="break-words font-bold text-slate-900">
                        {complaint.title || "Untitled complaint"}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {complaint.id} · {complaint.category}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                      statusStyles[complaint.status] ||
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {complaint.status || "Submitted"}
                  </span>
                </div>

                <p className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>{complaint.location || "Location not provided"}</span>
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-400">
                    Priority: {complaint.priority || "Normal"}
                  </span>

                  <Link
                    href={`/complaints/track/${encodeURIComponent(complaint.id)}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900"
                  >
                    Track complaint
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
