"use client";

import React, { useState, useEffect } from "react";
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
  Eye,
  EyeOff,
  Trash2,
  Mail,
  Calendar,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp; 
  status: "read" | "unread";
}

export default function ContactMonitoring() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesPerPage = 5;

  useEffect(() => {
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: ContactMessage[] = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as ContactMessage);
      });
      setMessages(messagesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "contacts", id), {
        status: "read",
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      await updateDoc(doc(db, "contacts", id), {
        status: "unread",
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "contacts", id));
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  // Filter messages based on status and search term
  const filteredMessages = messages.filter((msg) => {
    const matchesFilter = filter === "all" || msg.status === "unread";
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );

  const unreadCount = messages.filter((msg) => msg.status === "unread").length;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <MessageSquare className="mr-3 text-blue-600" size={32} />
                Contact Messages
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and monitor all incoming messages
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search Input */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Filter and Stats */}
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full flex items-center">
                  <Mail size={16} className="mr-1" />
                  {unreadCount} unread
                </div>

                <div className="relative">
                  <Filter
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <select
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value as "all" | "unread");
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Messages</option>
                    <option value="unread">Unread Only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Messages List */}
          {currentMessages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <MessageSquare
                size={64}
                className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
              />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchTerm
                  ? "No messages found matching your search."
                  : `No ${filter === "unread" ? "unread" : ""} messages found.`}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`border rounded-xl p-5 transition-all duration-200 ${
                      message.status === "unread"
                        ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.status === "unread"
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          <User
                            size={24}
                            className={
                              message.status === "unread"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400"
                            }
                          />
                        </div>
                        <div>
                          <h3
                            className={`font-semibold text-lg ${
                              message.status === "unread"
                                ? "text-blue-900 dark:text-blue-100"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {message.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {message.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-center">
                        {message.status === "unread" ? (
                          <button
                            onClick={() => markAsRead(message.id)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <EyeOff size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsUnread(message.id)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Mark as unread"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <p
                      className={`text-gray-700 dark:text-gray-300 mb-4 leading-relaxed ${
                        message.status === "unread" ? "font-medium" : ""
                      }`}
                    >
                      {message.message}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={14} className="mr-2" />
                      {message.createdAt?.toDate().toLocaleString() ||
                        "Unknown date"}
                      {message.status === "unread" && (
                        <span className="ml-3 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                          Unread
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Showing {indexOfFirstMessage + 1}-
                    {Math.min(indexOfLastMessage, filteredMessages.length)} of{" "}
                    {filteredMessages.length} messages
                  </p>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg border transition-colors ${
                              currentPage === page
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
