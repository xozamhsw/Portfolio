"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ImageIcon,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Save,
  UserRound,
} from "lucide-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { Profile } from "@/types/profile";

// ===========================================================
// DEFAULT PROFILE
// ===========================================================

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

// ===========================================================
// ADMIN PROFILE
// ===========================================================

export default function AdminProfile() {
  const [form, setForm] = useState<Profile>(defaultProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState<"avatar" | "formalPhoto" | null>(
    null,
  );

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileRef = doc(db, "profile", "main");

        const snapshot = await getDoc(profileRef);

        if (snapshot.exists()) {
          const data = snapshot.data();

          setForm({
            ...defaultProfile,
            ...data,
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);

        setStatus("error");
        setErrorMessage("Unable to load profile data.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // =========================================================
  // INPUT HANDLER
  // =========================================================

  function updateField(field: keyof Profile, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
      setErrorMessage("");
    }
  }

  // =========================================================
  // IMAGE UPLOAD
  // =========================================================

  async function uploadImage(
    event: ChangeEvent<HTMLInputElement>,
    field: "avatar" | "formalPhoto",
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    // -------------------------------------------------------
    // VALIDATE FILE TYPE
    // -------------------------------------------------------

    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setErrorMessage("Please select a valid image.");
      event.target.value = "";
      return;
    }

    // -------------------------------------------------------
    // VALIDATE FILE SIZE
    // -------------------------------------------------------

    if (file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setErrorMessage("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    setUploading(field);
    setStatus("idle");
    setErrorMessage("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", "portfolio/profile");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed.");
      }

      if (!result.url) {
        throw new Error("Upload succeeded but no image URL was returned.");
      }

      updateField(field, result.url);
    } catch (error) {
      console.error("Image upload error:", error);

      setStatus("error");

      setErrorMessage(
        error instanceof Error ? error.message : "Failed to upload image.",
      );
    } finally {
      setUploading(null);
      event.target.value = "";
    }
  }

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const profileRef = doc(db, "profile", "main");

      await setDoc(
        profileRef,
        {
          ...form,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        },
      );

      setStatus("success");
    } catch (error) {
      console.error("Failed to save profile:", error);

      setStatus("error");

      setErrorMessage(
        "Failed to save profile. Check your Firebase permissions.",
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <section className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={22} className="animate-spin text-violet-300" />

          <p className="text-xs text-zinc-600">Loading profile...</p>
        </div>
      </section>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <section className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-6 bg-violet-400" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-300 sm:text-xs">
                Admin / Profile
              </p>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Profile
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Manage the personal information displayed throughout your
              portfolio.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <span className="size-1.5 rounded-full bg-lime-300" />
            Connected to Firestore
          </div>
        </div>
      </header>

      {/* =====================================================
          STATUS
      ===================================================== */}

      {status === "success" && (
        <div className="flex items-center gap-3 rounded-2xl border border-lime-300/15 bg-lime-300/[0.04] px-4 py-3 text-sm text-lime-200">
          <CheckCircle2 size={17} />
          Profile updated successfully.
        </div>
      )}

      {status === "error" && (
        <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.04] px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      {/* =====================================================
          FORM
      ===================================================== */}

      <form onSubmit={saveProfile}>
        <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <aside className="space-y-6">
            {/* =================================================
                PROFILE PREVIEW
            ================================================= */}

            <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02]">
              <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.03]">
                {form.formalPhoto ? (
                  <Image
                    src={form.formalPhoto}
                    alt={form.name || "Profile"}
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 420px"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-700">
                    <ImageIcon size={32} />

                    <p className="mt-3 text-xs">No profile image</p>
                  </div>
                )}

                {/* Overlay */}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 pt-16">
                  <p className="text-sm font-semibold text-white">
                    {form.name || "Your name"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    {form.role || "Your role"}
                  </p>
                </div>
              </div>

              {/* Profile metadata */}

              <div className="space-y-3 p-5">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <MapPin size={14} className="text-cyan-300" />

                  <span>{form.location || "Location"}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Mail size={14} className="text-violet-300" />

                  <span className="truncate">{form.email || "Email"}</span>
                </div>
              </div>
            </div>

            {/* =================================================
                AVATAR
            ================================================= */}

            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-xs font-medium text-zinc-300">Avatar</p>

              <p className="mt-1 text-[11px] leading-5 text-zinc-600">
                Used for compact profile representations.
              </p>

              <div className="mt-5 flex items-center gap-4">
                {/* Avatar preview */}

                <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                  {form.avatar ? (
                    <Image
                      src={form.avatar}
                      alt={form.name || "Avatar"}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <UserRound size={22} className="text-zinc-600" />
                  )}
                </div>

                {/* Upload */}

                <label className="cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.07] hover:text-white">
                  {uploading === "avatar" ? "Uploading..." : "Change avatar"}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading !== null}
                    onChange={(event) => uploadImage(event, "avatar")}
                  />
                </label>
              </div>
            </div>
          </aside>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="space-y-6">
            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                  Basic information
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  The main identity information displayed across your website.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  value={form.name}
                  placeholder="Muhamad Zagar Ainudin"
                  onChange={(value) => updateField("name", value)}
                />

                <Field
                  label="Role"
                  value={form.role}
                  placeholder="Informatics Engineering Student"
                  onChange={(value) => updateField("role", value)}
                />

                <Field
                  label="Location"
                  value={form.location}
                  placeholder="Surakarta, Indonesia"
                  onChange={(value) => updateField("location", value)}
                />

                <Field
                  label="University"
                  value={form.university}
                  placeholder="Universitas Duta Bangsa"
                  onChange={(value) => updateField("university", value)}
                />

                <div className="sm:col-span-2">
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    placeholder="hello@example.com"
                    onChange={(value) => updateField("email", value)}
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                PROFILE MEDIA
            ================================================= */}

            <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                  Profile media
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Upload your main profile photo through Cloudinary.
                </p>
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* Image preview */}

                <div className="relative grid size-28 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                  {form.formalPhoto ? (
                    <Image
                      src={form.formalPhoto}
                      alt={form.name || "Formal profile"}
                      fill
                      sizes="112px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <ImageIcon size={24} className="text-zinc-600" />
                  )}
                </div>

                {/* Upload information */}

                <div>
                  <p className="text-sm font-medium text-zinc-300">
                    Main profile photo
                  </p>

                  <p className="mt-1 max-w-md text-xs leading-5 text-zinc-600">
                    Recommended image format: JPG, PNG or WebP. Maximum file
                    size is 5MB.
                  </p>

                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white">
                    {uploading === "formalPhoto" ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ImageIcon size={14} />
                        Upload photo
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading !== null}
                      onChange={(event) => uploadImage(event, "formalPhoto")}
                    />
                  </label>
                </div>
              </div>
            </section>

            {/* =================================================
                ABOUT
            ================================================= */}

            <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                  About
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Short and detailed descriptions about you.
                </p>
              </div>

              <div className="space-y-4">
                <TextArea
                  label="Short bio"
                  value={form.bio}
                  placeholder="A short introduction that appears on your portfolio..."
                  rows={4}
                  onChange={(value) => updateField("bio", value)}
                />

                <TextArea
                  label="About me"
                  value={form.about}
                  placeholder="Write a more detailed story about yourself..."
                  rows={8}
                  onChange={(value) => updateField("about", value)}
                />
              </div>
            </section>

            {/* =================================================
                SOCIAL LINKS
            ================================================= */}

            <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                  Social links
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Links displayed throughout your portfolio.
                </p>
              </div>

              <div className="space-y-4">
                <SocialField
                  label="GitHub"
                  value={form.github}
                  placeholder="https://github.com/username"
                  onChange={(value) => updateField("github", value)}
                />

                <SocialField
                  label="LinkedIn"
                  value={form.linkedin}
                  placeholder="https://linkedin.com/in/username"
                  icon={<Linkedin size={16} />}
                  onChange={(value) => updateField("linkedin", value)}
                />

                <SocialField
                  label="Instagram"
                  value={form.instagram}
                  placeholder="https://instagram.com/username"
                  icon={<Instagram size={16} />}
                  onChange={(value) => updateField("instagram", value)}
                />
              </div>
            </section>

            {/* =================================================
                SAVE
            ================================================= */}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || uploading !== null}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

// ===========================================================
// FIELD
// ===========================================================

function Field({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs text-zinc-500">{label}</span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-violet-400/40 focus:bg-white/[0.025]"
      />
    </label>
  );
}

// ===========================================================
// TEXT AREA
// ===========================================================

function TextArea({
  label,
  value,
  placeholder,
  rows,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  rows: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs text-zinc-500">{label}</span>

      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-y rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 transition focus:border-violet-400/40 focus:bg-white/[0.025]"
      />
    </label>
  );
}

// ===========================================================
// SOCIAL FIELD
// ===========================================================

function SocialField({
  label,
  value,
  placeholder,
  icon,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  icon?: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs text-zinc-500">{label}</span>

      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
          {icon ?? <UserRound size={16} />}
        </span>

        <input
          type="url"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-white/[0.08] bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-violet-400/40 focus:bg-white/[0.025]"
        />
      </div>
    </label>
  );
}
