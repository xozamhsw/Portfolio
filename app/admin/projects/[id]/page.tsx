import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import ProjectForm from "../ProjectForm";
import type { Project } from "@/types/project";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;

  const snapshot = await getDoc(doc(db, "projects", id));

  if (!snapshot.exists()) {
    notFound();
  }

  const data = snapshot.data();

  /**
   * Firestore Timestamp tidak boleh langsung
   * dikirim dari Server Component ke Client Component.
   *
   * Karena ProjectForm hanya membutuhkan data project,
   * kita ubah Timestamp menjadi primitive value.
   */

  const createdAt =
    data.createdAt && typeof data.createdAt.toMillis === "function"
      ? data.createdAt.toMillis()
      : null;

  const updatedAt =
    data.updatedAt && typeof data.updatedAt.toMillis === "function"
      ? data.updatedAt.toMillis()
      : null;

  const project: Project = {
    id: snapshot.id,

    title: typeof data.title === "string" ? data.title : "",

    slug: typeof data.slug === "string" ? data.slug : "",

    category: typeof data.category === "string" ? data.category : "",

    year: typeof data.year === "string" ? data.year : "",

    description: typeof data.description === "string" ? data.description : "",

    overview: typeof data.overview === "string" ? data.overview : "",

    highlights: Array.isArray(data.highlights)
      ? data.highlights.filter(
          (item): item is string => typeof item === "string",
        )
      : [],

    role: typeof data.role === "string" ? data.role : "",

    tags: Array.isArray(data.tags)
      ? data.tags.filter((item): item is string => typeof item === "string")
      : [],

    github: typeof data.github === "string" ? data.github : "",

    live: typeof data.live === "string" ? data.live : "",

    image: typeof data.image === "string" ? data.image : "",

    published: typeof data.published === "boolean" ? data.published : false,

    /**
     * Primitive number.
     * Tidak lagi mengirim Firebase Timestamp.
     */
    createdAt,

    updatedAt,
  };

  return <ProjectForm initialData={project} projectId={id} />;
}
