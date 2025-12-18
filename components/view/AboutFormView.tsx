import React from "react";
import Image from "next/image";
import { Calendar, MapPin, Mail, Code, Palette, Film } from "lucide-react";

export default function AboutFormView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Me
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get to know more about my journey, skills, and passion for
            technology
          </p>
        </div>

        {/* Main Content - Layout Kiri Kanan */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Bagian Kiri - Foto dan Info Kontak */}
          <div className="lg:w-2/5">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-700">
              {/* Foto Profil */}
              <div className="relative w-56 h-56 mx-auto rounded-full overflow-hidden border-4 border-gray-700 shadow-xl mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10"></div>

                <Image
                  src="/formalbulat1.png" // Pastikan file profile.jpg ada di folder public
                  alt="Muhamad Zagar Ainudin"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-100"
                  priority
                />

                {/* Overlay hover effect */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>

              {/* Info Kontak */}
              <div className="space-y-5">
                <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="font-semibold text-white">
                      Solo, Jawa Tengah, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                    <Calendar className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Experience</p>
                    <p className="font-semibold text-white">1+ Years</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold text-white">
                      zagarmhsw@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Keahlian */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                Skills & Interests
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                    <Code className="text-blue-400" size={24} />
                  </div>
                  <span className="font-medium text-white">
                    Programming & Development
                  </span>
                </div>

                <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                    <Palette className="text-purple-400" size={24} />
                  </div>
                  <span className="font-medium text-white">
                    Design & Drawing
                  </span>
                </div>

                <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                    <Film className="text-blue-400" size={24} />
                  </div>
                  <span className="font-medium text-white">Video Editing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian Kanan - Cerita dan Pendidikan */}
          <div className="lg:w-3/5">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                My Journey
              </h2>
              <div className="space-y-5">
                <p className="text-gray-300 leading-relaxed">
                  I&apos;m a passionate informatics engineering student at UDB
                  with a strong interest in creative fields and technology. My
                  journey in programming started during my university studies,
                  and I&apos;ve been continuously exploring and learning ever
                  since.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  I specialize in modern web development using technologies like
                  React, Next.js, and Tailwind CSS for creating responsive and
                  user-friendly interfaces. I enjoy solving problems and
                  building solutions that make a positive impact.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Beyond programming, I have a deep passion for creative
                  activities like digital drawing and video editing. These
                  hobbies allow me to express my creativity and bring unique
                  perspectives to my technical work.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  I believe in the power of continuous learning and always
                  strive to stay updated with the latest technologies and trends
                  in the ever-evolving world of tech.
                </p>
              </div>
            </div>

            {/* Pendidikan & Sertifikasi */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Education
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-5 py-3 bg-purple-900/20 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-white">
                    Bachelor of Informatics Engineering
                  </h3>
                  <p className="text-gray-400">
                    Universitas Duta Bangsa (UDB), 2025 - Present
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Current GPA:-</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-5 py-3 bg-blue-900/20 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-white">
                    High-School
                  </h3>
                  <p className="text-gray-400">SMAN 6 SURAKARTA, 2021-2024</p>
                  <p className="text-sm text-gray-500 mt-1">MIPA 6</p>
                </div>

                <div className="border-l-4 border-green-500 pl-5 py-3 bg-green-900/20 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-white">
                    Junior High School
                  </h3>
                  <p className="text-gray-400">SMPN 18 SURAKARTA, 2019-2021</p>
                  <p className="text-sm text-gray-500 mt-1">SCINCE PROGRAM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
