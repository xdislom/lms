'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/login');
    }, 1000);
  };

  return (
    <>
      <h1 className="text-[26px] font-bold text-[#1a1a1a] mb-[30px] text-center">Ro'yxatdan o'tish</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-800">To'liq ismingizni kiriting <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="Kiritish" 
            required 
            className="w-full py-3 px-4 border border-slate-200 rounded-lg text-[13px] outline-none text-[#1a1a1a] focus:border-[#4a86f7] focus:ring-4 focus:ring-[#4a86f7]/10 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-800">Telefon raqamingiz <span className="text-red-500">*</span></label>
          <input 
            type="tel" 
            placeholder="+998" 
            required 
            className="w-full py-3 px-4 border border-slate-200 rounded-lg text-[13px] outline-none text-[#1a1a1a] focus:border-[#4a86f7] focus:ring-4 focus:ring-[#4a86f7]/10 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-800">Parolni kiriting <span className="text-red-500">*</span></label>
          <input 
            type="password" 
            placeholder="********" 
            required 
            className="w-full py-3 px-4 border border-slate-200 rounded-lg text-[13px] outline-none text-[#1a1a1a] focus:border-[#4a86f7] focus:ring-4 focus:ring-[#4a86f7]/10 transition-all placeholder:text-slate-400"
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3.5 px-4 text-sm font-medium mt-2.5 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Yaratilmoqda...' : 'Davom etish'}
        </button>
      </form>
      <p className="text-center text-xs text-slate-500 mt-5">
        Menda hisob mavjud! <Link href="/login" className="text-blue-500 font-medium hover:underline">Kirish</Link>
      </p>
    </>
  );
}
