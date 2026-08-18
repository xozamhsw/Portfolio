"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

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

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const profileRef = doc(db, "profile", "main");

    const unsubscribe = onSnapshot(
      profileRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setProfile({
            ...defaultProfile,
            ...(snapshot.data() as Partial<Profile>),
          });
        } else {
          setProfile(defaultProfile);
        }

        setLoading(false);
        setError(null);
      },
      (snapshotError) => {
        console.error("Profile realtime error:", snapshotError);

        setError("Unable to load profile.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return {
    profile,
    loading,
    error,
  };
}
