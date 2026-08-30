'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Copy } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(46);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = localStorage.getItem('resetPhone');
    if (!phone) {
      alert("Telefon raqam topilmadi, iltimos boshqatdan urinib ko'ring.");
      router.push('/login');
      return;
    }
    
    try {
      await authApi.verifyOtp({ phone, otp: code });
      router.push('/reset-password');
    } catch (err: any) {
      alert(err.response?.data?.message || "Kod xato");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <h1 className="text-[26px] font-bold text-[#1a1a1a] mb-[30px] text-center">Tasdiqlash kodi</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-800">
            Tasdiqlash kodi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000-000" 
              required 
              maxLength={7}
              className="w-full py-3 px-4 border border-slate-200 rounded-lg text-[13px] outline-none text-[#1a1a1a] focus:border-[#4a86f7] focus:ring-4 focus:ring-[#4a86f7]/10 transition-all placeholder:text-slate-400 tracking-[0.2em]"
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="bg-[#f0f2f5] text-gray-600 px-3 py-1 rounded-md text-xs font-medium">
            {formatTime(timeLeft)}
          </div>
          <button 
            type="button" 
            disabled={timeLeft > 0}
            onClick={() => setTimeLeft(60)}
            className="text-xs text-slate-500 hover:text-blue-500 disabled:opacity-50 disabled:hover:text-slate-500 transition-colors"
          >
            Kodni qayta yuborish
          </button>
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3.5 px-4 text-sm font-medium transition-colors cursor-pointer"
        >
          Davom etish
        </button>
      </form>
    </>
  );
}
