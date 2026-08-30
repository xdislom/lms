'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-[#f8f9fb] border-t border-slate-200">
      {/* CTA Section */}
      <div className="max-w-[900px] mx-auto px-6 py-16 flex flex-col items-center text-center">
        {/* Logo */}
        <div
          className="flex items-baseline cursor-pointer mb-5"
          onClick={() => router.push('/')}
        >
          <span className="text-[#3b82f6] font-black text-2xl tracking-tighter">iT</span>
          <span className="font-semibold text-2xl tracking-tight text-slate-900 relative">
            live
            <span className="absolute top-1.5 -right-1.5 w-2 h-2 bg-[#3b82f6] rounded-full" />
          </span>
          <sup className="text-[#3b82f6] font-bold text-sm ml-1.5">·</sup>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Biz bilan muvaffaqiyatga erishing
        </h2>
        <p className="text-slate-500 text-[15px] mb-8">
          Eng kuchlilar biz bilan qoladi!
        </p>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-slate-500">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <polygon points="10,8 16,12 10,16" fill="currentColor"/>
            </svg>
            Intro video
          </button>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-full text-sm font-semibold transition-colors"
          >
            Bog&apos;lanish
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 h-12 flex items-center justify-between text-xs text-slate-400">
          <span>© 2024. Barcha huquqlar himoyalangan</span>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-slate-700 transition-colors">Terminlar</Link>
            <Link href="#" className="hover:text-slate-700 transition-colors">Xavfsizlik</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
