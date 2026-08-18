"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Github,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Send,
} from "lucide-react";

import { doc, getDoc } from "firebase/firestore";

import SectionHeading from "@/components/ui/SectionHeading";
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

export default function ContactFormView() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  const [loadingProfile, setLoadingProfile] = useState(true);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // =========================================================
  // LOAD PROFILE FROM FIRESTORE
  // =========================================================

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const profileRef = doc(db, "profile", "main");
        const snapshot = await getDoc(profileRef);

        if (!mounted) return;

        if (snapshot.exists()) {
          const data = snapshot.data();

          setProfile({
            ...defaultProfile,
            ...data,
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (mounted) {
          setLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // CONTACT FORM
  // =========================================================

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      form.name.trim().length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
      form.message.trim().length < 10
    ) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to send message.");
      }

      setForm({
        name: "",
        email: "",
        message: "",
      });

      setStatus("success");
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="border-t border-white/[.06] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* =================================================
            HEADER
        ================================================= */}

        <SectionHeading
          eyebrow="04 / Contact"
          title={
            <>
              Have an idea?{" "}
              <span className="text-violet-300">Let&apos;s talk.</span>
            </>
          }
          description="Tell me what you are building, learning or planning. I'll get back to you as soon as I can."
        />

        {/* =================================================
            CONTACT CONTENT
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[.65fr_1.35fr]">
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <aside className="space-y-4">
            {/* =================================================
                DIRECT CONTACT
            ================================================= */}

            <div className="glass rounded-3xl p-7">
              <p className="text-xs uppercase tracking-[.2em] text-zinc-500">
                Direct contact
              </p>

              {loadingProfile ? (
                <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
                  <Loader2 size={14} className="animate-spin" />
                  Loading profile...
                </div>
              ) : (
                <>
                  {/* EMAIL */}

                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="mt-5 flex items-center gap-3 rounded-2xl border border-white/[.07] p-4 text-sm text-zinc-300 transition hover:bg-white/[.04] hover:text-white"
                    >
                      <Mail size={18} className="shrink-0 text-cyan-300" />

                      <span className="min-w-0 truncate">{profile.email}</span>

                      <ArrowUpRight size={15} className="ml-auto shrink-0" />
                    </a>
                  )}

                  {/* LOCATION */}

                  {profile.location && (
                    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/[.07] p-4 text-sm text-zinc-400">
                      <MapPin size={18} className="shrink-0 text-violet-300" />

                      <span>{profile.location}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* =================================================
                SOCIAL
            ================================================= */}

            <div className="glass rounded-3xl p-7">
              <p className="text-xs uppercase tracking-[.2em] text-zinc-500">
                Social
              </p>

              <div className="mt-5 grid gap-2">
                {/* GITHUB */}

                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/[.07] p-3 text-sm text-zinc-400 transition hover:bg-white/[.04] hover:text-white"
                  >
                    <Github size={17} />

                    <span>GitHub</span>

                    <ArrowUpRight size={14} className="ml-auto" />
                  </a>
                )}

                {/* LINKEDIN */}

                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/[.07] p-3 text-sm text-zinc-400 transition hover:bg-white/[.04] hover:text-white"
                  >
                    <Linkedin size={17} />

                    <span>LinkedIn</span>

                    <ArrowUpRight size={14} className="ml-auto" />
                  </a>
                )}

                {/* INSTAGRAM */}

                {profile.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/[.07] p-3 text-sm text-zinc-400 transition hover:bg-white/[.04] hover:text-white"
                  >
                    <Instagram size={17} />

                    <span>Instagram</span>

                    <ArrowUpRight size={14} className="ml-auto" />
                  </a>
                )}
              </div>
            </div>
          </aside>

          {/* =================================================
              CONTACT FORM
          ================================================= */}

          <form onSubmit={submit} className="glass rounded-3xl p-6 sm:p-8">
            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {status === "success" && (
              <div className="mb-5 flex items-center gap-2 rounded-2xl border border-lime-300/20 bg-lime-300/[.06] p-4 text-sm text-lime-200">
                <CheckCircle2 size={18} />

                <span>Message sent successfully.</span>
              </div>
            )}

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {status === "error" && (
              <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/[.06] p-4 text-sm text-red-200">
                Please check your fields and try again.
              </div>
            )}

            {/* =================================================
                NAME + EMAIL
            ================================================= */}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* NAME */}

              <label className="text-xs text-zinc-400">
                Name
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/60"
                  placeholder="Your name"
                />
              </label>

              {/* EMAIL */}

              <label className="text-xs text-zinc-400">
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/60"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            {/* =================================================
                MESSAGE
            ================================================= */}

            <label className="mt-4 block text-xs text-zinc-400">
              Message
              <textarea
                required
                minLength={10}
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                rows={9}
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-violet-400/60"
                placeholder="Tell me a little about your idea..."
              />
            </label>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send message
                  <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
