"use client";

import { useEffect } from "react";

import { useProfile } from "@/hooks/useProfile";

// ===========================================================
// CONSTANTS
// ===========================================================

const FAVICON_ID = "dynamic-profile-favicon";

// ===========================================================
// CLOUDINARY FAVICON TRANSFORM
// ===========================================================

function getFaviconUrl(avatarUrl: string) {
  const url = avatarUrl.trim();

  if (!url) {
    return "";
  }

  // =========================================================
  // NON-CLOUDINARY
  // =========================================================
  //
  // Kalau avatar bukan Cloudinary, gunakan URL aslinya.
  //

  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  // =========================================================
  // PREVENT DOUBLE TRANSFORM
  // =========================================================

  if (url.includes("w_64,h_64,c_fill")) {
    return url;
  }

  // =========================================================
  // CLOUDINARY TRANSFORM
  // =========================================================

  return url.replace(
    "/upload/",
    "/upload/w_64,h_64,c_fill,g_auto,q_auto,f_auto/",
  );
}

// ===========================================================
// UPDATE FAVICON
// ===========================================================

function updateFavicon(href: string) {
  if (typeof document === "undefined") {
    return;
  }

  if (!href) {
    return;
  }

  // =========================================================
  // FIND EXISTING FAVICON
  // =========================================================

  let favicon = document.getElementById(FAVICON_ID) as HTMLLinkElement | null;

  // =========================================================
  // CREATE FAVICON
  // =========================================================

  if (!favicon) {
    favicon = document.createElement("link");

    favicon.id = FAVICON_ID;
    favicon.rel = "icon";
    favicon.type = "image/png";

    document.head.appendChild(favicon);
  }

  // =========================================================
  // UPDATE HREF
  // =========================================================

  if (favicon.href !== href) {
    favicon.href = href;
  }
}

// ===========================================================
// PROFILE FAVICON
// ===========================================================

export default function ProfileFavicon() {
  const { profile } = useProfile();

  useEffect(() => {
    // =======================================================
    // GET AVATAR FROM SAME PROFILE SOURCE AS HEADER
    // =======================================================

    const avatar =
      typeof profile.avatar === "string" ? profile.avatar.trim() : "";

    // =======================================================
    // PROFILE NOT READY
    // =======================================================
    //
    // Jangan mengganti favicon ke /favicon.ico.
    //
    // Ini penting karena useProfile() mungkin belum selesai
    // mengambil data dari Firestore.
    //
    // Kita cukup menunggu sampai avatar tersedia.
    //

    if (!avatar) {
      return;
    }

    // =======================================================
    // CREATE FAVICON URL
    // =======================================================

    const faviconUrl = getFaviconUrl(avatar);

    if (!faviconUrl) {
      return;
    }

    // =======================================================
    // UPDATE BROWSER FAVICON
    // =======================================================

    updateFavicon(faviconUrl);
  }, [profile.avatar]);

  return null;
}
