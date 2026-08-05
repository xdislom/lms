'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Users,
  BookOpen,
  Calculator,
  MessageSquare,
  ChevronDown,
  PanelLeftClose,
} from 'lucide-react';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'Foydalanuvchilar': true,
    'Kurslar': true,
  });

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const navItems = [
    {
      label: 'Asosiy',
      icon: <LayoutGrid size={18} />,
      href: '/admin',
    },
    {
      label: 'Foydalanuvchilar',
      icon: <Users size={18} />,
      children: [
        { label: 'Administratorlar', href: '/admin/administratorlar' },
        { label: 'Mentorlar', href: '/admin/mentorlar' },
        { label: 'Assistentlar', href: '/admin/assistentlar' },
        { label: "O'quvchilar", href: '/admin/oquvchilar' },
      ],
    },
    {
      label: 'Kurslar',
      icon: <BookOpen size={18} />,
      children: [
        { label: 'Barcha kurslar', href: '/admin/courses' },
        { label: 'Kategoriyalar', href: '/admin/categories' },
        { label: 'Dropdown item', href: '#' },
        { label: 'Darslar', href: '#' },
        { label: 'Vazifalar', href: '#' },
        { label: 'Testlar', href: '#' },
        { label: 'Savol-javoblar', href: '#' },
        { label: 'Uyga vazifalar', href: '#' },
      ],
    },
    {
      label: "To'lovlar",
      icon: <Calculator size={18} />,
      href: '#',
    },
    {
      label: 'Izohlar',
      icon: <MessageSquare size={18} />,
      href: '#',
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
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* Badge */}
      <div className="px-5 py-4">
        <div className="inline-block px-3 py-1.5 bg-white/5 rounded-md">
          <span className="text-[10px] font-bold text-slate-300 tracking-wider">BOSHQARUV PANELI</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navItems.map((item) => {
          const hasChildren = !!item.children;
          const isOpen = openMenus[item.label];

          if (!hasChildren) {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href || '#'}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-[14px] font-medium ${
                  isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          }

          return (
            <div key={item.label} className="flex flex-col">
              {/* Trigger */}
              <button
                onClick={() => toggleMenu(item.label)}
                className="flex items-center justify-between px-3 py-3 rounded-lg transition-all text-[14px] font-medium text-slate-300 hover:text-slate-100 hover:bg-white/5 w-full"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ChevronDown
                  size={14}
                  className="text-slate-400 transition-transform duration-300 ease-in-out"
                  style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                />
              </button>

              {/* Smooth accordion panel */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: isOpen ? `${(item.children?.length ?? 0) * 44}px` : '0px' }}
              >
                <div className="flex flex-col mt-0.5 space-y-0.5">
                  {item.children.map((child) => {
                    const isActive =
                      pathname === child.href ||
                      (child.href !== '#' &&
                        pathname.startsWith(child.href) &&
                        child.href !== '/admin');
                    return (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={`flex items-center pl-11 pr-3 py-2.5 rounded-lg transition-all text-[13px] font-medium ${
                          isActive
                            ? 'bg-[#1f2937] text-white'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
