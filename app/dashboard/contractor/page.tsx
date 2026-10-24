
"use client";

import { useMemo, useState } from "react";
import {
  HardHat,
  Search,
  MapPin,
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Upload,
  FileImage,
  X,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";

type ProjectStatus = "Assigned" | "In Progress" | "Inspection Pending" | "Completed";

type Project = {
  id: string;
  title: string;
  category: string;
  location: string;
  deadline: string;
  progress: number;
  status: ProjectStatus;
  description: string;
};

const initialProjects: Project[] = [
  {
    id: "CP-1042",
    title: "Road Resurfacing",
    category: "Roads & Potholes",
    location: "Sector 12, Dwarka",
    deadline: "25 Oct 2026",
    progress: 65,
    status: "In Progress",
    description:
      "Repair damaged road sections and complete resurfacing work.",
  },
  {
    id: "CP-1038",
    title: "Stormwater Drain Repair",
    category: "Drainage",
    location: "Sector 7, Dwarka",
    deadline: "22 Oct 2026",
    progress: 35,
    status: "Assigned",
    description:
      "Restore the damaged drain and clear the affected drainage section.",
  },
  {
    id: "CP-1029",
    title: "Streetlight Replacement",
    category: "Streetlights",
    location: "Sector 10, Dwarka",
    deadline: "20 Oct 2026",
    progress: 100,
    status: "Inspection Pending",
    description:
      "Replace faulty streetlights and submit completion evidence for inspection.",
  },
];

const statusStyles: Record<ProjectStatus, string> = {
  Assigned: "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-50 text-blue-700",
  "Inspection Pending": "bg-amber-50 text-amber-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

export default function ContractorDashboard() {
  const [projects, setProjects] = useState(initialProjects);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);
  const [progress, setProgress] = useState(50);
  const [remarks, setRemarks] = useState("");
  const [evidence, setEvidence] = useState<File | null>(null);
  const [notice, setNotice] = useState("");

  const visibleProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Active"
          ? project.status === "Assigned" ||
            project.status === "In Progress"
          : filter === "Inspection"
            ? project.status === "Inspection Pending"
            : project.status === "Completed");

      const query = search.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.id.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, search]);

  const activeCount = projects.filter(
    (p) => p.status === "Assigned" || p.status === "In Progress"
  ).length;

  const inspectionCount = projects.filter(
    (p) => p.status === "Inspection Pending"
  ).length;

  const completedCount = projects.filter(
    (p) => p.status === "Completed"
  ).length;

  function openProject(project: Project) {
    setSelected(project);
    setProgress(project.progress);
    setRemarks("");
    setEvidence(null);
    setNotice("");
  }

  function saveProgress() {
    if (!selected) return;

    if (remarks.trim().length < 5) {
      setNotice("Please add a short work update (at least 5 characters).");
      return;
    }

    if (!evidence) {
      setNotice("Please attach a work photo as evidence.");
      return;
    }

    setProjects((current) =>
      current.map((project) => {
        if (project.id !== selected.id) return project;

        const nextProgress = Math.max(project.progress, progress);

        return {
          ...project,
          progress: nextProgress,
          status:
            nextProgress === 100
              ? "Inspection Pending"
              : "In Progress",
        };
      })
    );

    setNotice(
      "Demo update applied! Progress and status have been updated on this screen."
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <HardHat size={18} />
              CIVICPROOF / CONTRACTOR
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Contractor Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage assigned civic works and submit progress evidence.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <HardHat size={21} />
            </div>
            <div>
              <p className="text-sm font-semibold">Demo Contractor</p>
              <p className="text-xs text-slate-500">Field Operations</p>
            </div>
          </div>
        </header>

        {notice && !selected && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {notice}
          </div>
        )}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Assignments",
              value: projects.length,
              icon: ClipboardList,
              color: "text-slate-700 bg-slate-100",
            },
            {
              label: "Active Projects",
              value: activeCount,
              icon: Clock3,
              color: "text-blue-700 bg-blue-50",
            },
            {
              label: "Awaiting Inspection",
              value: inspectionCount,
              icon: AlertTriangle,
              color: "text-amber-700 bg-amber-50",
            },
            {
              label: "Completed",
              value: completedCount,
              icon: CheckCircle2,
              color: "text-emerald-700 bg-emerald-50",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <span className={`rounded-xl p-2 ${stat.color}`}>
                    <Icon size={19} />
                  </span>
                </div>
                <p className="mt-4 text-3xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold">Assigned Projects</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review work orders and update project progress.
                </p>
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search project or location"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["All", "Active", "Inspection", "Completed"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    filter === item
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {visibleProjects.map((project) => (
              <article
                key={project.id}
                className="p-5 transition hover:bg-slate-50 sm:p-6"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">
                        {project.id}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[project.status]}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold">{project.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {project.category}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        Due {project.deadline}
                      </span>
                    </div>
                  </div>

                  <div className="w-full lg:max-w-xs">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-500">Work progress</span>
                      <span className="font-semibold">{project.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>

                    <button
                      onClick={() => openProject(project)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:border-emerald-700 hover:bg-emerald-50"
                    >
                      {project.status === "Inspection Pending"
                        ? "View & Submit Update"
                        : "Manage Project"}
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {visibleProjects.length === 0 && (
              <div className="p-12 text-center">
                <ClipboardList
                  size={32}
                  className="mx-auto text-slate-300"
                />
                <p className="mt-3 font-semibold">No projects found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Try a different filter or search term.
                </p>
              </div>
            )}
          </div>
        </section>

        <p className="mt-4 text-xs text-slate-400">
          Frontend prototype · Sample assignments · Changes are temporary and
          reset on refresh.
        </p>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div>
                <p className="text-xs font-semibold text-emerald-700">
                  WORK ORDER · {selected.id}
                </p>
                <h2 className="mt-1 text-xl font-bold">{selected.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.location}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close project details"
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold">Work description</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selected.description}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Deadline: {selected.deadline}
                </p>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <label htmlFor="progress" className="font-semibold">
                    Updated progress
                  </label>
                  <span className="font-bold text-emerald-700">
                    {progress}%
                  </span>
                </div>
                <input
                  id="progress"
                  type="range"
                  min={selected.progress}
                  max="100"
                  step="5"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
                <div className="mt-1 flex justify-between text-xs text-slate-400">
                  <span>Current: {selected.progress}%</span>
                  <span>100% complete</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="remarks"
                  className="mb-2 block text-sm font-semibold"
                >
                  Work update / remarks
                </label>
                <textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  placeholder="Describe the work completed so far..."
                  className="w-full resize-y rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label
                  htmlFor="evidence"
                  className="mb-2 block text-sm font-semibold"
                >
                  Upload work evidence
                </label>
                <label
                  htmlFor="evidence"
                  className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 p-4 transition hover:border-emerald-600 hover:bg-emerald-50/50"
                >
                  <span className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
                    <FileImage size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {evidence ? evidence.name : "Choose a work photo"}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      JPG, PNG or WEBP · Maximum 5 MB
                    </span>
                  </span>
                  <Upload size={18} className="text-slate-400" />
                </label>
                <input
                  id="evidence"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (
                      !["image/jpeg", "image/png", "image/webp"].includes(
                        file.type
                      ) ||
                      file.size > 5 * 1024 * 1024
                    ) {
                      setEvidence(null);
                      setNotice("Choose a JPG, PNG or WEBP image under 5 MB.");
                      e.target.value = "";
                      return;
                    }

                    setEvidence(file);
                    setNotice("");
                  }}
                />
              </div>

              {notice && (
                <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                  {notice}
                </div>
              )}

              <button
                onClick={saveProgress}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                <CheckCircle2 size={18} />
                Apply Demo Update
              </button>

              <p className="text-xs leading-5 text-slate-400">
                This demo updates the screen only. The selected image is not
                uploaded to a server, and nothing is saved permanently.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
