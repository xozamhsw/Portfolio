"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Filter,
  Mail,
  MessageSquare,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp | null;
  status: "read" | "unread";
}

type FilterType = "all" | "unread";

const MESSAGES_PER_PAGE = 5;

export default function ContactMonitoring() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // =========================================================
  // FIREBASE REALTIME LISTENER
  // =========================================================

  useEffect(() => {
    const contactsQuery = query(
      collection(db, "contacts"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      contactsQuery,
      (snapshot) => {
        const data: ContactMessage[] = snapshot.docs.map((item) => {
          const value = item.data();

          return {
            id: item.id,
            name: value.name ?? "Unknown",
            email: value.email ?? "",
            message: value.message ?? "",
            createdAt: value.createdAt ?? null,
            status: value.status === "read" ? "read" : "unread",
          };
        });

        setMessages(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to contacts:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // =========================================================
  // ACTIONS
  // =========================================================

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "contacts", id), {
        status: "read",
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      await updateDoc(doc(db, "contacts", id), {
        status: "unread",
      });
    } catch (error) {
      console.error("Error marking message as unread:", error);
    }
  };

  const deleteMessage = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?",
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "contacts", id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // =========================================================
  // FILTER + SEARCH
  // =========================================================

  const filteredMessages = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesFilter = filter === "all" || message.status === "unread";

      if (!keyword) return matchesFilter;

      const matchesSearch =
        message.name.toLowerCase().includes(keyword) ||
        message.email.toLowerCase().includes(keyword) ||
        message.message.toLowerCase().includes(keyword);

      return matchesFilter && matchesSearch;
    });
  }, [messages, filter, searchTerm]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMessages.length / MESSAGES_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * MESSAGES_PER_PAGE;
  const endIndex = startIndex + MESSAGES_PER_PAGE;

  const currentMessages = filteredMessages.slice(startIndex, endIndex);

  const unreadCount = messages.filter(
    (message) => message.status === "unread",
  ).length;

  const readCount = messages.length - unreadCount;

  const changeFilter = (value: FilterType) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const changeSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "Unknown date";

    try {
      return timestamp.toDate().toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown date";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#08080d] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative grid size-14 place-items-center">
              <div className="absolute inset-0 animate-spin rounded-full border border-violet-400/20 border-t-violet-300" />

              <MessageSquare size={19} className="text-violet-300" />
            </div>

            <p className="mt-4 text-sm text-zinc-400">Loading messages...</p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen overflow-hidden bg-[#08080d] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-32 top-20 size-72 rounded-full bg-violet-500/[0.05] blur-[100px]" />

        <div className="absolute -right-32 top-1/3 size-80 rounded-full bg-cyan-400/[0.04] blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-7 sm:mb-9">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-6 bg-violet-400" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-300 sm:text-xs">
                  Contact monitoring
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-violet-300/10 bg-violet-300/[0.06] text-violet-300">
                  <MessageSquare size={20} />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    Messages
                  </h1>

                  <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                    Manage and monitor incoming messages.
                  </p>
                </div>
              </div>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 self-start rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[11px] text-zinc-400 lg:self-auto">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime-300 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-lime-300" />
              </span>
              Realtime monitoring
            </div>
          </div>
        </header>

        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          {/* Total */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                  Total messages
                </p>

                <p className="mt-3 text-2xl font-semibold tracking-tight">
                  {messages.length}
                </p>
              </div>

              <span className="grid size-9 place-items-center rounded-xl bg-white/[0.05] text-zinc-400">
                <MessageSquare size={17} />
              </span>
            </div>
          </div>

          {/* Unread */}
          <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.025] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-300/70">
                  Unread
                </p>

                <p className="mt-3 text-2xl font-semibold tracking-tight text-cyan-100">
                  {unreadCount}
                </p>
              </div>

              <span className="grid size-9 place-items-center rounded-xl bg-cyan-300/[0.07] text-cyan-300">
                <Mail size={17} />
              </span>
            </div>
          </div>

          {/* Read */}
          <div className="rounded-2xl border border-lime-300/10 bg-lime-300/[0.02] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-lime-200/70">
                  Read
                </p>

                <p className="mt-3 text-2xl font-semibold tracking-tight text-lime-100">
                  {readCount}
                </p>
              </div>

              <span className="grid size-9 place-items-center rounded-xl bg-lime-300/[0.06] text-lime-200">
                <Eye size={17} />
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN PANEL
        ===================================================== */}

        <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.02]">
          {/* Toolbar */}
          <div className="border-b border-white/[0.07] p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              {/* Search */}
              <div className="relative w-full xl:max-w-md">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => changeSearch(event.target.value)}
                  placeholder="Search name, email or message..."
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/20 pl-11 pr-10 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/40 focus:bg-white/[0.03]"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filter */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Filter size={14} />
                  <span>Filter</span>
                </div>

                <div className="grid grid-cols-2 rounded-xl border border-white/[0.08] bg-black/20 p-1">
                  <button
                    type="button"
                    onClick={() => changeFilter("all")}
                    className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                      filter === "all"
                        ? "bg-white text-black"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    All
                  </button>

                  <button
                    type="button"
                    onClick={() => changeFilter("unread")}
                    className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                      filter === "unread"
                        ? "bg-cyan-300 text-black"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    Unread
                    {unreadCount > 0 && (
                      <span className="ml-1.5 opacity-70">{unreadCount}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Result information */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-600">
              <span>
                {filteredMessages.length}{" "}
                {filteredMessages.length === 1 ? "message" : "messages"} found
              </span>

              {searchTerm && (
                <span>
                  Searching for{" "}
                  <span className="text-zinc-400">
                    &quot;{searchTerm}&quot;
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* ===================================================
              MESSAGE LIST
          =================================================== */}

          <div className="p-4 sm:p-5 lg:p-6">
            {currentMessages.length === 0 ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.015] px-5 text-center">
                <div className="grid size-14 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-zinc-600">
                  {searchTerm ? (
                    <Search size={22} />
                  ) : (
                    <MessageSquare size={22} />
                  )}
                </div>

                <h2 className="mt-5 text-sm font-semibold text-zinc-300">
                  {searchTerm
                    ? "No messages found"
                    : filter === "unread"
                      ? "No unread messages"
                      : "No messages yet"}
                </h2>

                <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                  {searchTerm
                    ? "Try searching with another name, email or keyword."
                    : filter === "unread"
                      ? "All incoming messages have been read."
                      : "Messages sent through your contact form will appear here."}
                </p>

                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {currentMessages.map((message) => {
                  const unread = message.status === "unread";

                  return (
                    <article
                      key={message.id}
                      className={`group relative overflow-hidden rounded-2xl border p-5 transition duration-300 sm:p-6 ${
                        unread
                          ? "border-cyan-300/15 bg-cyan-300/[0.025] hover:border-cyan-300/25"
                          : "border-white/[0.07] bg-white/[0.015] hover:border-white/[0.12] hover:bg-white/[0.025]"
                      }`}
                    >
                      {/* Unread indicator */}
                      {unread && (
                        <span className="absolute bottom-0 left-0 top-0 w-[2px] bg-gradient-to-b from-cyan-300 via-violet-300 to-transparent" />
                      )}

                      <div className="flex flex-col gap-5">
                        {/* Top row */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 items-start gap-3">
                            <div
                              className={`grid size-11 shrink-0 place-items-center rounded-xl border ${
                                unread
                                  ? "border-cyan-300/10 bg-cyan-300/[0.06] text-cyan-300"
                                  : "border-white/[0.07] bg-white/[0.04] text-zinc-500"
                              }`}
                            >
                              <User size={18} />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3
                                  className={`truncate text-sm font-semibold ${
                                    unread ? "text-white" : "text-zinc-200"
                                  }`}
                                >
                                  {message.name}
                                </h3>

                                {unread && (
                                  <span className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.06] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cyan-200">
                                    New
                                  </span>
                                )}
                              </div>

                              <a
                                href={`mailto:${message.email}`}
                                className="mt-1 block max-w-full truncate text-xs text-zinc-500 transition hover:text-cyan-300"
                              >
                                {message.email}
                              </a>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex shrink-0 items-center gap-1">
                            {unread ? (
                              <button
                                type="button"
                                onClick={() => markAsRead(message.id)}
                                aria-label="Mark as read"
                                title="Mark as read"
                                className="grid size-9 place-items-center rounded-xl text-cyan-300 transition hover:bg-cyan-300/[0.08] hover:text-cyan-200"
                              >
                                <EyeOff size={17} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => markAsUnread(message.id)}
                                aria-label="Mark as unread"
                                title="Mark as unread"
                                className="grid size-9 place-items-center rounded-xl text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
                              >
                                <Eye size={17} />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => deleteMessage(message.id)}
                              aria-label="Delete message"
                              title="Delete message"
                              className="grid size-9 place-items-center rounded-xl text-zinc-600 transition hover:bg-red-400/[0.07] hover:text-red-300"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>

                        {/* Message */}
                        <div
                          className={`rounded-xl border p-4 ${
                            unread
                              ? "border-cyan-300/[0.06] bg-black/10"
                              : "border-white/[0.04] bg-black/[0.08]"
                          }`}
                        >
                          <p
                            className={`whitespace-pre-wrap text-sm leading-7 ${
                              unread ? "text-zinc-300" : "text-zinc-400"
                            }`}
                          >
                            {message.message}
                          </p>
                        </div>

                        {/* Bottom metadata */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2 text-[11px] text-zinc-600">
                            <Calendar size={13} />

                            <span>{formatDate(message.createdAt)}</span>
                          </div>

                          <a
                            href={`mailto:${message.email}?subject=Re: Portfolio contact`}
                            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
                          >
                            <Mail size={13} />
                            Reply
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* =================================================
                PAGINATION
            ================================================= */}

            {filteredMessages.length > MESSAGES_PER_PAGE && (
              <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-zinc-600">
                  Showing{" "}
                  <span className="text-zinc-400">
                    {startIndex + 1}–
                    {Math.min(endIndex, filteredMessages.length)}
                  </span>{" "}
                  of{" "}
                  <span className="text-zinc-400">
                    {filteredMessages.length}
                  </span>
                </p>

                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={safeCurrentPage === 1}
                    className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1,
                    ).map((page) => {
                      const isActive = safeCurrentPage === page;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`grid size-9 place-items-center rounded-xl text-xs font-medium transition ${
                            isActive
                              ? "bg-white text-black"
                              : "text-zinc-500 hover:bg-white/[0.05] hover:text-white"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={safeCurrentPage === totalPages}
                    className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Next page"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer information */}
        <div className="mt-5 flex flex-col gap-2 px-1 text-[10px] text-zinc-700 sm:flex-row sm:items-center sm:justify-between">
          <span>Contact management</span>

          <span>
            {messages.length} total{" "}
            {messages.length === 1 ? "conversation" : "conversations"}
          </span>
        </div>
      </div>
    </main>
  );
}
