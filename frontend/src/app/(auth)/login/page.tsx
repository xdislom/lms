'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await authApi.login({ phone, password });
      if (res.accessToken) {
        localStorage.setItem('access_token', res.accessToken);
        router.push('/admin/administratorlar');
      } else {
        setError('Token topilmadi');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login yoki parol xato');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-[26px] font-bold text-[#1a1a1a] mb-[30px] text-center">Tizimga kirish</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</div>}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-800">Telefon raqam</label>
          <input 
            type="text" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998901234567" 
            required 
            className="w-full py-3 px-4 border border-slate-200 rounded-lg text-[13px] outline-none text-[#1a1a1a] focus:border-[#4a86f7] focus:ring-4 focus:ring-[#4a86f7]/10 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-800">Parol</label>
            <Link href="#" className="text-[11px] text-[#4a86f7] hover:underline font-medium">
              Parolni unutdingizmi?
            </Link>
          </div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {isLoading ? 'Kirilmoqda...' : 'Davom etish'}
        </button>
      </form>
      <p className="text-center text-xs text-slate-500 mt-5">
        Akkauntingiz yo'qmi? <Link href="/register" className="text-blue-500 font-medium hover:underline">Ro'yxatdan o'tish</Link>
      </p>
    </>
  );
}
