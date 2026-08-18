"use client";

import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";

import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import { useProjects } from "@/hooks/useProjects";

export default function Projects() {
  const { projects: featured, loading, error } = useProjects(true);

  return (
    <section
      id="projects"
      className="border-t border-white/[0.06] bg-[#0a0a10] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="03 / Selected work"
          title={
            <>
              Things I&apos;ve <span className="text-lime-200">built.</span>
            </>
          }
          description="A selection of experiments and projects across web development, data and creative technology."
          right={
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
            >
              View all
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          }
        />

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.02]">
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <Loader2 size={16} className="animate-spin text-violet-300" />
              Loading projects...
            </div>
          </div>
        ) : error ? (
          /* ===================================================
             ERROR
          =================================================== */

          <div className="rounded-3xl border border-red-400/10 bg-red-400/[0.03] px-6 py-16 text-center">
            <p className="text-sm text-red-300">Unable to load projects.</p>

            <p className="mt-2 text-xs text-zinc-600">
              Please try again later.
            </p>
          </div>
        ) : featured.length > 0 ? (
          /* ===================================================
             PROJECTS
          =================================================== */

          <div className="grid gap-5 md:grid-cols-2">
            {featured.map((project, index) => (
              <ProjectCard
                key={project.id ?? project.slug}
                project={project}
                index={index}
              />
            ))}
          </div>
        ) : (
          /* ===================================================
             EMPTY
          =================================================== */

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
            <p className="text-sm text-zinc-500">
              No featured projects available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
