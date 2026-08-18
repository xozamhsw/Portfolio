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

import SectionHeading from "@/components/ui/SectionHeading";
import { db } from "@/lib/firebase";

interface Skill {
  id: string;
  name: string;
  category: string;
}

const categories = [
  {
    key: "Frontend",
    label: "Frontend",
    description: "Interfaces & experiences",
    icon: Code2,
    accent: "from-cyan-400/20 to-blue-500/5",
  },
  {
    key: "Backend",
    label: "Backend",
    description: "APIs & application logic",
    icon: Server,
    accent: "from-violet-400/20 to-purple-500/5",
  },
  {
    key: "Data",
    label: "Data & Cloud",
    description: "Storage & infrastructure",
    icon: Database,
    accent: "from-emerald-400/20 to-teal-500/5",
  },
  {
    key: "Creative",
    label: "Design",
    description: "Visual & product design",
    icon: Palette,
    accent: "from-pink-400/20 to-rose-500/5",
  },
  {
    key: "Tools",
    label: "Tools",
    description: "Workflow & productivity",
    icon: Wrench,
    accent: "from-amber-300/20 to-orange-500/5",
  },
] as const;

export default function Skills() {
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
    <section
      id="skills"
      className="relative overflow-hidden border-t border-white/[.06] py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-20 size-72 -translate-x-1/2 rounded-full bg-violet-500/[.06] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="02 / Tech Stack"
          title={
            <>
              Tools I use to{" "}
              <span className="text-cyan-300">build things.</span>
            </>
          }
          description="A collection of technologies, tools and platforms I use to turn ideas into functional digital products."
        />

        {loading ? (
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`h-48 animate-pulse rounded-3xl border border-white/[.08] bg-white/[.025] ${
                  index < 2 ? "lg:col-span-3" : "lg:col-span-2"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {categories.map((category, index) => {
              const Icon = category.icon;

              const categorySkills = skillsByCategory[category.key] ?? [];

              return (
                <article
                  key={category.key}
                  className={`group relative overflow-hidden rounded-3xl border border-white/[.08] bg-white/[.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[.15] hover:bg-white/[.045] ${
                    index < 2 ? "lg:col-span-3" : "lg:col-span-2"
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${category.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid size-11 place-items-center rounded-2xl border border-white/[.08] bg-black/20 text-zinc-200">
                          <Icon size={19} strokeWidth={1.8} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-white">
                            {category.label}
                          </h3>

                          <p className="mt-0.5 text-xs text-zinc-500">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <ArrowUpRight
                        size={17}
                        className="text-zinc-700 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-300"
                      />
                    </div>

                    <div className="relative mt-7 flex flex-wrap gap-2">
                      {categorySkills.length > 0 ? (
                        categorySkills.map((skill) => (
                          <span
                            key={skill.id}
                            className="rounded-xl border border-white/[.07] bg-black/20 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-white/[.16] hover:bg-white/[.06] hover:text-white"
                          >
                            {skill.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-700">
                          No skills yet.
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-white/[.07] bg-white/[.02] p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-sm font-medium text-zinc-200">
              Always learning, always building.
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              My stack evolves with every project and new challenge.
            </p>
          </div>

          <Link
            href="/skills"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            Explore full stack
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
