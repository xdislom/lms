'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await authApi.login({ phone, password });
      if (res.accessToken) {
        localStorage.setItem('access_token', res.accessToken);
        let extractedRole = res.user?.role || '';
        // Decode JWT to get user info (backend only returns role and accessToken)
        try {
          const payloadBase64 = res.accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
          const decodedJson = decodeURIComponent(atob(payloadBase64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decodedData = JSON.parse(decodedJson);
          
          if (decodedData.role) {
            extractedRole = decodedData.role;
          }
          
          const userData = {
            id: decodedData.id,
            phone: decodedData.phone,
            role: extractedRole
          };
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
          console.error("Token decode error:", e);
        }
        
        // Redirect based on user role
        const role = (extractedRole || '').toUpperCase();
        if (role === 'ADMIN' || role === 'SUPERADMIN') {
          router.push('/admin/administratorlar');
        } else if (role === 'STUDENT') {
          router.push('/student');
        } else if (role === 'MENTOR') {
          router.push('/mentor');
        } else if (role === 'ASSISTENT') {
          router.push('/assistent');
        } else {
          router.push('/student');
        }
      } else {
        setError('Token topilmadi');
      }
    } catch (err: any) {
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
          <label className="text-sm font-bold text-gray-900">Telefon raqam <span className="text-red-600">*</span></label>
          <div className="relative">
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
              className="w-full py-3.5 pl-4 pr-10 border border-slate-200 rounded-xl text-[14px] outline-none text-[#1a1a1a] focus:border-[#4a86f7] transition-all placeholder:text-slate-700"
            />
            <Phone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900">Parol <span className="text-red-600">*</span></label>
            <button 
              type="button" 
              onClick={() => setIsForgotPasswordOpen(true)} 
              className="text-[12px] text-blue-600 hover:underline font-semibold"
            >
              Parolni unutdingizmi?
            </button>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
              className="w-full py-3.5 pl-4 pr-10 border border-slate-200 rounded-xl text-[14px] outline-none text-[#1a1a1a] focus:border-[#4a86f7] transition-all placeholder:text-slate-700"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-[#a30b15] hover:bg-[#850810] text-white rounded-xl py-4 px-4 text-[15px] font-bold mt-2 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? 'Kirilmoqda...' : 'Davom etish'}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>
      <p className="text-center text-xs text-slate-500 mt-5">
        Akkauntingiz yo'qmi? <Link href="/register" className="text-blue-500 font-medium hover:underline">Ro'yxatdan o'tish</Link>
      </p>

      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 relative">
            <button 
              onClick={() => setIsForgotPasswordOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Parolni tiklash</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Parolingizni tiklash uchun quyidagi Telegram botga kiring va ko'rsatmalarga amal qiling:
            </p>
            <div className="flex flex-col gap-3">
              <a 
                href="https://t.me/lms_n105_backend_bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-3 px-4 bg-[#2AABEE] hover:bg-[#229ED9] text-white rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                @lms_n105_backend_bot
              </a>
              <Link 
                href="/verify"
                onClick={() => {
                  if(phone) localStorage.setItem('resetPhone', phone);
                }}
                className="flex items-center justify-center w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Tasdiqlash
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
