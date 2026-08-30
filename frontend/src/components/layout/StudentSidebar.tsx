'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft, Book } from 'lucide-react';

export const StudentSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Mening kurslarim',
      icon: <Book size={18} />,
      href: '/student',
    },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] bg-[#0c1017] flex flex-col text-slate-300 transition-all z-20 font-sans">
      {/* Logo */}
      <div className="flex items-center justify-between h-[72px] px-6">
        <div className="flex items-baseline">
          <span className="text-[#3b82f6] font-black text-[26px] tracking-tighter">iT</span>
          <span className="text-white font-semibold text-[26px] tracking-tight relative">
            live
            <span className="absolute top-[8px] -right-[6px] w-[5px] h-[5px] bg-[#3b82f6] rounded-full"></span>
          </span>
        </div>
        <button className="text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-lg transition-colors">
          <PanelLeft size={18} />
        </button>
      </div>

      {/* Badge */}
      <div className="px-5 py-4">
        <div className="inline-block px-3 py-1.5 bg-white/5 rounded-md">
          <span className="text-[10px] font-bold text-slate-300 tracking-wider">BOSHQARUV PANELI</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1 pb-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-[14px] font-medium ${
                isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
