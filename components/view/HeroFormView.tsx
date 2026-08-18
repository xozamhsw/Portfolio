"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Github,
  Instagram,
  Linkedin,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import { useProfile } from "@/hooks/useProfile";

export default function Hero() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <section className="relative min-h-screen overflow-hidden grid-bg">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 sm:px-6">
          <div className="w-full animate-pulse">
            <div className="h-5 w-32 rounded bg-white/10" />

            <div className="mt-5 h-16 max-w-2xl rounded bg-white/10 sm:h-20" />

            <div className="mt-6 h-6 max-w-xl rounded bg-white/10" />

            <div className="mt-4 h-20 max-w-2xl rounded bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  const nameParts = profile.name.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const remainingName = nameParts.slice(1).join(" ");

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden grid-bg"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-violet-600/15 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-40 size-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
        {/* =====================================================
            CONTENT
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Status */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/[.06] px-3 py-1.5 text-xs font-medium text-lime-200">
            <span className="size-1.5 animate-pulse rounded-full bg-lime-300" />
            Open to collaboration
          </div>

          <p className="mb-3 text-sm font-medium text-zinc-400">
            Hello, I&apos;m
          </p>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.045em] sm:text-6xl lg:text-7xl">
            {firstName}{" "}
            {remainingName && (
              <span className="bg-gradient-to-r from-violet-300 via-cyan-200 to-lime-200 bg-clip-text text-transparent">
                {remainingName}
              </span>
            )}
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-zinc-200 sm:text-xl">
            {profile.role}
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            {profile.bio}
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-1 hover:bg-violet-100"
            >
              Explore my work
              <ArrowUpRight size={17} />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/[.08]"
            >
              More about me
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {/* Meta */}
          <div className="mt-9 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            {profile.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin size={15} className="text-cyan-300" />
                {profile.location}
              </span>
            )}

            {profile.location && (
              <span className="hidden size-1 rounded-full bg-zinc-700 sm:block" />
            )}

            <span className="inline-flex items-center gap-2">
              <Sparkles size={15} className="text-lime-300" />
              Focused on continuous learning
            </span>
          </div>

          {/* Social */}
          <div className="mt-8 flex gap-2">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="rounded-xl border border-white/10 p-2.5 text-zinc-400 transition hover:bg-white/[.06] hover:text-white"
              >
                <Github size={18} />
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="rounded-xl border border-white/10 p-2.5 text-zinc-400 transition hover:bg-white/[.06] hover:text-white"
              >
                <Linkedin size={18} />
              </a>
            )}

            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-xl border border-white/10 p-2.5 text-zinc-400 transition hover:bg-white/[.06] hover:text-white"
              >
                <Instagram size={18} />
              </a>
            )}
          </div>
        </motion.div>

        {/* =====================================================
            PROFILE IMAGE
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-400/15 blur-2xl" />

          <div className="relative rounded-[2rem] border border-white/10 bg-white/[.035] p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-zinc-900">
              {profile.formalPhoto ? (
                <Image
                  src={profile.formalPhoto}
                  alt={profile.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="grid h-full place-items-center text-sm text-zinc-600">
                  No profile image
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-5 pt-24">
                <p className="text-xs uppercase tracking-[.18em] text-zinc-400">
                  Currently building
                </p>

                <p className="mt-1 font-medium">Useful digital experiences</p>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 py-3 text-xs text-zinc-500">
              <span>01 — 04</span>
              <ArrowDownRight size={16} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
