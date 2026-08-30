'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, User, LogOut, Settings, ChevronDown, CheckCircle2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const MentorHeader = () => {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  return (
    <header className="h-[72px] bg-slate-50 flex items-center justify-between px-8 sticky top-0 z-10 transition-all border-b border-transparent">
      <div className="flex items-center gap-2 text-slate-800">
        <CheckCircle2 size={24} className="text-slate-800" />
        <span className="font-bold text-xl">Mentor</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Bell */}
        <button className="relative p-2 bg-white rounded-xl text-slate-600 hover:text-slate-800 transition-colors shadow-sm border border-slate-100">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">1</span>
        </button>

        {/* Settings */}
        <button className="p-2 bg-white rounded-xl text-slate-600 hover:text-slate-800 transition-colors shadow-sm border border-slate-100">
          <Settings className="w-5 h-5" />
        </button>

        {/* Language */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm border border-slate-100 cursor-pointer">
          <span className="text-sm font-semibold text-slate-700">🇺🇿 O'zbek tili</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 cursor-pointer group bg-white p-1.5 pr-3 rounded-xl shadow-sm border border-slate-100">
              <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Farkhod+Dadajanov&background=random" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[13px] font-semibold text-slate-800 leading-tight">Farkhod Dadajanov</p>
                <p className="text-[11px] text-slate-500 font-medium">Mentor</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors ml-1 hidden sm:block" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-200 shadow-xl p-2 bg-white">
            <div className="font-semibold text-slate-800 px-2 py-1.5 text-sm">Mening profilim</div>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem className="gap-2 text-slate-600 rounded-lg focus:bg-slate-50 cursor-pointer">
              <Settings size={16} /> Sozlamalar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="gap-2 text-red-600 rounded-lg focus:bg-red-50 focus:text-red-700 cursor-pointer"
            >
              <LogOut size={16} /> Chiqish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
