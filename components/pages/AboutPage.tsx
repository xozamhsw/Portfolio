"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  ExternalLink,
  MapPin,
  Palette,
  Rocket,
  Sparkles,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import { useProfile } from "@/hooks/useProfile";

const timeline = [
  {
    year: "2025",
    title: "Started my Informatics Engineering journey",
    description:
      "Began building a stronger foundation in programming, systems and digital product development.",
  },
  {
    year: "2025–26",
    title: "Explored modern web development",
    description:
      "Worked with React, Next.js, TypeScript, Tailwind CSS, Firebase and backend technologies through hands-on projects.",
  },
  {
    year: "Now",
    title: "Building, learning and experimenting",
    description:
      "Continuing to improve engineering skills while combining them with UI/UX and creative exploration.",
  },
];

const values = [
  {
    icon: Code2,
    number: "01",
    title: "Engineering",
    description:
      "Understanding how systems work and turning ideas into reliable digital products.",
    accent: "text-cyan-300",
    glow: "group-hover:bg-cyan-400/[0.05]",
  },
  {
    icon: Palette,
    number: "02",
    title: "Design",
    description:
      "Creating interfaces that are not only functional, but also clear and enjoyable to use.",
    accent: "text-violet-300",
    glow: "group-hover:bg-violet-400/[0.05]",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Growth",
    description:
      "Learning through projects, experimentation, mistakes and continuous improvement.",
    accent: "text-lime-200",
    glow: "group-hover:bg-lime-300/[0.04]",
  },
];

export default function AboutPage() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <main className="overflow-hidden">
        <section className="min-h-[70vh] px-4 py-32 sm:px-6">
          <div className="mx-auto max-w-6xl animate-pulse">
            <div className="h-4 w-24 rounded bg-white/10" />

            <div className="mt-5 h-12 max-w-2xl rounded bg-white/10" />

            <div className="mt-4 h-5 max-w-xl rounded bg-white/10" />

            <div className="mt-12 grid gap-5 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="aspect-[4/4.8] rounded-[2rem] bg-white/[0.04]" />
              </div>

              <div className="lg:col-span-7">
                <div className="h-[560px] rounded-[2rem] bg-white/[0.04]" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="overflow-hidden">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <PageHeader
        eyebrow="01 / About me"
        title={
          <>
            More than code.{" "}
            <span className="text-violet-300">A continuous journey.</span>
          </>
        }
        description={profile.bio}
      />

      {/* =====================================================
          PROFILE + STORY
      ===================================================== */}

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch lg:gap-6">
            {/* =================================================
                PROFILE
            ================================================= */}

            <div className="lg:col-span-5 lg:flex">
              <div className="group relative flex w-full flex-col">
                {/* Ambient glow */}

                <div className="pointer-events-none absolute -inset-5 rounded-[3rem] bg-violet-500/[0.045] blur-3xl transition duration-500 group-hover:bg-violet-500/[0.07]" />

                {/* Card */}

                <div className="relative flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-2">
                  {/* Image */}

                  <div className="relative min-h-[360px] flex-1 overflow-hidden rounded-[1.5rem] bg-zinc-900">
                    {profile.formalPhoto ? (
                      <Image
                        src={profile.formalPhoto}
                        alt={`${profile.name} portrait`}
                        fill
                        priority
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 500px"
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-sm text-zinc-600">
                        No profile image
                      </div>
                    )}

                    {/* Image overlay */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                    {/* Profile identity */}

                    <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                      <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
                            {profile.name}
                          </p>

                          <p className="mt-1 text-xs text-zinc-400">
                            {profile.role}
                          </p>
                        </div>

                        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-black/30 text-cyan-300 backdrop-blur-md">
                          <Code2 size={18} />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-3.5 sm:px-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <MapPin size={13} className="shrink-0 text-cyan-300" />

                      <span className="truncate text-[11px] text-zinc-400">
                        {profile.location}
                      </span>
                    </div>

                    <span className="hidden size-1 shrink-0 rounded-full bg-zinc-700 sm:block" />

                    <span className="truncate text-[11px] text-zinc-500">
                      {profile.university}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                STORY
            ================================================= */}

            <article className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025] lg:col-span-7">
              {/* Decorative glow */}

              <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-violet-500/[0.05] blur-[90px]" />

              <div className="relative p-6 sm:p-8 lg:p-9">
                {/* Label */}

                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-violet-400" />

                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-300 sm:text-xs">
                    My story
                  </p>
                </div>

                {/* Heading */}

                <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[2.55rem]">
                  Curious about how things work —
                  <span className="text-zinc-500">
                    {" "}
                    and how they can feel better.
                  </span>
                </h2>

                {/* Story */}

                <div className="mt-7 space-y-4 text-sm leading-7 text-zinc-400 sm:text-[15px]">
                  <p>
                    I&apos;m an Informatics Engineering student at{" "}
                    <span className="text-zinc-200">{profile.university}</span>.
                    My main interest is modern web development, where
                    engineering decisions meet interface design and user
                    experience.
                  </p>

                  <p>
                    I learn best by building. Personal projects give me room to
                    test ideas, make mistakes, understand systems and turn
                    abstract concepts into something people can actually use.
                  </p>

                  <p>
                    Along the way, I&apos;ve become increasingly interested in
                    the details behind a product — from how data moves through
                    an application to how a small interaction can make an
                    interface feel more natural.
                  </p>
                </div>

                {/* Interests */}

                <div className="mt-7 border-t border-white/[0.06] pt-5">
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                    Areas I enjoy exploring
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.04] px-3 py-1.5 text-[11px] text-cyan-200">
                      Web Development
                    </span>

                    <span className="rounded-full border border-violet-300/10 bg-violet-300/[0.04] px-3 py-1.5 text-[11px] text-violet-200">
                      UI / UX
                    </span>

                    <span className="rounded-full border border-lime-300/10 bg-lime-300/[0.04] px-3 py-1.5 text-[11px] text-lime-200">
                      Creative Technology
                    </span>
                  </div>
                </div>

                {/* Quick navigation */}

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/projects"
                    className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-black/10 px-4 py-3.5 transition duration-300 hover:border-white/[0.14] hover:bg-white/[0.04]"
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                        Explore
                      </p>

                      <p className="mt-1 text-sm font-medium text-white">
                        My projects
                      </p>
                    </div>

                    <ArrowUpRight
                      size={17}
                      className="text-zinc-500 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                    />
                  </Link>

                  <a
                    href="#journey"
                    className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-black/10 px-4 py-3.5 transition duration-300 hover:border-white/[0.14] hover:bg-white/[0.04]"
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                        Discover
                      </p>

                      <p className="mt-1 text-sm font-medium text-white">
                        My journey
                      </p>
                    </div>

                    <ArrowDown
                      size={17}
                      className="text-zinc-500 transition duration-300 group-hover:translate-y-0.5 group-hover:text-white"
                    />
                  </a>
                </div>
              </div>
            </article>
          </div>

          {/* =================================================
              VALUES
          ================================================= */}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.number}
                  className={`group relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.02] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/[0.14] sm:p-6 ${value.glow}`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-[10px] font-semibold tracking-[0.2em] ${value.accent}`}
                    >
                      {value.number}
                    </span>

                    <Icon
                      size={19}
                      className={`${value.accent} opacity-70 transition duration-300 group-hover:scale-110`}
                    />
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-semibold text-white">
                      {value.title}
                    </h3>

                    <p className="mt-2 max-w-xs text-xs leading-5 text-zinc-500">
                      {value.description}
                    </p>
                  </div>

                  <div
                    className={`pointer-events-none absolute -bottom-8 -right-8 size-24 rounded-full blur-3xl opacity-0 transition duration-500 group-hover:opacity-100 ${
                      value.accent === "text-cyan-300"
                        ? "bg-cyan-400/20"
                        : value.accent === "text-violet-300"
                          ? "bg-violet-400/20"
                          : "bg-lime-300/20"
                    }`}
                  />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          JOURNEY
      ===================================================== */}

      <section
        id="journey"
        className="border-y border-white/[0.06] bg-[#0a0a10] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.38fr_1fr] lg:gap-20">
            {/* Section heading */}

            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-lime-200" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-lime-200 sm:text-xs">
                  Journey
                </p>
              </div>

              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                A timeline
                <br />
                <span className="text-zinc-600">of learning.</span>
              </h2>

              <p className="mt-5 max-w-xs text-sm leading-6 text-zinc-500">
                Every project, experiment and challenge adds another layer to
                the journey.
              </p>
            </div>

            {/* Timeline */}

            <div className="relative">
              <div className="absolute bottom-10 left-[7px] top-10 w-px bg-gradient-to-b from-lime-300/40 via-white/[0.08] to-transparent sm:left-[9px]" />

              <div className="space-y-5 sm:space-y-6">
                {timeline.map((item, index) => (
                  <article
                    key={item.year}
                    className="relative grid grid-cols-[32px_1fr] gap-4 sm:grid-cols-[42px_1fr] sm:gap-6"
                  >
                    <div className="relative z-10 mt-7 flex justify-center">
                      <span
                        className={`grid size-4 place-items-center rounded-full border ${
                          index === timeline.length - 1
                            ? "border-lime-200/50 bg-lime-200/10"
                            : "border-white/10 bg-[#0a0a10]"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            index === timeline.length - 1
                              ? "bg-lime-200"
                              : "bg-zinc-600"
                          }`}
                        />
                      </span>
                    </div>

                    <div className="group rounded-[1.5rem] border border-white/[0.07] bg-white/[0.02] p-5 transition duration-300 hover:border-white/[0.13] hover:bg-white/[0.04] sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-lime-200">
                          {item.year}
                        </span>

                        {index === timeline.length - 1 && (
                          <span className="rounded-full border border-lime-200/10 bg-lime-200/[0.06] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-lime-200">
                            Current
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-base font-semibold tracking-tight text-white sm:text-lg">
                        {item.title}
                      </h3>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHAT DRIVES ME
      ===================================================== */}

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.09] via-white/[0.025] to-cyan-400/[0.05] p-6 sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-violet-500/[0.08] blur-[90px]" />

            <div className="relative grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-10">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-lime-200/10 bg-lime-200/[0.06] text-lime-200">
                <Sparkles size={21} />
              </div>

              <div className="max-w-4xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500 sm:text-xs">
                  What drives me
                </p>

                <blockquote className="mt-4 text-2xl font-medium leading-9 tracking-tight text-zinc-100 sm:text-3xl sm:leading-[1.4] lg:text-4xl">
                  &ldquo;I want to keep growing into a developer who can
                  understand the system behind a product and the human
                  experience in front of it.&rdquo;
                </blockquote>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/skills"
                    className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Explore my stack
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-3 py-3 text-xs font-medium text-zinc-500 transition hover:text-white"
                  >
                    Let&apos;s talk
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
