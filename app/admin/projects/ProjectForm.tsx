"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, Loader2, Save } from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { Project } from "@/types/project";

// ===========================================================
// DEFAULT PROJECT
// ===========================================================

const emptyProject: Project = {
  title: "",
  slug: "",
  category: "",
  year: "",
  description: "",
  overview: "",
  highlights: [],
  role: "",
  tags: [],
  github: "",
  live: "",
  image: "",
  published: false,
  createdAt: null,
  updatedAt: null,
};

// ===========================================================
// TYPES
// ===========================================================

type ProjectFormProps = {
  initialData?: Project;
  projectId?: string;
};

// ===========================================================
// COMPONENT
// ===========================================================

export default function ProjectForm({
  initialData,
  projectId,
}: ProjectFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<Project>({
    ...emptyProject,
    ...initialData,

    highlights: Array.isArray(initialData?.highlights)
      ? initialData.highlights
      : [],

    tags: Array.isArray(initialData?.tags) ? initialData.tags : [],

    published:
      typeof initialData?.published === "boolean"
        ? initialData.published
        : false,
  });

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // UPDATE FIELD
  // =========================================================

  function updateField<K extends keyof Project>(field: K, value: Project[K]) {
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
  // SLUGIFY
  // =========================================================

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // =========================================================
  // TITLE
  // =========================================================

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,

      title: value,

      /**
       * Ketika membuat project baru,
       * slug otomatis mengikuti title.
       *
       * Ketika edit project,
       * slug existing tidak diubah otomatis.
       */
      slug: !projectId || !current.slug ? slugify(value) : current.slug,
    }));

    setStatus("idle");
    setErrorMessage("");
  }

  // =========================================================
  // PARSERS
  // =========================================================

  function parseTags(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function parseHighlights(value: string) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function tagsToString(tags: string[]) {
    return tags.join(", ");
  }

  function highlightsToString(highlights: string[]) {
    return highlights.join("\n");
  }

  // =========================================================
  // IMAGE UPLOAD
  // =========================================================

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    // -------------------------------------------------------
    // VALIDATE TYPE
    // -------------------------------------------------------

    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setErrorMessage("Please select a valid image.");

      event.target.value = "";

      return;
    }

    // -------------------------------------------------------
    // VALIDATE SIZE
    // -------------------------------------------------------

    if (file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setErrorMessage("Image size must be less than 5MB.");

      event.target.value = "";

      return;
    }

    setUploading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      formData.append("folder", "portfolio/projects");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed.");
      }

      if (!result.url || typeof result.url !== "string") {
        throw new Error("Upload succeeded but image URL was not returned.");
      }

      updateField("image", result.url);
    } catch (error) {
      console.error("Project image upload error:", error);

      setStatus("error");

      setErrorMessage(
        error instanceof Error ? error.message : "Failed to upload image.",
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  }

  // =========================================================
  // SAVE PROJECT
  // =========================================================

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    const title = form.title.trim();
    const slug = slugify(form.slug);
    const description = form.description.trim();
    const image = form.image.trim();

    if (!title) {
      setStatus("error");
      setErrorMessage("Project title is required.");

      return;
    }

    if (!slug) {
      setStatus("error");
      setErrorMessage("Project slug is required.");

      return;
    }

    if (!description) {
      setStatus("error");
      setErrorMessage("Project description is required.");

      return;
    }

    if (!image) {
      setStatus("error");
      setErrorMessage("Project image is required.");

      return;
    }

    // -------------------------------------------------------
    // SAVE STATE
    // -------------------------------------------------------

    setSaving(true);

    setStatus("idle");
    setErrorMessage("");

    try {
      // -----------------------------------------------------
      // CHECK DUPLICATE SLUG
      // -----------------------------------------------------

      const slugQuery = query(
        collection(db, "projects"),
        where("slug", "==", slug),
      );

      const slugSnapshot = await getDocs(slugQuery);

      const duplicate = slugSnapshot.docs.some((item) => item.id !== projectId);

      if (duplicate) {
        throw new Error("This slug is already used by another project.");
      }

      // -----------------------------------------------------
      // PROJECT DATA
      // -----------------------------------------------------

      const projectData = {
        title,

        slug,

        category: form.category.trim(),

        year: form.year.trim(),

        description,

        overview: form.overview.trim(),

        highlights: form.highlights.map((item) => item.trim()).filter(Boolean),

        role: form.role.trim(),

        tags: form.tags.map((item) => item.trim()).filter(Boolean),

        github: form.github.trim(),

        live: form.live.trim(),

        image,

        published: Boolean(form.published),

        updatedAt: serverTimestamp(),
      };

      // -----------------------------------------------------
      // CREATE
      // -----------------------------------------------------

      if (!projectId) {
        await addDoc(collection(db, "projects"), {
          ...projectData,

          createdAt: serverTimestamp(),
        });

        setStatus("success");

        setForm({
          ...emptyProject,
        });

        /**
         * Beri sedikit waktu agar user melihat
         * status berhasil sebelum kembali.
         */
        setTimeout(() => {
          router.push("/admin/projects");
          router.refresh();
        }, 700);

        return;
      }

      // -----------------------------------------------------
      // UPDATE
      // -----------------------------------------------------

      await setDoc(doc(db, "projects", projectId), projectData, {
        merge: true,
      });

      setStatus("success");

      setTimeout(() => {
        router.push("/admin/projects");
        router.refresh();
      }, 700);
    } catch (error) {
      console.error("Failed to save project:", error);

      setStatus("error");

      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save project.",
      );
    } finally {
      setSaving(false);
    }
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
                Admin / Projects
              </p>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {projectId ? "Edit project" : "New project"}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              {projectId
                ? "Update project information displayed on your portfolio."
                : "Create a new project for your portfolio."}
            </p>
          </div>

          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to projects
          </Link>
        </div>
      </header>

      {/* =====================================================
          STATUS
      ===================================================== */}

      {status === "success" && (
        <div className="rounded-2xl border border-lime-300/15 bg-lime-300/[0.04] px-4 py-3 text-sm text-lime-200">
          Project saved successfully.
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

      <form onSubmit={saveProject} className="space-y-6">
        {/* ===================================================
            BASIC INFORMATION
        =================================================== */}

        <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-7">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              Basic information
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Main information about this project.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Project title"
              value={form.title}
              placeholder="Portfolio Website"
              onChange={handleTitleChange}
            />

            <Field
              label="Slug"
              value={form.slug}
              placeholder="portfolio-website"
              onChange={(value) => updateField("slug", slugify(value))}
            />

            <Field
              label="Category"
              value={form.category}
              placeholder="Web Development"
              onChange={(value) => updateField("category", value)}
            />

            <Field
              label="Year"
              value={form.year}
              placeholder="2026"
              onChange={(value) => updateField("year", value)}
            />

            <Field
              label="Role"
              value={form.role}
              placeholder="Full Stack Developer"
              onChange={(value) => updateField("role", value)}
            />

            <div className="sm:col-span-2">
              <Field
                label="Short description"
                value={form.description}
                placeholder="A short description of the project..."
                onChange={(value) => updateField("description", value)}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            PROJECT IMAGE
        =================================================== */}

        <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-7">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              Project media
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Main project image uploaded through Cloudinary.
            </p>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              {form.image ? (
                <Image
                  src={form.image}
                  alt={form.title || "Project preview"}
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-cover"
                  priority={Boolean(projectId)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-700">
                  <ImageIcon size={28} />
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-300">
                Main project image
              </p>

              <p className="mt-1 max-w-md text-xs leading-5 text-zinc-600">
                JPG, PNG or WebP. Maximum file size is 5MB.
              </p>

              <label className="mt-4 inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white">
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageIcon size={14} />
                    Upload image
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading || saving}
                  onChange={uploadImage}
                />
              </label>
            </div>
          </div>
        </section>

        {/* ===================================================
            PROJECT CONTENT
        =================================================== */}

        <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-7">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              Project content
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Detailed information shown on the project page.
            </p>
          </div>

          <div className="space-y-5">
            <TextArea
              label="Overview"
              value={form.overview}
              placeholder="Describe the project in more detail..."
              rows={8}
              onChange={(value) => updateField("overview", value)}
            />

            <TextArea
              label="Highlights"
              value={highlightsToString(form.highlights)}
              placeholder={`Authentication system
Responsive dashboard
Cloudinary image upload
Firebase integration`}
              rows={7}
              onChange={(value) =>
                updateField("highlights", parseHighlights(value))
              }
            />

            <TextArea
              label="Technology stack"
              value={tagsToString(form.tags)}
              placeholder="Next.js, TypeScript, Tailwind CSS, Firebase"
              rows={3}
              onChange={(value) => updateField("tags", parseTags(value))}
            />
          </div>
        </section>

        {/* ===================================================
            LINKS
        =================================================== */}

        <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-7">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              Project links
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Optional links for source code and live project.
            </p>
          </div>

          <div className="space-y-4">
            <Field
              label="GitHub URL"
              type="url"
              value={form.github}
              placeholder="https://github.com/username/project"
              onChange={(value) => updateField("github", value)}
            />

            <Field
              label="Live project URL"
              type="url"
              value={form.live}
              placeholder="https://example.com"
              onChange={(value) => updateField("live", value)}
            />
          </div>
        </section>

        {/* ===================================================
            PUBLISH
        =================================================== */}

        <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-zinc-300">Published</p>

              <p className="mt-1 text-xs text-zinc-600">
                Published projects are visible on the public portfolio.
              </p>
            </div>

            <button
              type="button"
              aria-pressed={form.published}
              onClick={() => updateField("published", !form.published)}
              className={`relative h-6 w-11 rounded-full transition ${
                form.published ? "bg-violet-500" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-1 size-4 rounded-full bg-white transition ${
                  form.published ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* ===================================================
            SAVE
        =================================================== */}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploading}
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
                Save project
              </>
            )}
          </button>
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
