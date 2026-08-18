"use client";

import { FormEvent, useState } from "react";
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

import PageHeader from "@/components/ui/PageHeader";
import { useProfile } from "@/hooks/useProfile";

export default function ContactPage() {
  const { profile, loading: profileLoading } = useProfile();

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  async function submit(e: FormEvent) {
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
      console.error("Contact error:", error);
      setStatus("error");
    }
  }

  return (
    <main>
      <PageHeader
        eyebrow="04 / Contact"
        title={
          <>
            Let&apos;s build something{" "}
            <span className="text-violet-300">worth making.</span>
          </>
        }
        description="Have an idea, project or collaboration in mind? Send a message and tell me what you are working on."
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[.65fr_1.35fr]">
          <aside className="space-y-4">
            {/* DIRECT CONTACT */}
            <div className="glass rounded-3xl p-7">
              <p className="text-xs uppercase tracking-[.2em] text-zinc-500">
                Direct contact
              </p>

              {profileLoading ? (
                <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
                  <Loader2 size={14} className="animate-spin" />
                  Loading profile...
                </div>
              ) : (
                <>
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="mt-5 flex items-center gap-3 rounded-2xl border border-white/[.07] p-4 text-sm text-zinc-300 transition hover:bg-white/[.04] hover:text-white"
                    >
                      <Mail size={18} className="text-cyan-300" />

                      <span className="min-w-0 truncate">{profile.email}</span>

                      <ArrowUpRight size={15} className="ml-auto shrink-0" />
                    </a>
                  )}

                  {profile.location && (
                    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/[.07] p-4 text-sm text-zinc-400">
                      <MapPin size={18} className="shrink-0 text-violet-300" />

                      {profile.location}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* SOCIAL */}
            <div className="glass rounded-3xl p-7">
              <p className="text-xs uppercase tracking-[.2em] text-zinc-500">
                Social
              </p>

              <div className="mt-5 grid gap-2">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/[.07] p-3 text-sm text-zinc-400 transition hover:bg-white/[.04] hover:text-white"
                  >
                    <Github size={17} />
                    GitHub
                    <ArrowUpRight size={14} className="ml-auto" />
                  </a>
                )}

                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/[.07] p-3 text-sm text-zinc-400 transition hover:bg-white/[.04] hover:text-white"
                  >
                    <Linkedin size={17} />
                    LinkedIn
                    <ArrowUpRight size={14} className="ml-auto" />
                  </a>
                )}

                {profile.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/[.07] p-3 text-sm text-zinc-400 transition hover:bg-white/[.04] hover:text-white"
                  >
                    <Instagram size={17} />
                    Instagram
                    <ArrowUpRight size={14} className="ml-auto" />
                  </a>
                )}
              </div>
            </div>
          </aside>

          {/* FORM */}
          <form onSubmit={submit} className="glass rounded-3xl p-6 sm:p-8">
            {status === "success" && (
              <div className="mb-5 flex items-center gap-2 rounded-2xl border border-lime-300/20 bg-lime-300/[.06] p-4 text-sm text-lime-200">
                <CheckCircle2 size={18} />
                Message sent successfully.
              </div>
            )}

            {status === "error" && (
              <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/[.06] p-4 text-sm text-red-200">
                Please check your fields and try again.
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
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
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-violet-400/60"
                  placeholder="Your name"
                />
              </label>

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
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-violet-400/60"
                  placeholder="you@example.com"
                />
              </label>
            </div>

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
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-violet-400/60"
                placeholder="Tell me a little about your idea..."
              />
            </label>

            <button
              disabled={status === "loading"}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
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
      </section>
    </main>
  );
}
