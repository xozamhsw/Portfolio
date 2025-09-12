"use client";

import React, { useState, useEffect } from "react";
import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
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
        title: "E-Commerce Platform",
        description:
          "A full-stack e-commerce solution with React, Node.js, and MongoDB. Features user authentication, payment processing, and admin dashboard.",
        imageUrl:
          "https://i.pinimg.com/1200x/67/3c/16/673c1636c3a57e42bb16a74d60f79d41.jpg",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        createdAt: new Date(2023, 5, 15),
      },
      {
        id: "2",
        title: "Task Management App",
        description:
          "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
        imageUrl:
          "https://i.pinimg.com/736x/a1/aa/27/a1aa2717994fefd8f41f23cad770c08c.jpg",
        technologies: ["Next.js", "TypeScript", "Firebase", "Tailwind"],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        createdAt: new Date(2023, 3, 22),
      },
      {
        id: "3",
        title: "Weather Dashboard",
        description:
          "A responsive weather dashboard that displays current weather and forecasts for multiple locations with interactive charts.",
        imageUrl:
          "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        technologies: ["Vue.js", "Chart.js", "OpenWeather API", "CSS3"],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        createdAt: new Date(2023, 1, 10),
      },
      {
        id: "4",
        title: "Social Media Analytics",
        description:
          "Analytics platform for social media metrics tracking with customizable dashboards and reporting features.",
        imageUrl:
          "https://i.pinimg.com/1200x/65/a1/0b/65a10b505e3001c955109b7f1906a314.jpg",
        technologies: ["React", "D3.js", "Express", "PostgreSQL"],
        githubUrl: "https://github.com",
        createdAt: new Date(2022, 11, 5),
      },
      {
        id: "5",
        title: "Fitness Tracker App",
        description:
          "Mobile application for tracking workouts, nutrition, and health metrics with personalized recommendations.",
        imageUrl:
          "https://i.pinimg.com/1200x/50/ed/fc/50edfc424bcdec7d4544371742962311.jpg",
        technologies: ["React Native", "Redux", "Node.js", "MongoDB"],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        createdAt: new Date(2022, 8, 18),
      },
      {
        id: "6",
        title: "Portfolio Website",
        description:
          "A modern, responsive portfolio website built with Next.js and Tailwind CSS, featuring dark mode and animations.",
        imageUrl:
          "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        technologies: [
          "Next.js",
          "Tailwind CSS",
          "Framer Motion",
          "TypeScript",
        ],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        createdAt: new Date(2022, 6, 30),
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
        className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              My{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Loading projects...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="h-9 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-9 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
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
      className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Here are some of my recent works
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={400}
                  height={192}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded-full"
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
                      className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 rounded-full hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-gray-900 transition-colors duration-200"
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No projects found. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsFormView;
