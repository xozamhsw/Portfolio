"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { Project } from "@/types/project";

export function useProjects(featuredOnly = false) {
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const projectsRef = collection(db, "projects");

    /*
     * IMPORTANT
     *
     * Jangan gunakan:
     *
     * where("published", "==", true)
     * orderBy("createdAt", "desc")
     *
     * karena membutuhkan composite index.
     *
     * Kita mengambil data collection,
     * kemudian filtering + sorting dilakukan
     * di client.
     */

    const unsubscribe = onSnapshot(
      projectsRef,
      (snapshot) => {
        try {
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

                github:
                  typeof project.github === "string" ? project.github : "",

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
             * PUBLIC FILTER
             */

            .filter((project) => project.published === true)

            /*
             * SORT BY CREATED DATE
             *
             * Newest project first.
             */

            .sort((a, b) => {
              const aTime =
                a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;

              const bTime =
                b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;

              return bTime - aTime;
            });

          /*
           * FEATURED PROJECTS
           *
           * Saat featuredOnly = true,
           * homepage hanya mengambil beberapa
           * project terbaru.
           *
           * Saat false, semua project published
           * dikembalikan.
           */

          const result = featuredOnly ? data.slice(0, 4) : data;

          setProjects(result);
          setLoading(false);
          setError(null);
        } catch (processingError) {
          console.error("Failed to process projects:", processingError);

          setProjects([]);
          setLoading(false);
          setError("Failed to process projects.");
        }
      },
      (firebaseError) => {
        console.error("Projects realtime error:", firebaseError);

        setProjects([]);
        setLoading(false);
        setError(
          firebaseError instanceof Error
            ? firebaseError.message
            : "Failed to load projects.",
        );
      },
    );

    return () => {
      unsubscribe();
    };
  }, [featuredOnly]);

  return {
    projects,
    loading,
    error,
  };
}
