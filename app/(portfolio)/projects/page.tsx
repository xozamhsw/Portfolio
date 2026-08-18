import type { Metadata } from "next";
import ProjectsPage from "@/components/pages/ProjectsPage";
export const metadata: Metadata = {
  title: "Projects — Zagar",
  description:
    "Selected web apps, experiments and creative projects by Muhamad Zagar Ainudin.",
};
export default function Page() {
  return <ProjectsPage />;
}
