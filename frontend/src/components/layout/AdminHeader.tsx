'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const AdminHeader = () => {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      router.push('/login');
    }
  };

  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 transition-all">
      <div className="flex items-center gap-4 w-full max-w-md relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Qidirish..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 transition-all text-slate-700 placeholder:text-slate-400"
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-6 w-px bg-slate-200"></div>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#3b82f6] border border-blue-100">
                <User size={18} />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[13px] font-semibold text-slate-800 leading-tight">Admin User</p>
                <p className="text-[11px] text-slate-500 font-medium">Boshqaruvchi</p>
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
