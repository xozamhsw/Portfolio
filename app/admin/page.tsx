"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Mail,
  MessageSquare,
  UserRound,
} from "lucide-react";
import {
  Timestamp,
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp | null;
  status: "read" | "unread";
}

interface Skill {
  id: string;
  name: string;
  category: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  description: string;
  overview: string;
  highlights: string[];
  role: string;
  tags: string[];
  github: string;
  live: string;
  image: string;
  published: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

interface Profile {
  name: string;
  role: string;
  location: string;
  university: string;
  bio: string;
  about: string;
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
  formalPhoto: string;
  avatar: string;
}

export default function AdminDashboard() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messageError, setMessageError] = useState(false);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // =========================================================
  // REALTIME CONTACT MONITORING
  // =========================================================

  useEffect(() => {
    const contactsQuery = query(
      collection(db, "contacts"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      contactsQuery,
      (snapshot) => {
        const data: ContactMessage[] = snapshot.docs.map((item) => {
          const value = item.data();

          return {
            id: item.id,
            name: value.name ?? "Unknown",
            email: value.email ?? "",
            message: value.message ?? "",
            createdAt: value.createdAt ?? null,
            status: value.status === "read" ? "read" : "unread",
          };
        });

        setMessages(data);
        setLoadingMessages(false);
        setMessageError(false);
      },
      (error) => {
        console.error("Admin dashboard contact listener error:", error);
        setMessageError(true);
        setLoadingMessages(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // =========================================================
  // REALTIME SKILLS MONITORING
  // =========================================================

  useEffect(() => {
    const skillsQuery = query(
      collection(db, "skills"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      skillsQuery,
      (snapshot) => {
        const data: Skill[] = snapshot.docs.map((item) => {
          const value = item.data();

          return {
            id: item.id,
            name: value.name ?? "",
            category: value.category ?? "Frontend",
            createdAt: value.createdAt,
            updatedAt: value.updatedAt,
          };
        });

        setSkills(data);
        setLoadingSkills(false);
      },
      (error) => {
        console.error("Admin dashboard skills listener error:", error);
        setLoadingSkills(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // =========================================================
  // REALTIME PROJECTS MONITORING
  // =========================================================

  useEffect(() => {
    const projectsQuery = query(
      collection(db, "projects"),
      orderBy("updatedAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const data: Project[] = snapshot.docs.map((item) => {
          const value = item.data();

          return {
            id: item.id,
            title: value.title ?? "",
            slug: value.slug ?? "",
            category: value.category ?? "",
            year: value.year ?? "",
            description: value.description ?? "",
            overview: value.overview ?? "",
            highlights: Array.isArray(value.highlights)
              ? value.highlights.filter(
                  (highlight): highlight is string =>
                    typeof highlight === "string",
                )
              : [],
            role: value.role ?? "",
            tags: Array.isArray(value.tags)
              ? value.tags.filter(
                  (tag): tag is string => typeof tag === "string",
                )
              : [],
            github: value.github ?? "",
            live: value.live ?? "",
            image: value.image ?? "",
            published: value.published === true,
            createdAt: value.createdAt ?? null,
            updatedAt: value.updatedAt ?? null,
          };
        });

        setProjects(data);
        setLoadingProjects(false);
      },
      (error) => {
        console.error("Admin dashboard projects listener error:", error);
        setLoadingProjects(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // =========================================================
  // PROFILE LOADING
  // =========================================================

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileRef = doc(db, "profile", "main");
        const snapshot = await getDoc(profileRef);

        if (snapshot.exists()) {
          setProfile(snapshot.data() as Profile);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

  // =========================================================
  // MESSAGE STATISTICS
  // =========================================================

  const unreadCount = useMemo(
    () => messages.filter((message) => message.status === "unread").length,
    [messages],
  );

  const readCount = messages.length - unreadCount;

  const latestMessages = messages.slice(0, 5);

  // =========================================================
  // PROJECT STATISTICS
  // =========================================================

  const publishedProjects = useMemo(
    () => projects.filter((project) => project.published).length,
    [projects],
  );

  const draftProjects = projects.length - publishedProjects;

  const latestProjects = projects.slice(0, 3);

  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "Unknown date";

    try {
      return timestamp.toDate().toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown date";
    }
  };

  // =========================================================
  // STAT CARD
  // =========================================================

  const stats = [
    {
      label: "Total messages",
      value: loadingMessages ? "—" : messages.length,
      icon: MessageSquare,
      description: "All conversations",
      iconClass: "text-violet-300",
      iconBg: "bg-violet-400/[0.08]",
    },
    {
      label: "Unread",
      value: loadingMessages ? "—" : unreadCount,
      icon: Mail,
      description:
        unreadCount === 0 ? "Everything is up to date" : "Need your attention",
      iconClass: "text-cyan-300",
      iconBg: "bg-cyan-300/[0.07]",
    },
    {
      label: "Projects",
      value: loadingProjects ? "—" : projects.length,
      icon: BriefcaseBusiness,
      description: `${publishedProjects} published`,
      iconClass: "text-lime-200",
      iconBg: "bg-lime-300/[0.06]",
    },
    {
      label: "Skills",
      value: loadingSkills ? "—" : skills.length,
      icon: Code2,
      description: "Technologies & tools",
      iconClass: "text-violet-300",
      iconBg: "bg-violet-400/[0.08]",
    },
  ];

  return (
    <section className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-6 bg-violet-400" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-300 sm:text-xs">
                Admin / Overview
              </p>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Monitor your portfolio content and incoming messages from one
              place.
            </p>
          </div>

          {/* Realtime indicator */}

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-lime-300/15 bg-lime-300/[0.04] px-3 py-2 text-[11px] text-zinc-400">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime-300 opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-lime-300" />
            </span>
            Realtime monitoring
          </div>
        </div>
      </header>

      {/* =====================================================
          PROFILE SUMMARY
      ===================================================== */}

      {!loadingProfile && profile && (
        <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
          <div className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.name || "Profile"}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <UserRound size={22} className="text-zinc-600" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {profile.name || "Your name"}
            </p>

            <p className="mt-1 truncate text-xs text-zinc-500">
              {profile.role || "Your role"}
              {profile.location ? ` • ${profile.location}` : ""}
            </p>
          </div>

          <Link
            href="/admin/profile"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
          >
            Edit profile
            <ArrowUpRight size={14} />
          </Link>
        </div>
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-white/[0.035]"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`grid size-10 place-items-center rounded-xl ${stat.iconBg} ${stat.iconClass}`}
                >
                  <Icon size={18} />
                </div>

                <ArrowUpRight
                  size={15}
                  className="text-zinc-700 transition group-hover:text-zinc-500"
                />
              </div>

              <div className="mt-6">
                <p className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs font-medium text-zinc-400">
                  {stat.label}
                </p>

                <p className="mt-1 text-[11px] text-zinc-600">
                  {stat.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* =====================================================
          MAIN CONTENT AREA
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        {/* ===================================================
            LEFT COLUMN
        =================================================== */}

        <div className="space-y-6">
          {/* =================================================
              LATEST MESSAGES
          ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02]">
            {/* Header */}

            <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-violet-300" />

                  <h2 className="text-sm font-semibold">Latest messages</h2>
                </div>

                <p className="mt-1 text-xs text-zinc-600">
                  The latest conversations from your portfolio.
                </p>
              </div>

              <Link
                href="/admin/messages"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
              >
                View all
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Content */}

            <div className="p-4 sm:p-5">
              {loadingMessages ? (
                <div className="flex min-h-[200px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative size-8">
                      <div className="absolute inset-0 animate-spin rounded-full border border-white/10 border-t-violet-400" />
                    </div>

                    <p className="text-xs text-zinc-600">Loading messages...</p>
                  </div>
                </div>
              ) : messageError ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/[0.02] px-5 text-center">
                  <div className="grid size-11 place-items-center rounded-xl bg-red-400/[0.06] text-red-300">
                    <Mail size={18} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-zinc-300">
                    Unable to load messages
                  </h3>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                    Check your Firebase permissions and try refreshing the page.
                  </p>
                </div>
              ) : latestMessages.length === 0 ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-5 text-center">
                  <div className="grid size-12 place-items-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-zinc-600">
                    <Mail size={20} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-zinc-300">
                    No messages yet
                  </h3>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                    Messages sent through your portfolio contact form will
                    appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {latestMessages.map((message) => {
                    const unread = message.status === "unread";

                    return (
                      <Link
                        key={message.id}
                        href="/admin/messages"
                        className={`group relative block overflow-hidden rounded-2xl border p-4 transition duration-300 ${
                          unread
                            ? "border-cyan-300/10 bg-cyan-300/[0.025] hover:border-cyan-300/20 hover:bg-cyan-300/[0.04]"
                            : "border-white/[0.06] bg-white/[0.015] hover:border-white/[0.11] hover:bg-white/[0.025]"
                        }`}
                      >
                        {/* Unread indicator */}

                        {unread && (
                          <span className="absolute bottom-0 left-0 top-0 w-[2px] bg-gradient-to-b from-cyan-300 via-violet-300 to-transparent" />
                        )}

                        <div className="flex items-start gap-3">
                          {/* Avatar */}

                          <div
                            className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                              unread
                                ? "bg-cyan-300/[0.07] text-cyan-300"
                                : "bg-white/[0.04] text-zinc-500"
                            }`}
                          >
                            <UserRound size={16} />
                          </div>

                          {/* Content */}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                              <div className="flex min-w-0 items-center gap-2">
                                <h3
                                  className={`truncate text-sm font-medium ${
                                    unread ? "text-white" : "text-zinc-300"
                                  }`}
                                >
                                  {message.name}
                                </h3>

                                {unread && (
                                  <span className="shrink-0 rounded-full border border-cyan-300/10 bg-cyan-300/[0.06] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-cyan-200">
                                    New
                                  </span>
                                )}
                              </div>

                              <span className="shrink-0 text-[10px] text-zinc-600">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>

                            <p className="mt-1 truncate text-xs text-zinc-600">
                              {message.email}
                            </p>

                            <p
                              className={`mt-3 line-clamp-2 text-xs leading-5 ${
                                unread ? "text-zinc-400" : "text-zinc-600"
                              }`}
                            >
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              LATEST PROJECTS
          ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02]">
            {/* Header */}

            <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness size={16} className="text-lime-200" />

                  <h2 className="text-sm font-semibold">Recent projects</h2>
                </div>

                <p className="mt-1 text-xs text-zinc-600">
                  Your latest portfolio projects.
                </p>
              </div>

              <Link
                href="/admin/projects"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
              >
                View all
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Content */}

            <div className="p-4 sm:p-5">
              {loadingProjects ? (
                <div className="flex min-h-[200px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative size-8">
                      <div className="absolute inset-0 animate-spin rounded-full border border-white/10 border-t-lime-300" />
                    </div>

                    <p className="text-xs text-zinc-600">Loading projects...</p>
                  </div>
                </div>
              ) : latestProjects.length === 0 ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-5 text-center">
                  <div className="grid size-12 place-items-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-zinc-600">
                    <BriefcaseBusiness size={20} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-zinc-300">
                    No projects yet
                  </h3>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                    Create your first project to showcase your work.
                  </p>

                  <Link
                    href="/admin/projects/new"
                    className="mt-4 text-xs text-lime-200 transition hover:text-lime-100"
                  >
                    Create project
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {latestProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/admin/projects/${project.id}`}
                      className="group block rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 transition duration-300 hover:border-white/[0.11] hover:bg-white/[0.025]"
                    >
                      <div className="flex items-center gap-3">
                        {/* Project image */}

                        <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.03]">
                          {project.image ? (
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <BriefcaseBusiness
                              size={18}
                              className="text-zinc-600"
                            />
                          )}
                        </div>

                        {/* Project info */}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-medium text-zinc-200">
                              {project.title || "Untitled"}
                            </h3>

                            {project.published ? (
                              <span className="shrink-0 rounded-full border border-lime-300/10 bg-lime-300/[0.06] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-lime-200">
                                Published
                              </span>
                            ) : (
                              <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-zinc-500">
                                Draft
                              </span>
                            )}
                          </div>

                          <p className="mt-1 truncate text-xs text-zinc-600">
                            {project.category || "No category"}
                            {project.year ? ` • ${project.year}` : ""}
                          </p>
                        </div>

                        <ArrowUpRight
                          size={14}
                          className="shrink-0 text-zinc-700 transition group-hover:text-zinc-400"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ===================================================
            RIGHT COLUMN
        =================================================== */}

        <aside className="space-y-6">
          {/* =================================================
              MESSAGE OVERVIEW
          ================================================= */}

          <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-violet-400/[0.07] text-violet-300">
                <Mail size={16} />
              </span>

              <div>
                <p className="text-sm font-semibold">Message overview</p>

                <p className="text-[10px] text-zinc-600">Live statistics</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {/* Total */}

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Total</span>

                  <span className="font-medium text-zinc-300">
                    {loadingMessages ? "—" : messages.length}
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div className="h-full w-full rounded-full bg-violet-400/50" />
                </div>
              </div>

              {/* Unread */}

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Unread</span>

                  <span className="font-medium text-cyan-200">
                    {loadingMessages ? "—" : unreadCount}
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-cyan-300/60 transition-all duration-500"
                    style={{
                      width:
                        messages.length > 0
                          ? `${(unreadCount / messages.length) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* Read */}

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Read</span>

                  <span className="font-medium text-lime-200">
                    {loadingMessages ? "—" : readCount}
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-lime-300/50 transition-all duration-500"
                    style={{
                      width:
                        messages.length > 0
                          ? `${(readCount / messages.length) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              PROJECT OVERVIEW
          ================================================= */}

          <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-lime-300/[0.07] text-lime-200">
                <BriefcaseBusiness size={16} />
              </span>

              <div>
                <p className="text-sm font-semibold">Project overview</p>

                <p className="text-[10px] text-zinc-600">Portfolio status</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {/* Published */}

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Published</span>

                  <span className="font-medium text-lime-200">
                    {loadingProjects ? "—" : publishedProjects}
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-lime-300/60 transition-all duration-500"
                    style={{
                      width:
                        projects.length > 0
                          ? `${(publishedProjects / projects.length) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* Draft */}

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Draft</span>

                  <span className="font-medium text-zinc-400">
                    {loadingProjects ? "—" : draftProjects}
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-zinc-500/40 transition-all duration-500"
                    style={{
                      width:
                        projects.length > 0
                          ? `${(draftProjects / projects.length) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              SKILLS OVERVIEW
          ================================================= */}

          <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-violet-400/[0.07] text-violet-300">
                <Code2 size={16} />
              </span>

              <div>
                <p className="text-sm font-semibold">Skills</p>

                <p className="text-[10px] text-zinc-600">
                  {loadingSkills ? "—" : `${skills.length} total skills`}
                </p>
              </div>
            </div>

            <div className="mt-6">
              {loadingSkills ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-8 animate-pulse rounded-xl bg-white/[0.03]"
                    />
                  ))}
                </div>
              ) : skills.length === 0 ? (
                <p className="text-xs text-zinc-600">No skills added yet.</p>
              ) : (
                <div className="space-y-2">
                  {skills.slice(0, 5).map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.015] px-3 py-2"
                    >
                      <span className="truncate text-xs text-zinc-300">
                        {skill.name}
                      </span>

                      <span className="ml-2 shrink-0 text-[10px] text-zinc-600">
                        {skill.category}
                      </span>
                    </div>
                  ))}

                  {skills.length > 5 && (
                    <Link
                      href="/admin/skills"
                      className="block pt-1 text-center text-xs text-violet-300 transition hover:text-violet-200"
                    >
                      View all {skills.length} skills
                    </Link>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              STATUS CARD
          ================================================= */}

          <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-violet-500/[0.10] via-white/[0.02] to-cyan-400/[0.06] p-6">
            <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-violet-400/[0.08] blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-xl bg-lime-300/[0.07] text-lime-200">
                  <CheckCircle2 size={17} />
                </span>

                <p className="text-xs font-medium text-zinc-300">
                  System status
                </p>
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Everything is connected.
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Your dashboard is listening to Firestore in realtime. New
                messages, projects, and skills will appear automatically.
              </p>

              <div className="mt-5 flex items-center gap-2 text-[10px] text-lime-200/70">
                <span className="size-1.5 rounded-full bg-lime-300" />
                Firebase realtime active
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
