'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import Footer from '@/components/layout/Footer';

const COUNTRY_CODES = [
  { code: 'UZ', dial: '+998', flag: '🇺🇿' },
  { code: 'RU', dial: '+7',   flag: '🇷🇺' },
  { code: 'US', dial: '+1',   flag: '🇺🇸' },
  { code: 'KZ', dial: '+7',   flag: '🇰🇿' },
];

export default function ContactPage() {
  const router = useRouter();
  const [country, setCountry] = useState(COUNTRY_CODES[0]);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sans flex flex-col">

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
            <Link href="/about"   className="hover:text-blue-600 transition-colors">Biz haqimizda</Link>
            <Link href="/contact" className="text-blue-600 font-semibold">Bog&apos;lanish</Link>
          </nav>

          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Kirish / Ro&apos;yxatdan o&apos;tish
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 py-14">
        <div className="max-w-[820px] mx-auto px-6">

          {/* Breadcrumb */}
          <p className="text-xs text-blue-500 font-semibold mb-2">Bog&apos;lanish</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">
            Savollaringiz bo&apos;lsa murojaat qiling
          </h1>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {/* Phone */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Phone size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Telefon</p>
                <p className="text-xs text-slate-500 mt-0.5">+998(93) 993 99 99</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Mail size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Elektron pochta</p>
                <p className="text-xs text-slate-500 mt-0.5">info@itlive.uz</p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <MapPin size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Manzil</p>
                <p className="text-xs text-slate-500 mt-0.5">Manzil shu yerda kiritiladi</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <p className="text-xs text-blue-500 font-semibold mb-1">Bog&apos;lanish</p>
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Savollaringiz bo&apos;lsa murojaat qiling
            </h2>

            {sent && (
              <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">
                ✅ Xabaringiz muvaffaqiyatli yuborildi!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">F.I.SH</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Kiriting"
                  required
                  className="h-11 rounded-lg border border-slate-200 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Telefon raqamingiz</label>
                <div className="flex h-11 rounded-lg border border-slate-200 overflow-hidden focus-within:border-blue-400 transition-colors">
                  <select
                    value={country.code}
                    onChange={(e) => setCountry(COUNTRY_CODES.find(c => c.code === e.target.value) || COUNTRY_CODES[0])}
                    className="h-full px-3 bg-slate-50 border-r border-slate-200 text-sm text-slate-700 focus:outline-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.dial}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="__ ___ __ __"
                    required
                    className="flex-1 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Xabar</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Xabaringizni kiriting..."
                  required
                  rows={4}
                  className="rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-11 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Yuborish
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
