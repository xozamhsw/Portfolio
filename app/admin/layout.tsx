"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import AdminShell from "@/components/view/admin/AdminShell";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isAdmin, loading } = useAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (!isLoginPage) {
        router.replace("/admin/login");
      }
      return;
    }

    if (!isAdmin) {
      if (!isLoginPage) {
        router.replace("/admin/login");
      }
    }
  }, [user, isAdmin, loading, isLoginPage, router]);

  /*
   * Login page tidak menggunakan AdminShell.
   */
  if (isLoginPage) {
    return <>{children}</>;
  }

  /*
   * Initial authentication loading.
   */
  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#07070c] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative grid size-11 place-items-center">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />

            <span className="size-2 rounded-full bg-violet-400" />
          </div>

          <p className="text-xs text-zinc-500">Checking authentication...</p>
        </div>
      </main>
    );
  }

  /*
   * Prevent protected content from flashing
   * before redirect.
   */
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#07070c]">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
