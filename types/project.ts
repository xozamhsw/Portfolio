import type { Timestamp } from "firebase/firestore";

export interface Project {
  id?: string;

  title: string;
  slug: string;

  category: string;
  year: string;

  description: string;
  overview: string;

  highlights: string[];

  role: string;
  tags: string[];

  github: string;
  live: string;

  image: string;

  published: boolean;

  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}
