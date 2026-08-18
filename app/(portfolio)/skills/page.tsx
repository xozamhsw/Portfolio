import type { Metadata } from "next";
import SkillsPage from "@/components/pages/SkillsPage";
export const metadata: Metadata = { title: "Tech Stack — Zagar", description: "Technologies, tools and platforms used across Zagar's projects." };
export default function Page() { return <SkillsPage />; }
