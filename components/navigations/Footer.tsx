"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Github,
  Instagram,
  Linkedin,
  Loader2,
} from "lucide-react";

import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { Profile } from "@/types/profile";

const defaultProfile: Profile = {
  name: "",
  role: "",
  location: "",
  university: "",
  bio: "",
  about: "",
  email: "",
  github: "",
  linkedin: "",
  instagram: "",
  formalPhoto: "",
  avatar: "",
};

export default function Footer() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD PROFILE FROM FIRESTORE
  // =========================================================

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileRef = doc(db, "profile", "main");
        const snapshot = await getDoc(profileRef);

        if (snapshot.exists()) {
          const data = snapshot.data();

          setProfile({
            ...defaultProfile,
            ...data,
          });
        }
      } catch (error) {
        console.error("Failed to load footer profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return (
    <footer className="border-t border-white/[.06] bg-[#07070b]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_.7fr_.7fr]">
          {/* =================================================
              BRAND
          ================================================= */}

          <div>
            <Link href="/" className="text-xl font-semibold tracking-tight">
              zagar<span className="text-violet-400">.</span>
            </Link>

            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
              {profile.bio ||
                "Informatics engineering student building software and visual experiences with curiosity and intention."}
            </p>

            {/* SOCIAL ICONS */}

            <div className="mt-5 flex gap-2">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="rounded-xl border border-white/10 p-2.5 text-zinc-400 transition hover:bg-white/[.05] hover:text-white"
                >
                  <Github size={17} />
                </a>
              )}

              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-xl border border-white/10 p-2.5 text-zinc-400 transition hover:bg-white/[.05] hover:text-white"
                >
                  <Linkedin size={17} />
                </a>
              )}

              {profile.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-xl border border-white/10 p-2.5 text-zinc-400 transition hover:bg-white/[.05] hover:text-white"
                >
                  <Instagram size={17} />
                </a>
              )}
            </div>
          </div>

          {/* =================================================
              EXPLORE
          ================================================= */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-zinc-600">
              Explore
            </p>

            <div className="mt-4 grid gap-3 text-sm text-zinc-500">
              <Link href="/about" className="transition hover:text-white">
                About me
              </Link>

              <Link href="/skills" className="transition hover:text-white">
                Tech stack
              </Link>

              <Link href="/projects" className="transition hover:text-white">
                Projects
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-zinc-300 transition hover:text-white"
              >
                Contact
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          {/* =================================================
              ELSEWHERE
          ================================================= */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-zinc-600">
              Elsewhere
            </p>

            <div className="mt-4 grid gap-3 text-sm text-zinc-500">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  GitHub
                </a>
              )}

              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  LinkedIn
                </a>
              )}

              {profile.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            COPYRIGHT
        ================================================= */}

        <div className="mt-10 flex flex-col gap-2 border-t border-white/[.06] pt-6 text-xs text-zinc-600 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()}{" "}
            {loading ? (
              <Loader2 size={12} className="inline animate-spin" />
            ) : (
              profile.name || "Zagar"
            )}
          </span>

          <span>Designed & built with Next.js</span>
        </div>
      </div>
    </footer>
  );
}
