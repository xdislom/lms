'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/components/layout/Footer';

/* ── Gallery images from public folder ── */
const GALLERY_IMAGES = [
  '/Rectangle 1508.png',
  '/Rectangle 1509.png',
  '/Rectangle 1510.png',
  '/Rectangle 1511.png',
  '/Rectangle 1512.png',
  '/Rectangle 1514.png',
  '/Rectangle 1515.png',
  '/Rectangle 1516.png',
  '/Rectangle 1517.png',
];

const ITEMS_PER_PAGE = 5;
const TOTAL_PAGES = Math.ceil(GALLERY_IMAGES.length / ITEMS_PER_PAGE);

const CERTIFICATES = [
  { src: '/certificate_gold.jpg', alt: 'Certificate of Achievement – Gold' },
  { src: '/certificate_gold.jpg', alt: 'Certificate of Achievement – Classic' },
  { src: '/certificate_red.jpg', alt: 'Certificate of Achievement – Red' },
  { src: '/certificate_red.jpg', alt: 'Certificate of Achievement – Premium' },
];

type Mentor = {
  id: number;
  name?: string;
  user?: { name: string };
  file?: string;
  specialty?: string;
};

export default function AboutPage() {
  const router = useRouter();
  const [galleryPage, setGalleryPage] = useState(1);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [hoveredMentor, setHoveredMentor] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/mentor/mentor')
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        const list = res?.data || res || [];
        if (Array.isArray(list)) setMentors(list);
      })
      .catch(() => {});
  }, []);

  const startIdx = (galleryPage - 1) * ITEMS_PER_PAGE;
  const visibleImages = GALLERY_IMAGES.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const getMentorName = (m: Mentor) => m.user?.name || m.name || 'Mentor';
  const getMentorImage = (m: Mentor) =>
    m.file
      ? `http://localhost:4000/uploads/images/${m.file}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(getMentorName(m))}&background=3b82f6&color=fff&size=200`;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1100px] mx-auto px-6 h-[60px] flex items-center justify-between">
          <div className="flex items-baseline cursor-pointer" onClick={() => router.push('/')}>
            <span className="text-[#3b82f6] font-black text-xl tracking-tighter">iT</span>
            <span className="font-semibold text-xl tracking-tight text-slate-900 relative">
              live
              <span className="absolute top-1 -right-1 w-1.5 h-1.5 bg-[#3b82f6] rounded-full" />
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm text-slate-600 font-medium">
            <Link href="/courses" className="hover:text-blue-600 transition-colors">Kurslar</Link>
            <Link href="/about" className="text-blue-600 font-semibold">Biz haqimizda</Link>
            <Link href="#contact" className="hover:text-blue-600 transition-colors">Bog&apos;lanish</Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 cursor-pointer border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50">
              O&apos;z ▾
            </span>
            <button
              onClick={() => router.push('/login')}
              className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Kirish / Ro&apos;yxatdan o&apos;tish
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1">
        <div className="max-w-[780px] mx-auto px-6 py-12">

          {/* ── About Text ── */}
          <h1 className="text-3xl font-bold text-slate-900 mb-5">Biz haqimizda</h1>
          <div className="text-[15px] text-slate-600 leading-relaxed space-y-4 mb-12">
            <p>
              IT Live — bu zamonaviy IT ta&apos;lim platformasi bo&apos;lib, dasturlash, dizayn va texnologiya
              sohasida bilim va ko&apos;nikmalarni o&apos;rganishni istagan har bir inson uchun yaratilgan.
              Biz o&apos;quvchilarga eng yuqori sifatli onlayn kurslar, amaliy loyihalar va
              professional mentorlar bilan ishlash imkoniyatini taqdim etamiz.
            </p>
            <p>
              Platformamiz orqali siz o&apos;zingizga qulay vaqtda, o&apos;zingizga qulay joydan va o&apos;zingizga
              qulay tezlikda o&apos;rganishingiz mumkin. Biz har bir o&apos;quvchi o&apos;zining maqsadiga erishishiga
              ishonchimiz komil va buning uchun barcha zarur vositalarni taqdim etamiz.
            </p>
            <p>
              IT Live jamoas tajribali dasturchilar, dizaynerlar va ta&apos;lim mutaxassislaridan iborat.
              Bizning maqsadimiz — O&apos;zbekistonda IT ta&apos;limini yangi bosqichga olib chiqish va
              yoshlarni global bozorga tayyorlash. Har yili yuzlab bitiruvchilarimiz yetakchi
              IT kompaniyalarida muvaffaqiyatli faoliyat yuritmoqda.
            </p>
          </div>

          {/* ── Media Gallery ── */}
          <h2 className="text-xl font-bold text-slate-900 mb-5">Media galereya</h2>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {visibleImages.slice(0, 3).map((src, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                <img src={src} alt={`Gallery ${startIdx + i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {visibleImages.slice(3).map((src, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                <img src={src} alt={`Gallery ${startIdx + i + 4}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm text-slate-600 mb-16">
            <button
              onClick={() => setGalleryPage((p) => Math.max(1, p - 1))}
              disabled={galleryPage === 1}
              className="flex items-center gap-1 disabled:opacity-40 hover:text-blue-600 transition-colors font-medium"
            >
              <ChevronLeft size={16} /> Ortga
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setGalleryPage(page)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    page === galleryPage
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setGalleryPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              disabled={galleryPage === TOTAL_PAGES}
              className="flex items-center gap-1 disabled:opacity-40 hover:text-blue-600 transition-colors font-medium"
            >
              Keyingi <ChevronRight size={16} />
            </button>
          </div>

          {/* ── Certificates ── */}
          <h2 className="text-xl font-bold text-slate-900 mb-5">Sertifikat va guvohnomalar</h2>
          <div className="grid grid-cols-2 gap-4 mb-16">
            {CERTIFICATES.map((cert, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <img src={cert.src} alt={cert.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Mentors Section ── */}
        {mentors.length > 0 && (
          <section className="bg-[#f8f9fb] py-16">
            <div className="max-w-[1100px] mx-auto px-6">
              <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-2">
                Tajribali Mentorlar
              </h2>
              <p className="text-center text-slate-500 text-[15px] mb-10">
                Barcha kurslarimiz tajribali mentorlar tomonidan tayyorlangan
              </p>

              {/* Horizontal scroll carousel */}
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {mentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="relative flex-shrink-0 w-[220px] h-[300px] rounded-xl overflow-hidden snap-start cursor-pointer group"
                    onMouseEnter={() => setHoveredMentor(mentor.id)}
                    onMouseLeave={() => setHoveredMentor(null)}
                  >
                    <img
                      src={getMentorImage(mentor)}
                      alt={getMentorName(mentor)}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                      hoveredMentor === mentor.id ? 'opacity-100' : 'opacity-0'
                    }`} />

                    {/* Info */}
                    <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
                      hoveredMentor === mentor.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                    }`}>
                      <p className="text-white font-bold text-[15px]">{getMentorName(mentor)}</p>
                      <p className="text-slate-300 text-xs mt-0.5">
                        {mentor.specialty || 'UI/UX Dizayner'}
                      </p>
                      {/* Social icons row */}
                      <div className="flex items-center gap-2 mt-2">
                        {['telegram', 'instagram', 'facebook', 'linkedin', 'github'].map((s) => (
                          <span
                            key={s}
                            className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer"
                          >
                            <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10"/>
                            </svg>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
