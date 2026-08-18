"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { Project } from "@/types/project";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // =========================================================
  // LOAD PROJECTS
  // =========================================================

  async function loadProjects() {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "projects"));

      const data: Project[] = snapshot.docs.map((item) => {
        const project = item.data();

        return {
          id: item.id,

          title: typeof project.title === "string" ? project.title : "",

          slug: typeof project.slug === "string" ? project.slug : "",

          category:
            typeof project.category === "string" ? project.category : "",

          year: typeof project.year === "string" ? project.year : "",

          description:
            typeof project.description === "string" ? project.description : "",

          overview:
            typeof project.overview === "string" ? project.overview : "",

          highlights: Array.isArray(project.highlights)
            ? project.highlights.filter(
                (item): item is string => typeof item === "string",
              )
            : [],

          role: typeof project.role === "string" ? project.role : "",

          tags: Array.isArray(project.tags)
            ? project.tags.filter(
                (item): item is string => typeof item === "string",
              )
            : [],

          github: typeof project.github === "string" ? project.github : "",

          live: typeof project.live === "string" ? project.live : "",

          image: typeof project.image === "string" ? project.image : "",

          published: project.published === true,

          createdAt: project.createdAt ?? null,

          updatedAt: project.updatedAt ?? null,
        };
      });

      // =====================================================
      // SORT
      // =====================================================

      data.sort((a, b) => {
        const aTime = a.updatedAt?.toMillis?.() ?? 0;
        const bTime = b.updatedAt?.toMillis?.() ?? 0;

        return bTime - aTime;
      });

      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);

      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadProjects();
  }, []);

  // =========================================================
  // DELETE PROJECT
  // =========================================================

  async function deleteProject(projectId: string) {
    const confirmed = window.confirm(
      "Delete this project? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleting(projectId);

      await deleteDoc(doc(db, "projects", projectId));

      setProjects((current) =>
        current.filter((project) => project.id !== projectId),
      );
    } catch (error) {
      console.error("Failed to delete project:", error);

      alert("Failed to delete project.");
    } finally {
      setDeleting(null);
    }
  }

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredProjects = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return projects;
    }

    return projects.filter((project) => {
      const searchableContent = [
        project.title,
        project.slug,
        project.category,
        project.year,
        project.description,
        project.overview,
        project.role,
        project.github,
        project.live,
        ...project.tags,
        ...project.highlights,
      ]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(keyword);
    });
  }, [projects, search]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-6 bg-violet-400" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-300 sm:text-xs">
                Admin / Projects
              </p>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Projects
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Manage the projects displayed on your portfolio.
            </p>
          </div>

          <Link
            href="/admin/projects/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-violet-100"
          >
            <Plus size={16} />
            New project
          </Link>
        </div>
      </header>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects..."
          className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.02] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-violet-400/40"
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      {loading ? (
        <LoadingState />
      ) : filteredProjects.length === 0 ? (
        <EmptyState hasSearch={Boolean(search)} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id ?? project.slug}
              project={project}
              deleting={deleting}
              onDelete={deleteProject}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ===========================================================
// PROJECT CARD
// ===========================================================

function ProjectCard({
  project,
  deleting,
  onDelete,
}: {
  project: Project;
  deleting: string | null;
  onDelete: (projectId: string) => void;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02]">
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.03]">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title || "Project image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BriefcaseBusiness size={28} className="text-zinc-700" />
          </div>
        )}

        {/* IMAGE OVERLAY */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* PUBLISHED STATUS */}

        <div className="absolute right-3 top-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] ${
              project.published
                ? "border-lime-300/20 bg-black/60 text-lime-300 backdrop-blur-sm"
                : "border-white/10 bg-black/60 text-zinc-500 backdrop-blur-sm"
            }`}
          >
            {project.published ? (
              <>
                <Eye size={11} />
                Published
              </>
            ) : (
              <>
                <EyeOff size={11} />
                Draft
              </>
            )}
          </span>
        </div>
      </div>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="p-5">
        {/* CATEGORY + YEAR */}

        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-[10px] font-medium uppercase tracking-[0.18em] text-violet-300">
            {project.category || "Project"}
          </span>

          {project.year && (
            <span className="shrink-0 text-[10px] text-zinc-600">
              {project.year}
            </span>
          )}
        </div>

        {/* TITLE */}

        <h2 className="mt-3 line-clamp-1 text-lg font-semibold text-white">
          {project.title || "Untitled project"}
        </h2>

        {/* DESCRIPTION */}

        <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
          {project.description || "No description."}
        </p>

        {/* TAGS */}

        {project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-lg bg-white/[0.05] px-2 py-1 text-[10px] text-zinc-500"
              >
                {tag}
              </span>
            ))}

            {project.tags.length > 3 && (
              <span className="rounded-lg bg-white/[0.03] px-2 py-1 text-[10px] text-zinc-600">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="mt-5 flex gap-2">
          <Link
            href={`/admin/projects/${project.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
          >
            <Pencil size={14} />
            Edit
          </Link>

          <button
            type="button"
            disabled={!project.id || deleting === project.id}
            onClick={() => {
              if (project.id) {
                onDelete(project.id);
              }
            }}
            className="inline-flex items-center justify-center rounded-xl border border-red-400/10 bg-red-400/[0.03] px-3 py-2.5 text-red-300 transition hover:bg-red-400/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Delete ${project.title || "project"}`}
          >
            {deleting === project.id ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

// ===========================================================
// LOADING STATE
// ===========================================================

function LoadingState() {
  return (
    <div className="flex min-h-[350px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={22} className="animate-spin text-violet-300" />

        <p className="text-xs text-zinc-600">Loading projects...</p>
      </div>
    </div>
  );
}

// ===========================================================
// EMPTY STATE
// ===========================================================

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-white/[0.07] bg-white/[0.02]">
      <BriefcaseBusiness size={32} className="text-zinc-700" />

      <p className="mt-4 text-sm text-zinc-500">
        {hasSearch ? "No projects found." : "No projects yet."}
      </p>

      {!hasSearch && (
        <Link
          href="/admin/projects/new"
          className="mt-4 text-xs text-violet-300 transition hover:text-violet-200"
        >
          Create your first project
        </Link>
      )}
    </div>
  );
}
