'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Moon, Sun, User, LogIn, Menu, X, Star, Heart, Send, Globe, ExternalLink, Play } from 'lucide-react';
import { coursesApi } from '@/lib/api/courses';
import { categoriesApi } from '@/lib/api/categories';
import { Course, Category } from '@/types';
import Footer from '@/components/layout/Footer';




const MOCK_CATEGORIES = [
  { id: 1, name: 'Dizayn' },
  { id: 2, name: 'Frontend' },
  { id: 3, name: 'Backend' },
  { id: 4, name: 'Mobil' },
  { id: 5, name: 'Full Stack' },
  { id: 6, name: "Sun'iy intellekt" },
  { id: 7, name: 'Boshqalar' },
];

export default function CoursesPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("O'z");

  // API Data
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Barcha');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      coursesApi.getAll().catch(() => []),
      categoriesApi.getAll().catch(() => []),
    ]).then(([coursesRes, categoriesRes]) => {
      const apiCourses = coursesRes;
      const apiCategories = categoriesRes.length > 0 ? categoriesRes : MOCK_CATEGORIES;
      setCourses(apiCourses);
      setCategories(apiCategories);
      setLoading(false);
    });
  }, []);

  const filteredCourses = activeCategory === 'Barcha' 
    ? courses 
    : courses.filter(c => c.category?.name?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50/30 text-slate-900'} transition-colors duration-300 flex flex-col justify-between`}>
      <div>
        {/* Header */}
        <header className={`sticky top-0 z-50 w-full border-b ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'} backdrop-blur-md transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-baseline cursor-pointer" onClick={() => router.push('/')}>
              <span className="text-[#3b82f6] font-black text-[28px] tracking-tighter">iT</span>
              <span className={`font-semibold text-[28px] tracking-tight relative ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                live
                <span className="absolute top-[8px] -right-[6px] w-[5px] h-[5px] bg-[#3b82f6] rounded-full"></span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/courses"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#3b82f6] transition-colors"
              >
                <Menu size={16} />
                Kurslar
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium hover:text-[#3b82f6] transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}
              >
                Biz haqimizda
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium hover:text-[#3b82f6] transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}
              >
                Bog&apos;lanish
              </Link>
            </nav>

            {/* Right side Controls */}
            <div className="hidden md:flex items-center gap-4">
              {/* Lang selector */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  onBlur={() => setTimeout(() => setLangDropdownOpen(false), 200)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'} transition-colors`}
                >
                  {selectedLang} <ChevronDown size={12} />
                </button>
                {langDropdownOpen && (
                  <div className={`absolute top-full right-0 mt-1 w-20 rounded-lg shadow-md border p-1 z-50 text-xs ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-700'}`}>
                    {["O'z", "En", "Ru"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLang(lang);
                          setLangDropdownOpen(false);
                        }}
                        className="w-full text-center py-1.5 hover:bg-blue-50 hover:text-blue-600 rounded"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Login button */}
              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-500/20"
              >
                <User size={16} />
                Kirish / Ro'yxatdan o'tish
              </button>
            </div>

            {/* Mobile menu trigger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${darkMode ? 'text-white' : 'text-slate-700'}`}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className={`md:hidden px-4 pt-2 pb-6 border-t ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-700'} space-y-3`}>
              <Link
                href="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left flex items-center gap-2 py-2 text-sm font-semibold text-blue-500"
              >
                Kurslar
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left block py-2 text-sm font-medium hover:text-blue-500 transition-colors"
              >
                Biz haqimizda
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left block py-2 text-sm font-medium hover:text-blue-500 transition-colors"
              >
                Bog&apos;lanish
              </Link>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/login');
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] text-white py-3 rounded-xl text-sm font-semibold transition-all mt-4"
              >
                <LogIn size={16} />
                Kirish / Ro'yxatdan o'tish
              </button>
            </div>
          )}
        </header>

        {/* Courses List Section */}
        <section className={`py-16 md:py-24 ${darkMode ? 'bg-slate-900/50 text-white' : 'bg-white text-slate-900'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl md:text-[48px] font-black tracking-tight mb-4">
                Kurslar
              </h1>
            </div>

            {/* Filter Tabs */}
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                <button
                  onClick={() => setActiveCategory('Barcha')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                    activeCategory === 'Barcha'
                      ? 'bg-[#3b82f6] text-white border-[#3b82f6]'
                      : 'bg-white text-[#3b82f6] border-[#3b82f6]/20 hover:bg-blue-50/50'
                  }`}
                >
                  Barcha kurslar
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                      activeCategory.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-[#3b82f6] text-white border-[#3b82f6]'
                        : 'bg-white text-[#3b82f6] border-[#3b82f6]/20 hover:bg-blue-50/50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Courses Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]"></div>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                Kurslar topilmadi
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course) => {
                  const bannerSrc = course.banner
                    ? `http://localhost:4000/uploads/images/${course.banner}`
                    : (course.mockImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60');

                  const badgeText = course.badge || course.category?.name || 'Kurs';
                  const badgeClass = course.badgeBg || 'bg-blue-500';

                  return (
                    <div
                      key={course.id}
                      onClick={() => router.push(`/courses/${course.id}`)}
                      className={`group rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col h-full ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className="relative aspect-[1.6] w-full overflow-hidden bg-slate-100">
                        <img
                          src={bannerSrc}
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className={`absolute top-4 left-4 text-[11px] font-bold text-white px-3 py-1 rounded-full ${badgeClass}`}>
                          {badgeText}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200">
                                {course.mentor?.file ? (
                                  <img
                                    src={`http://localhost:4000/uploads/images/${course.mentor.file}`}
                                    alt={course.mentor?.user?.name || 'Mentor'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.mentor?.user?.name || 'Mentor')}&background=random`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <span className={`text-[12px] font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {course.mentor?.user?.name || 'Mentor'}
                              </span>
                            </div>
                            <button className="text-slate-400 hover:text-red-500 transition-colors">
                              <Heart size={16} />
                            </button>
                          </div>

                          <h3 className={`text-base font-bold mb-2 group-hover:text-blue-500 transition-colors line-clamp-1 ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {course.name}
                          </h3>

                          <p className={`text-[12px] leading-relaxed mb-4 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {course.description}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 mb-4">
                            {[1, 2, 3, 4].map((s) => (
                              <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                            ))}
                            <Star size={14} className="fill-amber-400/50 text-amber-400/50" />
                            <span className="text-[11px] font-bold text-slate-400 ml-1">(4.5)</span>
                          </div>

                          <div className={`pt-3 border-t flex flex-col gap-0.5 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                            <span className="text-[10px] font-medium text-slate-400">Kurs narxi:</span>
                            <span className="text-[15px] font-extrabold text-blue-500">
                              {Number(course.price).toLocaleString('uz-UZ').replace(/,/g, ' ')} UZS
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

