"use client";

import React from "react";
import { Github, Linkedin, Mail, Instagram} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Fungsi untuk smooth scroll ke section tertentu
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Portfolio
              </span>
            </h3>
            <p className="text-gray-300 max-w-md">
              A passionate developer creating amazing web experiences with
              modern technologies. Let&apos;s build something incredible together!
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com/xozamhsw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-purple-600 flex items-center justify-center transition-all duration-300 group"
              >
                <Github
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
              <a
                href="https://www.linkedin.com/in/muhamad-zagar-ainudin-370074375/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 group"
              >
                <Linkedin
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
              {/* Tambahkan Instagram di sini */}
              <a
                href="https://instagram.com/zagar_rrr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-pink-600 flex items-center justify-center transition-all duration-300 group"
              >
                <Instagram
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
              <a
                href="mailto:zagarmhsw@gmail.com"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center transition-all duration-300 group"
              >
                <Mail
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("hero")}
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group w-full text-left"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group w-full text-left"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("projects")}
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group w-full text-left"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group w-full text-left"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Get in Touch
            </h4>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-center">
                <Mail size={18} className="mr-3 text-purple-400" />
                zagarmhsw@gmail.com
              </p>
              <p className="flex items-center">
                <Linkedin size={18} className="mr-3 text-blue-400" />
                linkedin.com/in/muhamad zagar ainudin
              </p>
              <p className="flex items-center">
                <Github size={18} className="mr-3 text-gray-400" />
                github.com/xozamhsw
              </p>
              {/* Tambahkan Instagram di bagian Get in Touch */}
              <p className="flex items-center">
                <Instagram size={18} className="mr-3 text-pink-400" />
                instagram.com/zagar_rrr
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
