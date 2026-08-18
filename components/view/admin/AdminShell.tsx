"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import {
  BarChart3,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  UserRound,
  X,
} from "lucide-react";

import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: UserRound,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: BriefcaseBusiness,
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Code2,
  },
  {
    label: "Experience",
    href: "/admin/experience",
    icon: BarChart3,
  },
  {
    label: "Education",
    href: "/admin/education",
    icon: GraduationCap,
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: Mail,
  },
];

interface Profile {
  name: string;
  role: string;
  location: string;
  university: string;
  bio: string;
  about: string;
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
  formalPhoto: string;
  avatar: string;
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =========================================================
  // REALTIME PROFILE LISTENER
  // =========================================================

  useEffect(() => {
    const profileRef = doc(db, "profile", "main");

    const unsubscribe = onSnapshot(
      profileRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Profile;
          setProfile(data);
        } else {
          setProfile(null);
        }
        setLoadingProfile(false);
      },
      (error) => {
        console.error("Failed to load profile for admin shell:", error);
        setLoadingProfile(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#07070c] text-white">
      {/* ================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ================================================= */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.07] bg-[#08080d] lg:flex lg:flex-col">
        <div className="flex h-full flex-col p-4">
          {/* Brand */}
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-2xl px-3 py-3"
          >
            <div>
              <p className="text-sm font-semibold tracking-tight">
                zagar<span className="text-violet-400">.</span>
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                Admin
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="mt-8 flex-1 overflow-y-auto">
            <p className="px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Workspace
            </p>

            <nav className="mt-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;

                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-white/[0.08] text-white"
                        : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                    }`}
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.8}
                      className={active ? "text-violet-300" : "text-zinc-600"}
                    />

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom - Profile & Settings */}
          <div className="mt-auto space-y-2 border-t border-white/[0.07] pt-4">
            {/* Profile Card */}
            <Link
              href="/admin/profile"
              className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              {/* Avatar */}
              <div className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]">
                {loadingProfile ? (
                  <div className="absolute inset-0 animate-pulse bg-white/[0.05]" />
                ) : profile?.avatar ? (
                  <Image
                    key={profile.avatar}
                    src={profile.avatar}
                    alt={profile.name || "Profile"}
                    fill
                    sizes="40px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <UserRound size={18} className="text-zinc-600" />
                )}
              </div>

              {/* Profile Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-zinc-200">
                  {loadingProfile ? "Loading..." : profile?.name || "Your name"}
                </p>

                <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                  {loadingProfile ? "Profile" : profile?.role || "Your role"}
                </p>
              </div>
            </Link>

            {/* Settings */}
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Settings size={17} />
              Settings
            </Link>
          </div>
        </div>
      </aside>

      {/* ================================================= */}
      {/* MOBILE SIDEBAR OVERLAY */}
      {/* ================================================= */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Sidebar */}
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-white/[0.07] bg-[#08080d]">
            <div className="flex h-full flex-col p-4">
              {/* Brand & Close */}
              <div className="flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-semibold">zagar.</p>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                      Admin
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl p-2 text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex-1 overflow-y-auto">
                <p className="px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                  Workspace
                </p>

                <nav className="mt-3 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;

                    const active =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                          active
                            ? "bg-white/[0.08] text-white"
                            : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                        }`}
                      >
                        <Icon
                          size={17}
                          strokeWidth={1.8}
                          className={
                            active ? "text-violet-300" : "text-zinc-600"
                          }
                        />

                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom */}
              <div className="mt-auto space-y-2 border-t border-white/[0.07] pt-4">
                {/* Profile Card */}
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition hover:bg-white/[0.04]"
                >
                  <div className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]">
                    {loadingProfile ? (
                      <div className="absolute inset-0 animate-pulse bg-white/[0.05]" />
                    ) : profile?.avatar ? (
                      <Image
                        key={profile.avatar}
                        src={profile.avatar}
                        alt={profile.name || "Profile"}
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <UserRound size={18} className="text-zinc-600" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-zinc-200">
                      {loadingProfile
                        ? "Loading..."
                        : profile?.name || "Your name"}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                      {loadingProfile
                        ? "Profile"
                        : profile?.role || "Your role"}
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <Settings size={17} />
                  Settings
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ================================================= */}
      {/* MAIN AREA */}
      {/* ================================================= */}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-white/[0.06] bg-[#07070c]/85 backdrop-blur-xl lg:left-64">
          <div className="flex h-full items-center justify-between px-4 sm:px-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            {/* Right Side */}
            <div className="ml-auto flex items-center gap-3">
              {/* User Info */}
              <div className="hidden text-right sm:block">
                <p className="text-xs font-medium text-zinc-200">
                  {loadingProfile ? user?.email : profile?.name || user?.email}
                </p>

                <p className="text-[10px] text-zinc-600">
                  {loadingProfile
                    ? "Administrator"
                    : profile?.role || "Administrator"}
                </p>
              </div>

              {/* Avatar */}
              <Link
                href="/admin/profile"
                className="relative grid size-9 place-items-center overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] transition hover:border-violet-400/30 hover:bg-white/[0.06]"
              >
                {loadingProfile ? (
                  <div className="absolute inset-0 animate-pulse bg-white/[0.05]" />
                ) : profile?.avatar ? (
                  <Image
                    key={profile.avatar}
                    src={profile.avatar}
                    alt={profile.name || "Profile"}
                    fill
                    sizes="36px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <UserRound size={16} className="text-zinc-400" />
                )}
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="rounded-xl p-2 text-zinc-500 transition hover:bg-red-400/[0.06] hover:text-red-300"
                title="Logout"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="min-h-screen pt-16">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
