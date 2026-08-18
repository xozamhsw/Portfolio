import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Github } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { Project } from "@/types/project";

// ===========================================================
// GET PROJECT BY SLUG
// ===========================================================

async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const projectsRef = collection(db, "projects");

    const projectQuery = query(
      projectsRef,
      where("slug", "==", slug),
      where("published", "==", true),
    );

    const snapshot = await getDocs(projectQuery);

    if (snapshot.empty) {
      return null;
    }

    const document = snapshot.docs[0];
    const data = document.data();

    return {
      id: document.id,

      title: data.title ?? "",

      slug: data.slug ?? document.id,

      category: data.category ?? "",

      year: data.year ?? "",

      description: data.description ?? "",

      overview: data.overview ?? "",

      highlights: Array.isArray(data.highlights) ? data.highlights : [],

      role: data.role ?? "",

      tags: Array.isArray(data.tags) ? data.tags : [],

      github: data.github ?? "",

      live: data.live ?? "",

      image: data.image ?? "",

      published: data.published === true,

      createdAt: data.createdAt ?? null,

      updatedAt: data.updatedAt ?? null,
    };
  } catch (error) {
    console.error("Failed to load project:", error);

    return null;
  }
}

// ===========================================================
// METADATA
// ===========================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project — Zagar",
      description: "Project portfolio of Zagar.",
    };
  }

  return {
    title: `${project.title} — Zagar`,
    description:
      project.description || project.overview || "Project portfolio of Zagar.",
  };
}

// ===========================================================
// PAGE
// ===========================================================

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug);

  // ---------------------------------------------------------
  // NOT FOUND
  // ---------------------------------------------------------

  if (!project) {
    notFound();
  }

  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------

  return (
    <main>
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="border-b border-white/[.06] pt-28 pb-8 sm:pt-32 sm:pb-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* BACK */}

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to projects
          </Link>

          {/* META */}

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {project.category && (
              <span className="rounded-full border border-white/[.08] px-3 py-1.5 text-xs text-zinc-400">
                {project.category}
              </span>
            )}

            {project.year && (
              <span className="rounded-full border border-white/[.08] px-3 py-1.5 text-xs text-zinc-500">
                {project.year}
              </span>
            )}
          </div>

          {/* TITLE */}

          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-.04em] sm:text-5xl">
            {project.title}
          </h1>

          {/* DESCRIPTION */}

          {project.description && (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7 text-justify">
              {project.description}
            </p>
          )}
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* =================================================
              IMAGE
          ================================================= */}

          {project.image && (
            <div className="overflow-hidden rounded-[1.75rem] border border-white/[.08] bg-white/[.025]">
              <Image
                width={1024}
                height={1024}
                src={project.image}
                alt={project.title || "Project"}
                className="h-auto w-full object-contain"
                unoptimized
              />
            </div>
          )}

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
            {/* =================================================
                ARTICLE
            ================================================= */}

            <article>
              {/* OVERVIEW */}

              <p className="text-xs uppercase tracking-[.2em] text-violet-300">
                Overview
              </p>

              {project.overview ? (
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8 text-justify">
                  {project.overview}
                </p>
              ) : (
                <p className="mt-3 text-sm text-zinc-600">
                  No overview available.
                </p>
              )}

              {/* HIGHLIGHTS */}

              {project.highlights.length > 0 && (
                <>
                  <h2 className="mt-10 text-lg font-semibold sm:text-xl">
                    Highlights
                  </h2>

                  <ul className="mt-5 space-y-3">
                    {project.highlights.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="group flex items-start gap-3 rounded-2xl border border-white/[.07] bg-white/[.02] p-4 transition duration-300 hover:border-violet-400/20 hover:bg-white/[.035]"
                      >
                        {/* Icon */}
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-violet-400/[.08] text-violet-300">
                          <CheckCircle2 size={13} />
                        </span>

                        {/* Text */}
                        <p className="text-sm leading-6 text-zinc-400 transition group-hover:text-zinc-300">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </article>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="glass h-fit rounded-3xl p-6 lg:sticky lg:top-28">
              <p className="text-xs uppercase tracking-[.2em] text-zinc-500">
                Project details
              </p>

              <div className="mt-5 space-y-5">
                {/* ROLE */}

                {project.role && (
                  <div>
                    <p className="text-xs text-zinc-600">Role</p>

                    <p className="mt-1 text-sm text-zinc-300">{project.role}</p>
                  </div>
                )}

                {/* CATEGORY */}

                {project.category && (
                  <div>
                    <p className="text-xs text-zinc-600">Category</p>

                    <p className="mt-1 text-sm text-zinc-300">
                      {project.category}
                    </p>
                  </div>
                )}

                {/* YEAR */}

                {project.year && (
                  <div>
                    <p className="text-xs text-zinc-600">Year</p>

                    <p className="mt-1 text-sm text-zinc-300">{project.year}</p>
                  </div>
                )}

                {/* STACK */}

                {project.tags.length > 0 && (
                  <div>
                    <p className="text-xs text-zinc-600">Stack</p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="rounded-lg bg-white/[.05] px-2.5 py-1.5 text-xs text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================
                  LINKS
              ================================================= */}

              {(project.github || project.live) && (
                <div className="mt-7 grid gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[.06] hover:text-white"
                    >
                      <Github size={16} />
                      View code
                    </a>
                  )}

                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-violet-100"
                    >
                      <ArrowUpRight size={16} />
                      Open live project
                    </a>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
