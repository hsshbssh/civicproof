
import { Suspense } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  FolderKanban,
  ClipboardCheck,
  Wallet,
  Clock3,
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Eye,
  ArrowRight,
} from "lucide-react";

import CitizenComplaints from "./CitizenComplaints";

type RoleInfo = {
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  actions: {
    title: string;
    description: string;
    href: string;
    icon: typeof FileText;
  }[];
};

const roleInfo: Record<string, RoleInfo> = {
  citizen: {
    title: "Citizen Dashboard",
    subtitle: "Public accountability starts with you.",
    description:
      "Report civic issues, track complaints and explore public infrastructure projects.",
    accent: "teal",
    actions: [
      {
        title: "Report an Issue",
        description: "Submit a civic complaint with location and evidence.",
        href: "/complaints/new",
        icon: Plus,
      },
      {
        title: "Track Complaints",
        description: "Review the complaints you have submitted.",
        href: "#my-complaints",
        icon: Eye,
      },
      {
        title: "Public Projects",
        description: "Explore infrastructure projects and their progress.",
        href: "#projects",
        icon: FolderKanban,
      },
    ],
  },

  authority: {
    title: "Authority Dashboard",
    subtitle: "Manage projects. Strengthen public trust.",
    description:
      "Monitor complaints, coordinate departments and track deadlines and escalations.",
    accent: "blue",
    actions: [
      {
        title: "Complaint Register",
        description: "Review incoming civic complaints.",
        href: "#workflow",
        icon: FileText,
      },
      {
        title: "Manage Projects",
        description: "Monitor assignments, progress and deadlines.",
        href: "#projects",
        icon: FolderKanban,
      },
      {
        title: "Escalations",
        description: "Identify overdue work requiring attention.",
        href: "#transparency",
        icon: AlertTriangle,
      },
    ],
  },

  contractor: {
    title: "Contractor Dashboard",
    subtitle: "Document work. Demonstrate progress.",
    description:
      "Review assigned projects, submit progress evidence and respond to defects.",
    accent: "indigo",
    actions: [
      {
        title: "Assigned Projects",
        description: "Review your assigned infrastructure projects.",
        href: "#projects",
        icon: FolderKanban,
      },
      {
        title: "Submit Progress",
        description: "Document completed work and supporting evidence.",
        href: "#workflow",
        icon: Plus,
      },
      {
        title: "Defect Response",
        description: "Review issues requiring corrective work.",
        href: "#transparency",
        icon: ClipboardCheck,
      },
    ],
  },

  inspector: {
    title: "Inspector Dashboard",
    subtitle: "Independent verification. Evidence-based decisions.",
    description:
      "Inspect assigned work, record findings and track rework and reinspection.",
    accent: "amber",
    actions: [
      {
        title: "Assigned Inspections",
        description: "Review work awaiting independent inspection.",
        href: "#projects",
        icon: ClipboardCheck,
      },
      {
        title: "Inspection Records",
        description: "Record findings and evidence from site inspections.",
        href: "#workflow",
        icon: FileText,
      },
      {
        title: "Reinspection Queue",
        description: "Follow up on failed inspections and corrective work.",
        href: "#transparency",
        icon: Clock3,
      },
    ],
  },
};

const sampleProjects = [
  {
    id: "CP-PROJ-001",
    name: "Local Road Improvement",
    category: "Roads & Infrastructure",
    location: "Dwarka, New Delhi",
    budget: "₹18.5 lakh",
    progress: 72,
    status: "In Progress",
    deadline: "Demo deadline",
  },
  {
    id: "CP-PROJ-002",
    name: "Stormwater Drainage Upgrade",
    category: "Drainage & Waterlogging",
    location: "West Delhi",
    budget: "₹12.8 lakh",
    progress: 45,
    status: "In Progress",
    deadline: "Demo deadline",
  },
  {
    id: "CP-PROJ-003",
    name: "Public Streetlight Maintenance",
    category: "Streetlights & Public Safety",
    location: "New Delhi",
    budget: "₹4.2 lakh",
    progress: 100,
    status: "Awaiting Verification",
    deadline: "Verification pending",
  },
];

const allowedRoles = ["citizen", "authority", "contractor", "inspector"];

function DashboardContent({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  return <DashboardWithRole params={params} />;
}

async function DashboardWithRole({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role: rawRole } = await params;
  const role = rawRole.toLowerCase();

  if (!allowedRoles.includes(role)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4 text-teal-700" size={40} />
          <h1 className="text-2xl font-bold text-slate-900">
            Invalid dashboard role
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Please select a valid CivicProof demo role.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </main>
    );
  }

  const info = roleInfo[role];

  const navItems = [
    { label: "Overview", href: "#overview", icon: LayoutDashboard },
    { label: "Workflow", href: "#workflow", icon: ClipboardCheck },
    { label: "Projects", href: "#projects", icon: FolderKanban },
    { label: "Transparency", href: "#transparency", icon: Wallet },
  ];

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-5 lg:flex lg:flex-col">
          <Link href="/login" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white">
              <ShieldCheck size={25} />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight">
                CivicProof
              </p>
              <p className="text-xs text-slate-500">
                Public accountability
              </p>
            </div>
          </Link>

          <div className="mt-9">
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </p>
            <nav className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      index === 0
                        ? "bg-teal-50 text-teal-800"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto rounded-2xl border border-teal-100 bg-teal-50 p-4">
            <ShieldCheck className="mb-3 text-teal-700" size={24} />
            <p className="text-sm font-bold text-slate-900">
              Evidence before approval
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              A completion claim is not the same as independently verified
              work.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-7">
            <Link href="/login" className="flex items-center gap-2 lg:hidden">
              <ShieldCheck className="text-teal-700" size={25} />
              <span className="font-extrabold">CivicProof</span>
            </Link>

            <div className="hidden text-sm text-slate-500 lg:block">
              Workspace /{" "}
              <span className="font-semibold capitalize text-slate-800">
                {role}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700">
                Demo · {role}
              </span>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft size={15} />
                Switch role
              </Link>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] space-y-8 p-4 sm:p-7 lg:p-9">
            <section id="overview">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
                    <span className="h-2 w-2 rounded-full bg-teal-600" />
                    Civic infrastructure accountability
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {info.title}
                  </h1>
                  <p className="mt-2 text-base font-medium text-slate-600">
                    {info.subtitle}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    {info.description}
                  </p>
                </div>

                {role === "citizen" && (
                  <Link
                    href="/complaints/new"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800"
                  >
                    <Plus size={18} />
                    Report an issue
                  </Link>
                )}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Demo projects
                  </span>
                  <FolderKanban className="text-teal-700" size={20} />
                </div>
                <p className="mt-4 text-3xl font-extrabold">03</p>
                <p className="mt-1 text-xs text-slate-500">
                  Sample infrastructure records
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    In progress
                  </span>
                  <Clock3 className="text-blue-700" size={20} />
                </div>
                <p className="mt-4 text-3xl font-extrabold">02</p>
                <p className="mt-1 text-xs text-slate-500">
                  Sample projects underway
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Verification pending
                  </span>
                  <ClipboardCheck className="text-amber-600" size={20} />
                </div>
                <p className="mt-4 text-3xl font-extrabold">01</p>
                <p className="mt-1 text-xs text-slate-500">
                  Sample project awaiting inspection
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Accountability
                  </span>
                  <ShieldCheck className="text-emerald-700" size={20} />
                </div>
                <p className="mt-4 text-xl font-extrabold">Evidence-led</p>
                <p className="mt-1 text-xs text-slate-500">
                  Independent verification principle
                </p>
              </div>
            </section>

            <section id="workflow">
              <div className="mb-4">
                <h2 className="text-xl font-extrabold">
                  Your workspace actions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Shortcuts based on your selected demo role.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {info.actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.title}
                      href={action.href}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                          <Icon size={21} />
                        </div>
                        <ArrowUpRight
                          className="text-slate-400 transition group-hover:text-teal-700"
                          size={19}
                        />
                      </div>
                      <h3 className="mt-5 font-bold">{action.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {action.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-800">
                        Open section <ArrowRight size={15} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {role === "citizen" && (
              <section id="my-complaints">
                <CitizenComplaints />
              </section>
            )}

            <section id="projects">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <h2 className="text-xl font-extrabold">
                    Public project register
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Example records across multiple civic infrastructure
                    categories.
                  </p>
                </div>
                <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                  Illustrative demo data
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Project</th>
                        <th className="px-5 py-4 font-semibold">Location</th>
                        <th className="px-5 py-4 font-semibold">Budget</th>
                        <th className="px-5 py-4 font-semibold">Progress</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sampleProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-slate-50/70">
                          <td className="px-5 py-5">
                            <p className="font-bold text-slate-900">
                              {project.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {project.id}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {project.category}
                            </p>
                          </td>
                          <td className="px-5 py-5 text-slate-600">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={14} />
                              {project.location}
                            </span>
                          </td>
                          <td className="px-5 py-5 font-semibold text-slate-800">
                            {project.budget}
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-teal-600"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-700">
                                {project.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                                project.status === "Awaiting Verification"
                                  ? "bg-amber-50 text-amber-800"
                                  : "bg-blue-50 text-blue-800"
                              }`}
                            >
                              {project.status === "Awaiting Verification" ? (
                                <AlertTriangle size={13} />
                              ) : (
                                <Clock3 size={13} />
                              )}
                              {project.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-slate-100 px-5 py-3 text-xs leading-5 text-slate-500">
                  Project budgets, locations and progress values above are
                  illustrative. They are not verified government records.
                </div>
              </div>
            </section>

            <section id="transparency">
              <div className="mb-4">
                <h2 className="text-xl font-extrabold">
                  Transparency & verification
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  How CivicProof is designed to prevent unsupported completion
                  claims.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <FileText size={20} />
                  </div>
                  <h3 className="mt-4 font-bold">Evidence submitted</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Contractors document progress with supporting evidence
                    before requesting completion approval.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <ClipboardCheck size={20} />
                  </div>
                  <h3 className="mt-4 font-bold">Independent inspection</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    An authorized inspector records findings. Failed work can
                    require corrective action and reinspection.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Wallet size={20} />
                  </div>
                  <h3 className="mt-4 font-bold">Financial transparency</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Approved budgets, contract values, expenditure and
                    payments should be tracked as separate records.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <AlertTriangle
                  className="mt-0.5 shrink-0 text-amber-700"
                  size={21}
                />
                <div>
                  <p className="font-bold text-amber-950">
                    Prototype limitation
                  </p>
                  <p className="mt-1 text-sm leading-6 text-amber-900">
                    This dashboard currently uses sample project data and
                    browser-based demo complaints. Authentication, database
                    persistence, role-based server authorization, live
                    inspections, verified financial records and automated
                    escalation still need backend implementation.
                  </p>
                </div>
              </div>
            </section>

            <footer className="border-t border-slate-200 py-5 text-xs leading-5 text-slate-500">
              CivicProof · A public infrastructure accountability prototype.
              All sample project information is illustrative.
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
          <p className="text-sm font-semibold text-slate-500">
            Loading CivicProof dashboard...
          </p>
        </main>
      }
    >
      <DashboardContent params={params} />
    </Suspense>
  );
}
