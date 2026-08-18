"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import {
  ArrowUpRight,
  Code2,
  Database,
  Palette,
  Server,
  Wrench,
} from "lucide-react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import { db } from "@/lib/firebase";

interface Skill {
  id: string;
  name: string;
  category: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

const categories = [
  {
    key: "Frontend",
    name: "Frontend",
    description: "Interfaces, components and motion",
    icon: Code2,
    iconClass: "text-cyan-300",
  },
  {
    key: "Backend",
    name: "Backend",
    description: "APIs and application logic",
    icon: Server,
    iconClass: "text-violet-300",
  },
  {
    key: "Data",
    name: "Data & Cloud",
    description: "Storage, media and infrastructure",
    icon: Database,
    iconClass: "text-lime-200",
  },
  {
    key: "Creative",
    name: "Design",
    description: "Visual thinking and product interfaces",
    icon: Palette,
    iconClass: "text-pink-300",
  },
  {
    key: "Tools",
    name: "Tools",
    description: "Workflow, version control and delivery",
    icon: Wrench,
    iconClass: "text-amber-200",
  },
] as const;

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const skillsRef = collection(db, "skills");

    const unsubscribe = onSnapshot(
      skillsRef,
      (snapshot) => {
        const data: Skill[] = snapshot.docs.map((doc) => {
          const skill = doc.data();

          return {
            id: doc.id,
            name: skill.name ?? "",
            category: skill.category ?? "",
            createdAt: skill.createdAt,
            updatedAt: skill.updatedAt,
          };
        });

        setSkills(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load skills:", error);
        setSkills([]);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const skillsByCategory = useMemo(() => {
    return categories.reduce(
      (result, category) => {
        result[category.key] = skills.filter(
          (skill) => skill.category === category.key,
        );

        return result;
      },
      {} as Record<string, Skill[]>,
    );
  }, [skills]);

  return (
    <main>
      <PageHeader
        eyebrow="02 / Tech stack"
        title={
          <>
            The tools behind <span className="text-cyan-300">my work.</span>
          </>
        }
        description="No artificial percentages. These are technologies and tools I have explored through projects, coursework and hands-on experimentation."
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-3xl border border-white/[.08] bg-white/[.025]"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const list = skillsByCategory[category.key] ?? [];

                return (
                  <article
                    key={category.key}
                    className="group rounded-3xl border border-white/[.08] bg-white/[.025] p-6 transition hover:border-white/[.14] hover:bg-white/[.04] sm:p-8"
                  >
                    <div className="grid gap-6 lg:grid-cols-[.55fr_1.45fr] lg:items-center">
                      <div className="flex items-start gap-4">
                        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/[.04]">
                          <Icon size={21} className={category.iconClass} />
                        </span>

                        <div>
                          <h2 className="text-xl font-semibold text-white">
                            {category.name}
                          </h2>

                          <p className="mt-1 text-sm text-zinc-500">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {list.length > 0 ? (
                          list.map((skill) => (
                            <span
                              key={skill.id}
                              className="rounded-xl border border-white/[.07] bg-black/20 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-white/[.16] hover:text-white"
                            >
                              {skill.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-zinc-700">
                            No skills available.
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-8 rounded-3xl border border-white/[.07] bg-gradient-to-br from-violet-500/[.08] to-transparent p-7 sm:p-9">
            <p className="text-xs uppercase tracking-[.2em] text-zinc-500">
              How I think about the stack
            </p>

            <p className="mt-3 max-w-3xl text-lg leading-8 text-zinc-300">
              Tools are means, not the product. I care about choosing a stack
              that makes the interface clearer, the system easier to maintain
              and the final experience more useful.
            </p>

            <Link
              href="/projects"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-cyan-200"
            >
              See the technologies in context
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
