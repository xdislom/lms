'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Settings, ChevronDown, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const StudentHeader = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        
        // Backend login API does not return user.name
        // So we fetch user purchases which includes the user object
        if (parsed?.id && !parsed.name) {
          import('@/lib/api/purchases').then(({ purchasesApi }) => {
            purchasesApi.getByUserId(parsed.id)
              .then(purchases => {
                if (purchases && purchases.length > 0 && purchases[0].user) {
                  const updatedUser = { 
                    ...parsed, 
                    name: purchases[0].user.name, 
                    file: purchases[0].user.file 
                  };
                  setUser(updatedUser);
                  localStorage.setItem('user', JSON.stringify(updatedUser));
                }
              })
              .catch(err => console.error('Failed to load profile details:', err));
          });
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="h-[72px] bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Left side */}
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-slate-800" />
        <span className="font-bold text-slate-800 text-[15px]">Student</span>
      </div>
      
      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Bell & Settings */}
        <div className="flex items-center gap-3 mr-2">
          <button className="relative w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-full bg-white border border-slate-200 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-full bg-white border border-slate-200 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Language selector */}
        <div className="flex items-center justify-between px-3.5 py-2 border border-slate-200 rounded-full bg-white cursor-pointer min-w-[120px] hover:bg-slate-50 transition-colors">
          <span className="text-[13px] font-semibold text-slate-700">O'zbek tili</span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 px-1.5 py-1.5 pr-3 border border-slate-200 rounded-full bg-white hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                {user?.file ? (
                  <img src={`http://localhost:4000/uploads/images/${user.file}`} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Talaba')}&background=f1f5f9&color=64748b`} alt="Avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-bold text-slate-900 leading-none mb-1">{user?.name || 'Talaba'}</span>
                <span className="text-[10px] font-medium text-slate-500 leading-none capitalize">{user?.role || 'Student'}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Sozlamalar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">Chiqish</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
