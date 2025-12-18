"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code, Database, Cloud, Palette, Server, Cpu } from "lucide-react";

interface SkillsFormView {
  name: string;
  level: number;
  category: "frontend" | "backend" | "database" | "devops" | "design" | "other";
  icon: React.ReactNode;
}

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<SkillsFormView[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const skillCategories = [
    { id: "all", name: "All Skills", icon: <Cpu size={20} /> },
    { id: "frontend", name: "Frontend", icon: <Code size={20} /> },
    { id: "backend", name: "Backend", icon: <Server size={20} /> },
    { id: "database", name: "Database", icon: <Database size={20} /> },
    { id: "devops", name: "DevOps", icon: <Cloud size={20} /> },
    { id: "design", name: "Design", icon: <Palette size={20} /> },
  ];

  useEffect(() => {
    // Simulate data fetching
    const mockSkills: SkillsFormView[] = [
      // Frontend
      {
        name: "React",
        level: 50,
        category: "frontend",
        icon: <Code size={20} />,
      },
      {
        name: "Next.js",
        level: 50,
        category: "frontend",
        icon: <Code size={20} />,
      },
      {
        name: "TypeScript",
        level: 50,
        category: "frontend",
        icon: <Code size={20} />,
      },
      {
        name: "Tailwind CSS",
        level: 70,
        category: "frontend",
        icon: <Code size={20} />,
      },
      // Backend
      {
        name: "Node.js",
        level: 50,
        category: "backend",
        icon: <Server size={20} />,
      },
      {
        name: "Golang",
        level: 50,
        category: "backend",
        icon: <Server size={20} />,
      },
      // Database
      {
        name: "Firebase",
        level: 85,
        category: "database",
        icon: <Database size={20} />,
      },
      {
        name: "MySQL",
        level: 10,
        category: "database",
        icon: <Database size={20} />,
      },

      // DevOps
      {
        name: "Docker",
        level: 10,
        category: "devops",
        icon: <Cloud size={20} />,
      },
      { name: "Git", level: 50, category: "devops", icon: <Cloud size={20} /> },

      // Design
      {
        name: "Figma",
        level: 80,
        category: "design",
        icon: <Palette size={20} />,
      },
      {
        name: "Snapseed",
        level: 50,
        category: "design",
        icon: <Palette size={20} />,
      },
      {
        name: "Lightroom",
        level: 70,
        category: "design",
        icon: <Palette size={20} />,
      },
      {
        name: "Capcut",
        level: 60,
        category: "design",
        icon: <Palette size={20} />,
      },
      {
        name: "Adobe XD",
        level: 10,
        category: "design",
        icon: <Palette size={20} />,
      },
      {
        name: "UI/UX Design",
        level: 80,
        category: "design",
        icon: <Palette size={20} />,
      },
      {
        name: "Canva",
        level: 70,
        category: "design",
        icon: <Palette size={20} />,
      },
    ];

    setSkills(mockSkills);
  }, []);

  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Skills &{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Technologies
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Here are the technologies and tools I work with to create amazing
            digital experiences.
          </motion.p>
        </div>

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {skillCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 shadow-md"
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              variants={itemVariants}
              className="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-purple-400">{skill.icon}</div>
                  <h3 className="font-semibold text-white">{skill.name}</h3>
                </div>
                <span className="text-sm font-medium text-purple-400">
                  {skill.level}%
                </span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>

              <div className="mt-3 flex justify-between text-xs text-gray-500">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredSkills.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-600 mb-4">
              <Cpu size={64} className="mx-auto" />
            </div>
            <p className="text-gray-400 text-lg">
              No skills found in this category.
            </p>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="text-center p-6 bg-gray-800 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-purple-400 mb-2">1+</div>
            <div className="text-gray-400">Years Experience</div>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-purple-400 mb-2">1+</div>
            <div className="text-gray-400">Projects Completed</div>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-purple-400 mb-2">10+</div>
            <div className="text-gray-400">Technologies</div>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-purple-400 mb-2">2+</div>
            <div className="text-gray-400">Happy Clients</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkillsPage;
