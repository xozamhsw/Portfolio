"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  Check,
  Code2,
  Database,
  Loader2,
  Pencil,
  Plus,
  Palette,
  Save,
  Search,
  Server,
  Trash2,
  Wrench,
  X,
} from "lucide-react";

import { db } from "@/lib/firebase";

// ===========================================================
// TYPES
// ===========================================================

interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  createdAt?: unknown;
  updatedAt?: unknown;
}

type SkillCategory = "Frontend" | "Backend" | "Data" | "Creative" | "Tools";

// ===========================================================
// CATEGORY CONFIG
// ===========================================================

const categories = [
  {
    key: "Frontend" as const,
    name: "Frontend",
    description: "Interfaces, components and motion",
    icon: Code2,
    iconClass: "text-cyan-300",
    bgClass: "bg-cyan-400/10",
  },
  {
    key: "Backend" as const,
    name: "Backend",
    description: "APIs and application logic",
    icon: Server,
    iconClass: "text-violet-300",
    bgClass: "bg-violet-400/10",
  },
  {
    key: "Data" as const,
    name: "Data & Cloud",
    description: "Storage, media and infrastructure",
    icon: Database,
    iconClass: "text-lime-200",
    bgClass: "bg-lime-400/10",
  },
  {
    key: "Creative" as const,
    name: "Design",
    description: "Visual thinking and product interfaces",
    icon: Palette,
    iconClass: "text-pink-300",
    bgClass: "bg-pink-400/10",
  },
  {
    key: "Tools" as const,
    name: "Tools",
    description: "Workflow, version control and delivery",
    icon: Wrench,
    iconClass: "text-amber-200",
    bgClass: "bg-amber-400/10",
  },
];

// ===========================================================
// COMPONENT
// ===========================================================

export default function SkillsManager() {
  // =========================================================
  // STATE
  // =========================================================

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<{
    name: string;
    category: SkillCategory;
  }>({
    name: "",
    category: "Frontend",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // LOAD SKILLS
  // =========================================================

  useEffect(() => {
    const skillsRef = collection(db, "skills");

    const skillsQuery = query(skillsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      skillsQuery,
      (snapshot) => {
        const data: Skill[] = snapshot.docs.map((snapshotDoc) => {
          const skill = snapshotDoc.data();

          const category = categories.some(
            (item) => item.key === skill.category,
          )
            ? skill.category
            : "Frontend";

          return {
            id: snapshotDoc.id,
            name: skill.name ?? "",
            category,
            createdAt: skill.createdAt,
            updatedAt: skill.updatedAt,
          };
        });

        setSkills(data);
        setLoading(false);
      },
      (snapshotError) => {
        console.error("Failed to load skills:", snapshotError);

        setError(
          "Failed to load skills. Please check your Firebase permissions.",
        );

        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // =========================================================
  // FILTERED SKILLS
  // =========================================================

  const filteredSkills = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return skills;
    }

    return skills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(keyword) ||
        skill.category.toLowerCase().includes(keyword),
    );
  }, [skills, search]);

  // =========================================================
  // GROUP SKILLS
  // =========================================================

  const skillsByCategory = useMemo(() => {
    return categories.reduce(
      (result, category) => {
        result[category.key] = filteredSkills.filter(
          (skill) => skill.category === category.key,
        );

        return result;
      },
      {} as Record<SkillCategory, Skill[]>,
    );
  }, [filteredSkills]);

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      category: "Frontend",
    });

    setError("");
  };

  // =========================================================
  // EDIT SKILL
  // =========================================================

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);

    setForm({
      name: skill.name,
      category: skill.category,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();

    if (!name) {
      setError("Skill name is required.");
      return;
    }

    if (name.length > 50) {
      setError("Skill name must be 50 characters or less.");
      return;
    }

    try {
      setSaving(true);

      // =====================================================
      // UPDATE
      // =====================================================

      if (editingId) {
        const skillRef = doc(db, "skills", editingId);

        await updateDoc(skillRef, {
          name,
          category: form.category,
          updatedAt: serverTimestamp(),
        });

        setSuccess("Skill updated successfully.");
      }

      // =====================================================
      // CREATE
      // =====================================================
      else {
        await addDoc(collection(db, "skills"), {
          name,
          category: form.category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setSuccess("Skill added successfully.");
      }

      resetForm();
    } catch (submitError) {
      console.error("Failed to save skill:", submitError);

      setError(
        "Failed to save skill. Please check your permissions and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (skill: Skill) => {
    const confirmed = window.confirm(
      `Delete "${skill.name}" from your skills?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(skill.id);
      setError("");
      setSuccess("");

      await deleteDoc(doc(db, "skills", skill.id));

      if (editingId === skill.id) {
        resetForm();
      }

      setSuccess(`"${skill.name}" deleted successfully.`);
    } catch (deleteError) {
      console.error("Failed to delete skill:", deleteError);

      setError(
        "Failed to delete skill. Please check your permissions and try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="space-y-8">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[.2em] text-violet-400">
              Portfolio / Skills
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Manage skills
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Add, edit and organize the technologies and tools displayed on
              your public skills page.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/[.08] bg-white/[.025] px-4 py-3">
            <Code2 size={17} className="text-cyan-300" aria-hidden="true" />

            <div>
              <p className="text-xs text-zinc-500">Total skills</p>

              <p className="text-sm font-semibold text-white">
                {skills.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ALERTS
      ===================================================== */}

      {(error || success) && (
        <div
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            error
              ? "border-red-400/10 bg-red-400/[.05] text-red-300"
              : "border-emerald-400/10 bg-emerald-400/[.05] text-emerald-300"
          }`}
        >
          <span className="mt-0.5">{error ? "!" : <Check size={16} />}</span>

          <p className="flex-1">{error || success}</p>

          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");
            }}
            className="rounded-lg p-1 text-current opacity-60 transition hover:bg-white/[.05] hover:opacity-100"
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* =====================================================
          CREATE / EDIT FORM
      ===================================================== */}

      <section className="rounded-3xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[.18em] text-zinc-600">
              {editingId ? "Edit skill" : "New skill"}
            </p>

            <h2 className="mt-2 text-lg font-semibold text-white">
              {editingId ? "Update your skill" : "Add a new skill"}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              This information will be displayed on the public skills page.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[.08] bg-white/[.03] px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/[.06] hover:text-white"
            >
              <X size={14} />
              Cancel
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 lg:grid-cols-[1fr_220px_auto]"
        >
          {/* SKILL NAME */}

          <div>
            <label
              htmlFor="skill-name"
              className="mb-2 block text-xs font-medium text-zinc-400"
            >
              Skill name
            </label>

            <input
              id="skill-name"
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="e.g. Next.js"
              maxLength={50}
              disabled={saving}
              className="h-11 w-full rounded-xl border border-white/[.08] bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/40 focus:bg-black/30 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label
              htmlFor="skill-category"
              className="mb-2 block text-xs font-medium text-zinc-400"
            >
              Category
            </label>

            <select
              id="skill-category"
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  category: event.target.value as SkillCategory,
                }))
              }
              disabled={saving}
              className="h-11 w-full appearance-none rounded-xl border border-white/[.08] bg-[#0b0b11] px-4 text-sm text-white outline-none transition focus:border-violet-400/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {categories.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* SUBMIT */}

          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                <>
                  <Save size={16} />
                  Update skill
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add skill
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Your skills</h2>

          <p className="mt-1 text-sm text-zinc-600">
            {filteredSkills.length}{" "}
            {filteredSkills.length === 1 ? "skill" : "skills"} shown
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
            aria-hidden="true"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search skills..."
            className="h-10 w-full rounded-xl border border-white/[.08] bg-white/[.025] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/40"
          />
        </div>
      </section>

      {/* =====================================================
          SKILL LIST
      ===================================================== */}

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-3xl border border-white/[.08] bg-white/[.025]"
            />
          ))}
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/[.1] bg-white/[.015] px-6 py-16 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/[.04] text-zinc-600">
            <Code2 size={21} />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-zinc-300">
            {search ? "No skills found" : "No skills yet"}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
            {search
              ? "Try another search keyword."
              : "Add your first skill using the form above."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const list = skillsByCategory[category.key] ?? [];

            if (list.length === 0) {
              return null;
            }

            return (
              <section
                key={category.key}
                className="overflow-hidden rounded-3xl border border-white/[.08] bg-white/[.025]"
              >
                {/* CATEGORY HEADER */}

                <div className="flex items-center justify-between border-b border-white/[.07] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid size-9 place-items-center rounded-xl ${category.bgClass}`}
                    >
                      <Icon
                        size={17}
                        className={category.iconClass}
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {category.name}
                      </h3>

                      <p className="text-xs text-zinc-600">
                        {list.length} {list.length === 1 ? "skill" : "skills"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* SKILLS */}

                <div className="divide-y divide-white/[.05]">
                  {list.map((skill) => (
                    <div
                      key={skill.id}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[.025]"
                    >
                      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-black/20 text-xs font-semibold text-zinc-500">
                        {skill.name.slice(0, 1).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-200">
                          {skill.name}
                        </p>

                        <p className="mt-0.5 text-xs text-zinc-700">
                          {skill.category}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() => handleEdit(skill)}
                          disabled={deletingId === skill.id}
                          className="grid size-9 place-items-center rounded-xl text-zinc-500 transition hover:bg-white/[.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Edit ${skill.name}`}
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() => handleDelete(skill)}
                          disabled={deletingId === skill.id}
                          className="grid size-9 place-items-center rounded-xl text-zinc-500 transition hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Delete ${skill.name}`}
                        >
                          {deletingId === skill.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
