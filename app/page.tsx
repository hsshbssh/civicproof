
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Eye,
  FileCheck2,
  Wallet,
  Clock3,
  Construction,
  Waves,
  Trash2,
  Lightbulb,
  MapPin,
  CheckCircle2,
  Users,
  Search,
  Menu,
} from "lucide-react";

const projects = [
  {
    name: "Road resurfacing — Sector 12",
    location: "Dwarka, New Delhi",
    amount: "₹18.4 lakh",
    progress: 76,
    status: "Inspection pending",
    statusStyle: "bg-amber-50 text-amber-700",
  },
  {
    name: "Stormwater drain restoration",
    location: "Sector 7, New Delhi",
    amount: "₹12.8 lakh",
    progress: 48,
    status: "Work in progress",
    statusStyle: "bg-blue-50 text-blue-700",
  },
  {
    name: "Public streetlight upgrades",
    location: "Sector 10, New Delhi",
    amount: "₹6.2 lakh",
    progress: 100,
    status: "Verified complete",
    statusStyle: "bg-emerald-50 text-emerald-700",
  },
];

const categories = [
  { name: "Roads & potholes", icon: Construction, count: "Road safety" },
  { name: "Drainage & waterlogging", icon: Waves, count: "Water management" },
  { name: "Waste management", icon: Trash2, count: "Clean neighbourhoods" },
  { name: "Streetlights", icon: Lightbulb, count: "Public safety" },
];

const workflow = [
  {
    number: "01",
    title: "Report an issue",
    description:
      "Citizens submit complaints with a location, description and supporting evidence.",
  },
  {
    number: "02",
    title: "Assign responsibility",
    description:
      "Authorized authorities assign the work, responsible contractor and deadline.",
  },
  {
    number: "03",
    title: "Document the work",
    description:
      "Contractors submit progress updates and evidence for independent inspection.",
  },
  {
    number: "04",
    title: "Verify the outcome",
    description:
      "Inspectors approve the work or record defects and require corrective action.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#102b46] text-white shadow-lg shadow-slate-900/10">
              <ShieldCheck size={25} />
            </div>
            <div>
              <p className="text-xl font-black tracking-tight">
                Civic<span className="text-teal-600">Proof</span>
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Public accountability
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a className="hover:text-teal-700" href="#how-it-works">
              How it works
            </a>
            <a className="hover:text-teal-700" href="#projects">
              Public projects
            </a>
            <a className="hover:text-teal-700" href="#issues">
              Civic issues
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-[#102b46] px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute -right-40 -top-20 h-[500px] w-[500px] rounded-full bg-teal-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-52 h-[350px] w-[350px] rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-bold text-teal-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              Built for a more accountable tomorrow
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
              Public money.
              <br />
              <span className="text-teal-600">Visible progress.</span>
              <br />
              Real accountability.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              From a pothole complaint to a completed public project, CivicProof
              connects citizens, authorities, contractors and independent
              inspectors through one traceable workflow.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[#102b46] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-teal-700"
              >
                Explore the platform <ArrowRight size={17} />
              </Link>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 transition hover:border-teal-300"
              >
                View public projects <Eye size={17} />
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-teal-600" />
                Evidence-led workflows
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-teal-600" />
                Independent inspections
              </span>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="relative mx-auto w-full max-w-[570px]">
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-teal-100 to-blue-100 opacity-70 blur-xl" />

            <div className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <p className="text-sm font-extrabold">Public works overview</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Illustrative prototype data
                  </p>
                </div>
                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">
                  DEMO
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-5">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <FileCheck2 className="text-teal-700" size={20} />
                  <p className="mt-3 text-3xl font-black">24</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Tracked projects
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <Eye className="text-amber-600" size={20} />
                  <p className="mt-3 text-3xl font-black">06</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Awaiting inspection
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl border border-slate-100 p-4">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Project delivery</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Sample project progress
                      </p>
                    </div>
                    <ArrowUpRight className="text-teal-600" size={20} />
                  </div>

                  <div className="space-y-5">
                    {projects.map((project) => (
                      <div key={project.name}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold text-slate-700">
                            {project.name}
                          </p>
                          <span className="text-xs font-bold">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-teal-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <p className="text-xs font-bold">
                    Proof before approval
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    A completion claim is not a verified result.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform principles */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4 lg:px-8">
          {[
            { icon: Users, title: "Four stakeholder roles", sub: "One workflow" },
            { icon: Wallet, title: "Financial transparency", sub: "Traceable records" },
            { icon: Clock3, title: "Deadline monitoring", sub: "Escalation trail" },
            { icon: ShieldCheck, title: "Work verification", sub: "Independent review" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-extrabold">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Issue categories */}
      <section
        id="issues"
        className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"
      >
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-700">
          One platform, every civic issue
        </p>
        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            The problems people live with.
          </h2>
          <p className="max-w-lg text-sm leading-7 text-slate-600">
            Civic accountability should cover the whole neighbourhood, not
            just its roads.
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                <category.icon size={23} />
              </div>
              <h3 className="mt-6 font-bold">{category.name}</h3>
              <p className="mt-2 text-xs text-slate-500">{category.count}</p>
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-teal-700">
                Included in platform <ArrowRight size={15} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section
        id="how-it-works"
        className="bg-[#102b46] py-20 text-white lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-300">
            Designed for accountability
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            A completion claim is only the beginning.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Every handoff creates a record. Failed inspections lead to
            documented corrective action, not silent approval.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 transition hover:bg-white/[0.08]"
              >
                <p className="text-sm font-black tracking-widest text-teal-300">
                  {step.number}
                </p>
                <h3 className="mt-6 text-xl font-extrabold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public projects */}
      <section
        id="projects"
        className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-700">
              Public project register
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              See work beyond the promise.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Review project progress, contract values and verification status.
            </p>
          </div>
          <span className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500">
            Sample data · Prototype
          </span>
        </div>

        <div className="mt-9 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="hidden grid-cols-[1.7fr_0.8fr_0.8fr_1fr] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 md:grid">
            <span>Project / location</span>
            <span>Contract value</span>
            <span>Progress</span>
            <span>Current status</span>
          </div>

          {projects.map((project) => (
            <div
              key={project.name}
              className="grid gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0 md:grid-cols-[1.7fr_0.8fr_0.8fr_1fr] md:items-center md:px-6"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <MapPin size={19} />
                </div>
                <div>
                  <p className="text-sm font-bold">{project.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {project.location}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 md:hidden">
                  Contract value
                </p>
                <p className="text-sm font-bold">{project.amount}</p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500 md:hidden">
                    Progress
                  </span>
                  <span className="text-xs font-bold">
                    {project.progress}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div>
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${project.statusStyle}`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-400">
          All project names, amounts, locations and progress figures are
          fictional examples, not official government records.
        </p>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-teal-50 p-8 sm:flex-row sm:items-center sm:p-12">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-800">
              Bridge the gap
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              From complaints to verifiable outcomes.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              One shared accountability trail for citizens and the people
              responsible for public infrastructure.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#102b46] px-6 py-4 text-sm font-bold text-white transition hover:bg-teal-700"
          >
            Enter CivicProof <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2 font-extrabold text-slate-800">
            <ShieldCheck size={18} className="text-teal-700" />
            CivicProof
          </div>
          <p>
            A civic-tech prototype. Not an official government portal.
          </p>
          <p>Built for Bridge the Gap.</p>
        </div>
      </footer>
    </main>
  );
}
