import type { Metadata } from "next";

import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import ProfileFavicon from "@/components/seo/ProfileFavicon";

// ===========================================================
// METADATA
// ===========================================================

export const metadata: Metadata = {
  title: "Zagar — Portfolio",
  description: "Portfolio of Zagar.",
};

// ===========================================================
// ROOT LAYOUT
// ===========================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* =================================================
              DYNAMIC PROFILE FAVICON

              Favicon diambil dari:
              useProfile()
                ↓
              profile.avatar
                ↓
              Cloudinary transformation
                ↓
              browser favicon
          ================================================= */}

          <ProfileFavicon />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
