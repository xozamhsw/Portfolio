"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";

import PageHeader from "@/components/ui/PageHeader";
import ProjectCard from "@/components/ui/ProjectCard";
import { db } from "@/lib/firebase";
import type { Project } from "@/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsRef = collection(db, "projects");

    /*
     * IMPORTANT:
     *
     * Jangan menggunakan:
     *
     * where("published", "==", true)
     * orderBy("createdAt", "desc")
     *
     * secara bersamaan karena Firestore membutuhkan
     * composite index.
     *
     * Kita mengambil collection terlebih dahulu,
     * kemudian melakukan filtering dan sorting
     * di client.
     */

    const unsubscribe = onSnapshot(
      projectsRef,
      (snapshot) => {
        const data: Project[] = snapshot.docs
          .map((document) => {
            const project = document.data();

            return {
              id: document.id,

              title: typeof project.title === "string" ? project.title : "",

              slug:
                typeof project.slug === "string" ? project.slug : document.id,

              category:
                typeof project.category === "string" ? project.category : "",

              year: typeof project.year === "string" ? project.year : "",

              description:
                typeof project.description === "string"
                  ? project.description
                  : "",

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

              createdAt:
                project.createdAt instanceof Timestamp
                  ? project.createdAt
                  : null,

              updatedAt:
                project.updatedAt instanceof Timestamp
                  ? project.updatedAt
                  : null,
            };
          })

          /*
           * PUBLIC PORTFOLIO
           *
           * Hanya project published yang ditampilkan.
           */
          .filter((project) => project.published)

          /*
           * SORTING
           *
           * Project terbaru berada di atas.
           *
           * Tidak membutuhkan Firestore composite index.
           */
          .sort((a, b) => {
            const aTime =
              a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;

            const bTime =
              b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;

            return bTime - aTime;
          });

        setProjects(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load projects:", error);

        setProjects([]);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <main>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <PageHeader
        eyebrow="03 / Projects"
        title={
          <>
            Selected work, experiments &{" "}
            <span className="text-lime-200">things I&apos;m learning.</span>
          </>
        }
        description="A growing collection of web apps, data experiments and creative projects. Each one is a chance to understand something a little deeper."
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8 flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              {loading
                ? "Loading projects..."
                : `${projects.length} ${
                    projects.length === 1 ? "project" : "projects"
                  } in this portfolio`}
            </p>

            <span className="shrink-0 rounded-full border border-white/[.08] px-3 py-1.5 text-xs text-zinc-500">
              Portfolio
            </span>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[420px] animate-pulse rounded-3xl border border-white/[.08] bg-white/[.025]"
                />
              ))}
            </div>
          ) : projects.length > 0 ? (
            /* ===============================================
               PROJECTS
            =============================================== */

            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id ?? project.slug}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          ) : (
            /* ===============================================
               EMPTY
            =============================================== */

            <div className="rounded-3xl border border-white/[.08] bg-white/[.02] px-6 py-16 text-center">
              <p className="text-sm text-zinc-500">
                No published projects available yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
