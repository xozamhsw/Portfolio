"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  Code2,
  GraduationCap,
  MapPin,
  Palette,
  Video,
} from "lucide-react";

import SectionHeading from "@/components/ui/SectionHeading";
import { useProfile } from "@/hooks/useProfile";

export default function About() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <section
        id="about"
        className="border-t border-white/[.06] bg-[#0a0a10] py-24 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="mt-4 h-10 w-80 rounded bg-white/10" />

            <div className="mt-10 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
              <div className="aspect-[4/5] rounded-3xl bg-white/[.04]" />

              <div className="space-y-6">
                <div className="h-64 rounded-3xl bg-white/[.04]" />
                <div className="h-32 rounded-3xl bg-white/[.04]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="border-t border-white/[.06] bg-[#0a0a10] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="01 / About"
          title={
            <>
              A developer with a{" "}
              <span className="text-violet-300">creative side.</span>
            </>
          }
          description="I enjoy turning ideas into interfaces and software that feel clear, useful and intentional."
          right={
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition hover:text-white"
            >
              Read full story
              <ArrowUpRight size={14} />
            </Link>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
          {/* =====================================================
              PROFILE IMAGE
          ===================================================== */}
          <div className="glass overflow-hidden rounded-3xl p-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900">
              {profile.formalPhoto ? (
                <Image
                  src={profile.formalPhoto}
                  alt={profile.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="grid h-full place-items-center text-sm text-zinc-600">
                  No profile image
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 pt-3 text-xs">
              <div className="rounded-xl bg-white/[.04] p-3">
                <p className="text-zinc-500">Base</p>
                <p className="mt-1 text-zinc-200">{profile.location || "—"}</p>
              </div>

              <div className="rounded-xl bg-white/[.04] p-3">
                <p className="text-zinc-500">Field</p>
                <p className="mt-1 text-zinc-200">Informatics</p>
              </div>
            </div>
          </div>

          {/* =====================================================
              CONTENT
          ===================================================== */}
          <div className="grid gap-6">
            <article className="glass rounded-3xl p-6 sm:p-8">
              <p className="text-sm leading-7 text-zinc-300 sm:text-base">
                I&apos;m an Informatics Engineering student at{" "}
                <span className="text-zinc-100">{profile.university}</span> with
                a strong interest in modern web development.
              </p>

              <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
                {profile.bio}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  "Web Development",
                  "UI / UX",
                  "Creative Tech",
                  "Problem Solving",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[.035] px-3 py-1.5 text-xs text-zinc-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>

            {/* Skills / character */}
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [Code2, "Engineering", "Build & ship"],
                [Palette, "Design", "Think visually"],
                [Video, "Creative", "Tell stories"],
              ].map(([Icon, title, sub]) => {
                const I = Icon as typeof Code2;

                return (
                  <div
                    key={title as string}
                    className="glass rounded-2xl p-5 transition hover:-translate-y-1"
                  >
                    <I size={19} className="text-violet-300" />

                    <p className="mt-4 text-sm font-medium">
                      {title as string}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {sub as string}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Education */}
            <article className="glass rounded-3xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300">
                  <GraduationCap size={19} />
                </span>

                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[.16em] text-zinc-500">
                    Education
                  </p>

                  <h3 className="mt-1 font-semibold">
                    Bachelor of Informatics Engineering
                  </h3>

                  <p className="mt-1 text-sm text-zinc-400">
                    {profile.university} · 2025 — Present
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
                <MapPin size={14} />
                {profile.location}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
