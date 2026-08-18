"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowUpRight,
  ChevronDown,
  Code2,
  ExternalLink,
  FolderKanban,
  Github,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { navigation } from "@/lib/navigation";
import { useProfile } from "@/hooks/useProfile";

// ===========================================================
// EXPLORE ITEMS
// ===========================================================

const exploreItems = [
  {
    title: "About me",
    description: "Journey, education & interests",
    href: "/about",
    icon: UserRound,
    iconClass: "text-cyan-300",
  },
  {
    title: "Tech stack",
    description: "Technologies behind my work",
    href: "/skills",
    icon: Layers3,
    iconClass: "text-lime-300",
  },
  {
    title: "Projects",
    description: "Selected work & experiments",
    href: "/projects",
    icon: FolderKanban,
    iconClass: "text-violet-300",
  },
  {
    title: "Contact",
    description: "Let's build something together",
    href: "/contact",
    icon: Mail,
    iconClass: "text-cyan-300",
  },
];

// ===========================================================
// COMPONENT
// ===========================================================

export default function Header() {
  const pathname = usePathname();
  const { profile } = useProfile();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const megaRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // SCROLL STATE
  // =========================================================

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 16);
        ticking = false;
      });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================================================
  // CLOSE MEGA MENU WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    if (!megaOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      const megaElement = megaRef.current;

      if (!megaElement) return;

      if (!megaElement.contains(target)) {
        setMegaOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [megaOpen]);

  // =========================================================
  // ESCAPE KEY
  // =========================================================

  useEffect(() => {
    const hasOpenMenu = megaOpen || mobileOpen;

    if (!hasOpenMenu) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      setMegaOpen(false);
      setMobileOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [megaOpen, mobileOpen]);

  // =========================================================
  // CLOSE MENUS AFTER ROUTE CHANGE
  // =========================================================

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // =========================================================
  // HELPERS
  // =========================================================

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenus = () => {
    setMegaOpen(false);
    setMobileOpen(false);
  };

  const toggleMegaMenu = () => {
    setMobileOpen(false);
    setMegaOpen((current) => !current);
  };

  const toggleMobileMenu = () => {
    setMegaOpen(false);
    setMobileOpen((current) => !current);
  };

  // =========================================================
  // PROFILE
  // =========================================================

  const firstName = profile.name
    ? profile.name.trim().split(/\s+/)[0].toLowerCase()
    : "zagar";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-300 ${
        scrolled ? "pt-3" : "pt-4"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={`relative rounded-2xl border transition-[background-color,border-color,box-shadow] duration-300 ${
            scrolled
              ? "border-white/[.12] bg-[#0a0a0f]/85 shadow-2xl shadow-black/30 backdrop-blur-2xl"
              : "border-white/[.07] bg-white/[.025] backdrop-blur-xl"
          }`}
        >
          {/* =================================================
              HEADER BAR
          ================================================= */}

          <div className="flex h-16 items-center justify-between px-3 sm:px-4">
            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              href="/"
              onClick={closeMenus}
              className="group flex items-center gap-2.5"
            >
              {profile.avatar ? (
                <span className="relative size-9 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={profile.avatar}
                    alt={`${profile.name || "Profile"} avatar`}
                    fill
                    sizes="36px"
                    priority
                    unoptimized
                    className="object-cover"
                  />
                </span>
              ) : (
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-black shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:rotate-3">
                  <Code2 size={19} strokeWidth={2.5} aria-hidden="true" />
                </span>
              )}

              <span className="font-semibold tracking-tight text-white">
                {firstName}
                <span className="text-violet-400">.</span>
              </span>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <nav
              className="hidden items-center gap-1 md:flex"
              aria-label="Main navigation"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-xl px-3.5 py-2 text-sm transition-colors duration-200 ${
                    isActive(item.href)
                      ? "bg-white/[.08] text-white"
                      : "text-zinc-400 hover:bg-white/[.05] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* =================================================
                  EXPLORE MEGA MENU
              ================================================= */}

              <div ref={megaRef} className="relative">
                <button
                  type="button"
                  onClick={toggleMegaMenu}
                  aria-expanded={megaOpen}
                  aria-haspopup="true"
                  aria-controls="desktop-explore-menu"
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm transition-colors duration-200 ${
                    megaOpen
                      ? "bg-white/[.08] text-white"
                      : "text-zinc-400 hover:bg-white/[.05] hover:text-white"
                  }`}
                >
                  <span>Explore</span>

                  <ChevronDown
                    size={15}
                    aria-hidden="true"
                    className={`transition-transform duration-300 ${
                      megaOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* =================================================
                    MEGA MENU

                    IMPORTANT:
                    Menu tetap mounted.
                    Tidak menggunakan AnimatePresence.
                ================================================= */}

                <div
                  id="desktop-explore-menu"
                  role="menu"
                  aria-hidden={!megaOpen}
                  className={`absolute right-0 top-[calc(100%+12px)] w-[min(720px,calc(100vw-32px))] origin-top overflow-hidden rounded-3xl border border-white/[.1] bg-[#0b0b11]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-2xl transition-[opacity,transform,visibility] duration-200 ${
                    megaOpen
                      ? "visible translate-y-0 scale-100 opacity-100 pointer-events-auto"
                      : "invisible -translate-y-2 scale-[.98] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="grid gap-2 md:grid-cols-[220px_1fr]">
                    {/* =================================================
                        INTRO
                    ================================================= */}

                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/20 via-violet-500/[.05] to-transparent p-6">
                      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-violet-500/10 blur-3xl" />

                      <div className="relative">
                        <div className="mb-6 grid size-10 place-items-center rounded-xl border border-violet-300/10 bg-violet-400/10 text-violet-300">
                          <Sparkles size={19} aria-hidden="true" />
                        </div>

                        <p className="text-sm font-semibold text-white">
                          Build. Learn. Create.
                        </p>

                        <p className="mt-2 text-xs leading-5 text-zinc-500">
                          Explore my journey, technologies, projects and ways to
                          work together.
                        </p>
                      </div>
                    </div>

                    {/* =================================================
                        EXPLORE ITEMS
                    ================================================= */}

                    <div className="grid gap-1">
                      {exploreItems.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            onClick={closeMenus}
                            className="group flex items-center gap-4 rounded-2xl p-4 transition-colors duration-200 hover:bg-white/[.06]"
                          >
                            <span
                              className={`grid size-10 shrink-0 place-items-center rounded-xl bg-white/[.04] ${item.iconClass}`}
                            >
                              <Icon size={18} aria-hidden="true" />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                                {item.title}

                                <ArrowUpRight
                                  size={14}
                                  aria-hidden="true"
                                  className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                                />
                              </span>

                              <span className="mt-1 block text-xs text-zinc-500">
                                {item.description}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* =================================================
                      SOCIAL
                  ================================================= */}

                  <div className="mt-2 flex items-center justify-between border-t border-white/[.07] px-4 py-3">
                    <span className="text-xs text-zinc-600">
                      Find me online
                    </span>

                    <div className="flex items-center gap-1">
                      {profile.github && (
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/[.06] hover:text-white"
                        >
                          <Github size={15} aria-hidden="true" />
                        </a>
                      )}

                      {profile.linkedin && (
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                          className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/[.06] hover:text-white"
                        >
                          <Linkedin size={15} aria-hidden="true" />
                        </a>
                      )}

                      <Link
                        href="/projects"
                        onClick={closeMenus}
                        className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[.06] hover:text-white"
                      >
                        View work
                        <ExternalLink size={13} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* =================================================
                DESKTOP CONTACT
            ================================================= */}

            <div className="hidden md:block">
              <Link
                href="/contact"
                onClick={closeMenus}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-100"
              >
                Let&apos;s talk
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="rounded-xl p-2 text-zinc-300 transition-colors hover:bg-white/[.06] hover:text-white md:hidden"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? (
                <X size={22} aria-hidden="true" />
              ) : (
                <Menu size={22} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* =====================================================
              MOBILE NAVIGATION

              Tetap mounted.
              Tidak menggunakan AnimatePresence.
          ===================================================== */}

          <div
            id="mobile-navigation"
            aria-hidden={!mobileOpen}
            className={`border-t border-white/[.07] transition-[max-height,opacity,visibility,padding] duration-200 md:hidden ${
              mobileOpen
                ? "visible max-h-[700px] p-3 opacity-100"
                : "invisible max-h-0 overflow-hidden border-transparent p-0 opacity-0"
            }`}
          >
            <nav aria-label="Mobile navigation">
              <div className="grid gap-1">
                {/* =================================================
                    MAIN NAV
                ================================================= */}

                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`rounded-xl px-4 py-3 text-sm transition-colors ${
                      isActive(item.href)
                        ? "bg-white/[.07] text-white"
                        : "text-zinc-400 hover:bg-white/[.05] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* =================================================
                    EXPLORE
                ================================================= */}

                <div className="mt-2 border-t border-white/[.06] pt-2">
                  <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-[.18em] text-zinc-600">
                    Explore
                  </p>

                  {exploreItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/[.05]"
                      >
                        <Icon
                          size={17}
                          className={item.iconClass}
                          aria-hidden="true"
                        />

                        <span className="flex-1">
                          <span className="block text-sm text-zinc-300">
                            {item.title}
                          </span>

                          <span className="mt-0.5 block text-[11px] text-zinc-600">
                            {item.description}
                          </span>
                        </span>

                        <ArrowUpRight
                          size={14}
                          className="text-zinc-700"
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  })}
                </div>

                {/* =================================================
                    MOBILE CONTACT
                ================================================= */}

                <Link
                  href="/contact"
                  onClick={closeMenus}
                  className="mt-2 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-violet-100"
                >
                  Let&apos;s talk
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
