"use client";

import React, { useState, useEffect } from "react";
import { Github, ExternalLink, Linkedin } from "lucide-react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: Date;
}

const ProjectsFormView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching with mock projects
    const mockProjects: Project[] = [
      {
        id: "1",
        title: "to-do-list",
        description:
          "A sleek and intuitive to-do list application that helps users organize tasks with features like due dates, priorities, and categories.",
        image: "/todolishnew.png",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
        githubUrl: "https://github.com/xozamhsw",
        liveUrl: "https://to-do-list-phi-sable.vercel.app/",
        createdAt: new Date(2025, 8, 15),
      },
      {
        id: "2",
        title: "ReservasiHotel App",
        description:
          "A hotel reservation system that allows users to search, book, and manage hotel stays with real-time availability and secure payment processing.",
        image: "/reservasihotel.png",
        technologies: ["python", "streamlit", "json", "css", "html", "pandas"],
        githubUrl: "https://github.com/xozamhsw",
        createdAt: new Date(2025, 12, 22),
      },
      {
        id: "3",
        title: "anime video downloader",
        description:
          "An anime video downloader application that enables users to easily download and manage their favorite anime episodes from various online sources.",
        image: "/anime.png",
        technologies: [
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "Firebase",
          "cloudinary",
        ],
        githubUrl: "https://github.com/xozamhsw",
        createdAt: new Date(2025, 12, 10),
      },
      {
        id: "4",
        title: "Social Media Analytics",
        description:
          "Analytics platform for social media metrics tracking with customizable dashboards and reporting features.",
        image: "/fotopribadi.png",
        technologies: ["Cowok Keren"],
        githubUrl: "https://github.com/xozamhsw",
        linkedinUrl: "https://linkedin.com/in/muhamad-zagar-ainudin-370074375",
        createdAt: new Date(2006, 3, 27),
      },
      {
        id: "5",
        title: "Mountain Adventure",
        description:
          "A mobile app for booking adventure trips and outdoor activities with real-time availability and user reviews.",
        image: "/ZAGAR.jpeg",
        technologies: ["Cowok Misterius"],
        githubUrl: "https://github.com/xozamhsw",
        linkedinUrl: "https://linkedin.com/in/muhamad-zagar-ainudin-370074375",
        createdAt: new Date(2025, 8, 18),
      },
      {
        id: "6",
        title: "Portfolio Website",
        description:
          "A modern, responsive portfolio website built with Next.js and Tailwind CSS, featuring dark mode and animations.",
        image: "/portfolio.png",
        technologies: ["Next.js", "Tailwind CSS", "golang", "TypeScript"],
        githubUrl: "https://github.com/xozamhsw",
        liveUrl: "https://zagarainudin.my.id/",
        createdAt: new Date(2025, 6, 30),
      },
    ];

    // Simulate API call delay
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <section
        id="projects"
        className="py-20 bg-gradient-to-br from-gray-900 to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              My{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-xl text-gray-300">Loading projects...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
                    <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="h-9 w-20 bg-gray-700 rounded"></div>
                    <div className="h-9 w-24 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            My{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Here are some of my recent works
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="h-48 bg-gray-700 overflow-hidden relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={192}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 text-sm font-medium text-purple-400 border border-purple-400 rounded-full hover:bg-purple-400 hover:text-gray-900 transition-colors duration-200"
                    >
                      <Github size={16} className="mr-1" />
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      Live Demo
                    </a>
                  )}
                  {project.linkedinUrl && (
                    <a
                      href={project.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-200"
                    >
                      <Linkedin size={16} className="mr-1" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No projects found. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsFormView;
