import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.035]">
      {/* IMAGE */}
      <Link
        href={`/projects/${project.slug}`}
        className="block"
        aria-label={`View ${project.title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-700">
              No image
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-zinc-300 backdrop-blur">
              {project.category}
            </span>

            <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] text-zinc-400 backdrop-blur">
              {project.year}
            </span>
          </div>

          <div className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={17} />
          </div>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-wider text-zinc-600">
              {String(index + 1).padStart(2, "0")}
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
              {project.title}
            </h2>
          </div>

          <Link
            href={`/projects/${project.slug}`}
            aria-label={`View ${project.title}`}
            className="shrink-0 rounded-xl border border-white/10 p-2 text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {project.description}
        </p>

        {/* TECH */}
        {project.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-400 transition-colors hover:border-white/[0.12] hover:text-zinc-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        {(project.github || project.live) && (
          <div className="mt-6 flex flex-wrap gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                <Github size={15} />
                Code
              </a>
            )}

            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-xs font-semibold text-black transition hover:bg-violet-100"
              >
                Live
                <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
