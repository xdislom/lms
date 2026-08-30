'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Course, Section } from '@/types';
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  Lock,
  ChevronDown,
  ChevronUp,
  BarChart2,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { purchasesApi } from '@/lib/api/purchases';

export default function CourseDetails() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const courseRes = await fetch(
          `http://localhost:4000/api/v1/cources/cources/${params.id}`,
          { headers }
        ).then((r) => (r.ok ? r.json() : null));

        let courseData = null;
        if (courseRes?.data) {
          courseData = Array.isArray(courseRes.data) ? courseRes.data[0] : courseRes.data;
        } else if (courseRes && !courseRes.data) {
          courseData = courseRes;
        }
        if (courseData) setCourse(courseData);

        const sectionsRes = await fetch(
          `http://localhost:4000/api/v1/sections/cource/${params.id}`,
          { headers }
        ).then((r) => (r.ok ? r.json() : null));

        if (sectionsRes?.data) {
          setSections(sectionsRes.data);
        } else if (sectionsRes && Array.isArray(sectionsRes)) {
          setSections(sectionsRes);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [params.id]);

  const toggleSection = (idx: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleBuy = () => {
    localStorage.setItem('pendingCourseId', params.id);
    localStorage.setItem('pendingCoursePrice', String(course?.price ?? 0));
    router.push('/register');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-700">
        <h2 className="text-2xl font-bold mb-4">Kurs topilmadi</h2>
        <button
          onClick={() => router.push('/')}
          className="text-blue-500 hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  const bannerSrc = course.banner
    ? `http://localhost:4000/uploads/images/${course.banner}`
    : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';

  const mentorName = (course.mentor as any)?.user?.name || (course.mentor as any)?.name || 'Mentor';
  const mentorImage = (course.mentor as any)?.file
    ? `http://localhost:4000/uploads/images/${(course.mentor as any).file}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=3b82f6&color=fff&size=80`;

  const levelLabel: Record<string, string> = {
    BEGINNER: 'Beginner',
    ELEMENTRY: 'Elementary',
    PRE_INTERMIDIATE: 'Pre-Intermediate',
    INTERMIDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1100px] mx-auto px-6 h-[60px] flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-baseline cursor-pointer"
            onClick={() => router.push('/')}
          >
            <span className="text-[#3b82f6] font-black text-xl tracking-tighter">iT</span>
            <span className="font-semibold text-xl tracking-tight text-slate-900 relative">
              live
              <span className="absolute top-1 -right-1 w-1.5 h-1.5 bg-[#3b82f6] rounded-full" />
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm text-slate-600 font-medium">
            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/')}>Kurslar</span>
            <span className="cursor-pointer hover:text-blue-600">Biz haqimizda</span>
            <span className="cursor-pointer hover:text-blue-600">Bog&apos;lanish</span>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 cursor-pointer border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50">
              O&apos;z ▾
            </span>
            <button
              onClick={() => router.push('/login')}
              className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition"
            >
              <Users size={16} className="text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Blue Hero Section ── */}
      <div className="bg-[#2563eb] text-white">
        <div className="max-w-[1100px] mx-auto px-6 pt-10 pb-52">
          <div className="max-w-[55%]">
            <h1 className="text-4xl md:text-[42px] font-extrabold leading-tight mb-4">
              {course.name}
            </h1>
            <p className="text-[15px] text-blue-100 leading-relaxed mb-6 max-w-lg">
              {course.description}
            </p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-blue-100">
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="opacity-80" />
                20 soat 56 daqiqa
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={15} className="opacity-80" />
                255 marta ko&apos;rildi
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart2 size={15} className="opacity-80" />
                Daraja: {levelLabel[course.level || ''] || course.level || 'Beginner'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-[1100px] mx-auto px-6 -mt-44 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left: Sections ── */}
          <div className="flex-1 order-2 lg:order-1 mt-8 lg:mt-[360px]">
            {sections.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
                {sections.map((section, idx) => (
                  <div key={section.id} className="border-b border-slate-200 last:border-0">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(idx)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-[15px] font-semibold text-slate-800">
                        {section.name}
                      </span>
                      {openSections.has(idx) ? (
                        <ChevronUp size={18} className="text-slate-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={18} className="text-slate-500 flex-shrink-0" />
                      )}
                    </button>

                    {/* Lessons */}
                    {openSections.has(idx) && section.lessons && section.lessons.length > 0 && (
                      <div className="border-t border-slate-100">
                        {section.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Lock size={15} className="text-slate-400 flex-shrink-0" />
                              <span className="text-sm text-slate-700">{lesson.name}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-4">
                              9m 34s
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 bg-white border border-slate-200 rounded-lg">
                <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
                <p className="font-medium">Hozircha kurs dasturi kiritilmagan</p>
              </div>
            )}
          </div>

          {/* ── Right: Floating Sidebar ── */}
          <div className="w-full lg:w-[310px] flex-shrink-0 order-1 lg:order-2 space-y-4">

            {/* Purchase Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
              {/* Banner */}
              <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={bannerSrc}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-2xl font-extrabold text-slate-900 mb-2">
                  {Number(course.price || 0).toLocaleString('uz-UZ').replace(/,/g, ' ')} UZS
                </p>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[1, 2, 3, 4].map((s) => (
                    <Star key={s} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                  <Star size={16} className="fill-amber-400/40 text-amber-400/40" />
                  <span className="text-sm text-slate-500 ml-1 font-medium">(4.5)</span>
                </div>

                {/* Buy Button */}
                <button
                  onClick={handleBuy}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg text-sm transition-colors"
                >
                  Sotib olish
                </button>
              </div>
            </div>

            {/* Mentor Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={mentorImage}
                  alt={mentorName}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="font-bold text-slate-900 text-[15px]">{mentorName}</p>
                  <p className="text-xs text-slate-500">Front-end Developer, Designer</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-700">4.6</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 divide-x divide-slate-100 mt-3 pt-3 border-t border-slate-100">
                <div className="flex flex-col items-center px-2">
                  <span className="text-[17px] font-extrabold text-slate-900">100</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">O&apos;quvchilar</span>
                </div>
                <div className="flex flex-col items-center px-2">
                  <span className="text-[17px] font-extrabold text-slate-900">2</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">Kurslar</span>
                </div>
                <div className="flex flex-col items-center px-2">
                  <span className="text-[17px] font-extrabold text-slate-900">245</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">Ko&apos;rishlar</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
