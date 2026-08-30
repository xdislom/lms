'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Moon, Sun, User, LogIn, Menu, X, Star, Heart, Send, Globe, ExternalLink, Play } from 'lucide-react';
import { coursesApi } from '@/lib/api/courses';
import { categoriesApi } from '@/lib/api/categories';
import { mentorsApi } from '@/lib/api/mentors';
import { Course, Category, Mentor } from '@/types';
import Footer from '@/components/layout/Footer';


const MOCK_MENTORS: any[] = [
  {
    id: 1,
    name: "Oybek Safarov",
    file: null,
    mentor: {
      job: "Senior Frontend Engineer",
      telegram: "https://t.me/itlive",
      web_link: "https://itlive.uz"
    }
  },
  {
    id: 2,
    name: "Javohir Elmurodov",
    file: null,
    mentor: {
      job: "Backend Technical Lead",
      telegram: "https://t.me/itlive",
      web_link: "https://itlive.uz"
    }
  },
  {
    id: 3,
    name: "Sardorbek Shodiyev",
    file: null,
    mentor: {
      job: "UI/UX Designer",
      telegram: "https://t.me/itlive",
      web_link: "https://itlive.uz"
    }
  },
  {
    id: 4,
    name: "Diyorbek Rustamov",
    file: null,
    mentor: {
      job: "Flutter Mobile Developer",
      telegram: "https://t.me/itlive",
      web_link: "https://itlive.uz"
    }
  },
  {
    id: 5,
    name: "Laylo Karimova",
    file: null,
    mentor: {
      job: "SMM Expert",
      telegram: "https://t.me/itlive",
      web_link: "https://itlive.uz"
    }
  }
];

export default function LandingPage() {
  const router = useRouter();
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("O'z");

  // API Data
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [reviews, setReviews] = useState<any[]>([]); 
  const [activeCategory, setActiveCategory] = useState<string>('Barcha');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const [coursesRes, categoriesRes, mentorsRes] = await Promise.all([
          fetch('http://localhost:4000/api/v1/cources/cources/all', { headers }).then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] })),
          fetch('http://localhost:4000/api/v1/category/categiry/all', { headers }).then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] })),
          fetch('http://localhost:4000/api/v1/mentor/mentor', { headers }).then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] })),
        ]);
        const coursesList = coursesRes?.data || coursesRes || [];
        const categoriesList = categoriesRes?.data || categoriesRes || [];
        const mentorsList = mentorsRes?.data || mentorsRes || [];

        setCourses(Array.isArray(coursesList) ? coursesList : []);
        setCategories(Array.isArray(categoriesList) ? categoriesList : []);
        
        const finalMentors = Array.isArray(mentorsList) && mentorsList.length > 0 
          ? mentorsList 
          : MOCK_MENTORS;
        setMentors(finalMentors);
      } catch {
        setCourses([]);
        setCategories([]);
        setMentors(MOCK_MENTORS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCourses = activeCategory === 'Barcha' 
    ? courses 
    : courses.filter(c => c.category?.name?.toLowerCase() === activeCategory.toLowerCase());

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50/30 text-slate-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 w-full border-b ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'} backdrop-blur-md transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-baseline cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
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
              className={`flex items-center gap-1.5 text-sm font-semibold hover:text-[#3b82f6] transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-[56px] font-black leading-[1.1] tracking-tight">
              <span className="text-[#6366f1] drop-shadow-sm">Kelajak</span>{' '}
              <span className="text-[#ef4444]">kasblarini</span>{' '}
              <span className={darkMode ? 'text-white' : 'text-slate-900'}>biz bilan o'rganing!</span>
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed max-w-xl ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Tekinga o'qib, pul ishlashga nima deysiz? Ishonmayapsizmi? Biz buni isbotlaymiz. Hammasi o'zingizga bog'liq.
            </p>

            <div className="pt-2">
              <button
                onClick={() => scrollToSection('courses')}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-4 rounded-full text-base font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Kurslar bilan tanishish
              </button>
            </div>
          </div>

          {/* Hero Right Image Illustration */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg aspect-square lg:aspect-auto">
              <img
                src="/Learning languages-cuate 1.png"
                alt="Programmer working illustration"
                className="w-full h-auto object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className={`py-16 md:py-24 border-t ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-[40px] font-black tracking-tight mb-4">
              Ommabop kurslar
            </h2>
            <p className={`text-[15px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Kasbga yo'naltirilgan praktikumlar yordamida eng tez va samarali yo'llar bilan mutaxassislar qatoriga qo'shiling. Har bir praktikum soha mutaxassislari tomonidan eng zamonaviy o'quv reja asosida tayyorlangan
            </p>
          </div>

          {/* Filter Tabs */}
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
            {categories.map((cat, i) => (
              <button
                key={i}
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

          {/* Courses Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Kurslar topilmadi</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => {
              const bannerSrc = course.banner
                ? `http://localhost:4000/uploads/images/${course.banner}`
                : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60';

              const badgeText = course.category?.name || 'Kurs';

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
                    <span className="absolute top-4 left-4 text-[11px] font-bold text-white px-3 py-1 rounded-full bg-blue-500">
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
          {/* Bottom Button */}
          <div className="text-center mt-12">
            <Link href="/courses">
              <button
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
              >
                Barcha kurslarni ko'rish
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className={`py-16 md:py-24 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-[36px] font-bold tracking-tight mb-3">
              Bizga qo'shiling
            </h2>
            <p className={`text-[14px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Bizning safimizga nafaqat o'rganuvchi balki yetarlicha tajribangiz bo'lsa mentor sifatida ham qo'shishingiz mumkin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`p-8 rounded-[20px] border flex flex-col justify-between items-start min-h-[220px] transition-all duration-300 ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/40 border-slate-100 hover:shadow-md'
            }`}>
              <div>
                <h3 className="text-xl font-bold mb-3">O'quvchimisiz?</h3>
                <p className={`text-[13px] leading-relaxed mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Agarda o'quvchi bo'lsangiz bizning xalqaro darajadagi tajribali mentorlarimizga shogird bo'ling
                </p>
              </div>
              <button
                onClick={() => router.push('/login')}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors"
              >
                Boshlash
              </button>
            </div>

            <div className={`p-8 rounded-[20px] border flex flex-col justify-between items-start min-h-[220px] transition-all duration-300 ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/40 border-slate-100 hover:shadow-md'
            }`}>
              <div>
                <h3 className="text-xl font-bold mb-3">Mentormisiz?</h3>
                <p className={`text-[13px] leading-relaxed mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Bizning mualliflar jamoamizga qo'shilib, o'z tajribangizni boshqalar bilan oosn va qulay platforma orqali ulashing
                </p>
              </div>
              <button
                onClick={() => router.push('/login')}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors"
              >
                Qo'shilish
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tajribali Mentorlar Section */}
      <section id="about" className={`py-16 md:py-24 border-t ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/30 border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-[36px] font-bold tracking-tight mb-3">
              Tajribali Mentorlar
            </h2>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Barcha kurslarimiz tajribali mentorlar tomonidan tayyorlangan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {mentors.map((mentor) => {
              const imageSrc = mentor.file
                ? `http://localhost:4000/uploads/images/${mentor.file}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&size=300&background=random`;

              return (
                <div
                  key={mentor.id}
                  className="relative aspect-[0.8] rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-200 group cursor-pointer"
                >
                  <img
                    src={imageSrc}
                    alt={mentor.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-5 text-white">
                    <h3 className="text-base font-bold leading-tight">{mentor.name}</h3>
                    <p className="text-[12px] text-slate-300 font-medium mt-1">
                      {mentor.mentor?.job || 'UI/UX Dizayner'}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
                      {mentor.mentor?.telegram && (
                        <a href={mentor.mentor.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" title="Telegram">
                          <Send size={14} />
                        </a>
                      )}
                      {mentor.mentor?.web_link && (
                        <a href={mentor.mentor.web_link} target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors" title="Website">
                          <Globe size={14} />
                        </a>
                      )}
                      <a href="#" className="hover:text-slate-300 transition-colors">
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Izohlar Section */}
      <section className={`py-16 md:py-24 border-t ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-[36px] font-bold tracking-tight mb-3">
              Izohlar
            </h2>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              O'quvchilarimiz tomonidan qoldirilgan izohlar
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="h-10"></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-[20px] border flex flex-col justify-between min-h-[220px] ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/20 border-slate-100'
                  }`}
                >
                  <div>
                    <span className="text-[40px] font-serif text-orange-500 leading-none mb-4 block">“</span>
                    <p className={`text-[13px] leading-relaxed mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {rev.text}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{rev.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{rev.courseName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Online Learning Banner (Istalgan nuqtadan onlayn o'qish imkoniyati) */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="bg-[#3b82f6] rounded-[24px] text-white py-16 px-8 text-center relative overflow-hidden shadow-lg shadow-blue-500/10">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-[40px] font-black leading-tight">
              Istalgan nuqtadan onlayn o'qish imkoniyati
            </h2>
            <p className="text-sm md:text-base text-blue-50 font-medium">
              Biz sizga bu imkoniyatni taqdim qilamiz
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push('/login')}
                className="bg-white hover:bg-slate-50 text-[#3b82f6] px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Ro'yxatdan o'tish
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
