'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Phone, Eye, EyeOff, ArrowRight, X, Copy, Send } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { purchasesApi } from '@/lib/api/purchases';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== confirmPassword) {
      setError('Parollar mos tushmadi');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const pendingCourseId = localStorage.getItem('pendingCourseId');
      const payload = {
        ...form,
        courceId: pendingCourseId ? Number(pendingCourseId) : undefined
      };
      
      await authApi.register(payload);
      setShowModal(true);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setError('');
    try {
      const requestData = { phone: form.phone, otp: code.replace(/\D/g, '') };
      console.log('📤 OTP request:', requestData);

      const res = await authApi.verifyOtp(requestData);
      console.log('📥 OTP response:', res);

      if (res.success) {
        console.log('✅ OTP tasdiqlandi:', res.message);

        // Login qilib token olish
        try {
          const loginRes = await authApi.login({ phone: form.phone, password: form.password });
          if (loginRes.accessToken) {
            localStorage.setItem('access_token', loginRes.accessToken);

            // JWT decode
            const payloadBase64 = loginRes.accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const decodedJson = decodeURIComponent(
              atob(payloadBase64).split('').map((c) =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
              ).join('')
            );
            const decodedData = JSON.parse(decodedJson);
            const userData = { id: decodedData.id, phone: decodedData.phone, role: decodedData.role };
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('👤 User:', userData);

            // Backend /auth/register ni o'zida courceId ni qabul qilib purchase yaratadi,
            // shuning uchun bu yerda yana API chaqirmaymiz. Faqat tozalab qo'yamiz.
            localStorage.removeItem('pendingCourseId');
          }
        } catch (loginErr) {
          console.error('Auto-login error:', loginErr);
        }

        setShowModal(false);
        setShowSuccess(true);
      } else {
        console.warn('⚠️ OTP tasdiqlanmadi. Full response:', res);
        setError(res.message || 'Tasdiqlash muvaffaqiyatsiz');
      }
    } catch (err: any) {
      console.error('❌ OTP verify error:', err);
      console.error('❌ Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Kod noto\'g\'ri');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-[26px] font-bold text-[#1a1a1a] mb-[30px] text-center">Ro'yxatdan o'tish</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</div>}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-900">To'liq ismingizni kiriting <span className="text-red-600">*</span></label>
          <div className="relative">
            <input 
              type="text" 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              required 
              className="w-full py-3.5 pl-4 pr-10 border border-slate-200 rounded-xl text-[14px] outline-none text-[#1a1a1a] focus:border-[#4a86f7] transition-all placeholder:text-slate-700"
            />
            <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-900">Telefon raqamingiz <span className="text-red-600">*</span></label>
          <div className="relative">
            <input 
              type="tel" 
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              required 
              className="w-full py-3.5 pl-4 pr-10 border border-slate-200 rounded-xl text-[14px] outline-none text-[#1a1a1a] focus:border-[#4a86f7] transition-all placeholder:text-slate-700"
            />
            <Phone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-900">Parolni kiriting <span className="text-red-600">*</span></label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              placeholder="••••••••" 
              required 
              className="w-full py-3.5 pl-4 pr-10 border border-slate-200 rounded-xl text-[14px] outline-none text-[#1a1a1a] focus:border-[#4a86f7] transition-all placeholder:text-slate-700"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-900">Parolni tasdiqlang <span className="text-red-600">*</span></label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••" 
              required 
              className="w-full py-3.5 pl-4 pr-10 border border-slate-200 rounded-xl text-[14px] outline-none text-[#1a1a1a] focus:border-[#4a86f7] transition-all placeholder:text-slate-700"
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-[#a30b15] hover:bg-[#850810] text-white rounded-xl py-4 px-4 text-[15px] font-bold mt-2 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? 'Yaratilmoqda...' : 'Davom etish'}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>
      <p className="text-center text-xs text-slate-500 mt-5">
        Menda hisob mavjud! <Link href="/login" className="text-blue-500 font-medium hover:underline">Kirish</Link>
      </p>

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-[420px] relative shadow-xl">
            <button 
              onClick={() => {
                setShowModal(false);
                setError('');
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-4 mt-2">Tasdiqlash kodi</h2>
            {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg mb-4">{error}</div>}
            
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-bold text-gray-900">
                Tasdiqlash kodi <span className="text-[#a30b15]">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456" 
                  maxLength={6}
                  className="w-full py-4 pl-4 pr-12 border border-slate-200 rounded-xl text-[15px] font-medium tracking-[0.2em] outline-none text-[#1a1a1a] focus:border-[#4a86f7] transition-all placeholder:text-slate-400 placeholder:tracking-normal"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900">
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Tasdiqlash kodi kiritilgan telefon raqamining telegram akkaunti orqali telegram bot: <span className="text-[#a30b15] font-bold">@lms_n105_backend_bot</span> dan tasdiqlash kodini oling!
            </p>

            <button 
              onClick={handleVerify}
              disabled={isLoading || code.length < 6}
              className="w-full bg-[#a30b15] hover:bg-[#850810] text-white rounded-xl py-4 px-4 text-[15px] font-bold transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? 'Tekshirilmoqda...' : 'Davom etish'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-[420px] relative shadow-xl text-center">
            <button
              onClick={() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const role = (user.role || '').toUpperCase();
                if (role === 'ADMIN' || role === 'SUPERADMIN') router.push('/admin/administratorlar');
                else if (role === 'MENTOR') router.push('/mentor');
                else if (role === 'ASSISTENT') router.push('/assistent');
                else router.push('/student');
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mx-auto mb-5">
              <Send size={28} className="text-green-500 -rotate-12" />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
              Ro'yxatdan muvaffaqiyatli o'tdingiz!
            </h2>
            <p className="text-sm text-slate-500 mb-1">
              Kursni xarid qilish uchun adminga murojaat qiling:
            </p>
            <p className="text-[#a30b15] font-bold text-base mb-6">
              @iskandarovi15
            </p>

            <a
              href="https://t.me/iskandarovi15"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#4a86f7] hover:bg-[#3570e0] text-white rounded-xl py-4 px-4 text-[15px] font-bold transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <Send size={18} />
              Telegramga o'tish
            </a>

            <button
              onClick={() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const role = (user.role || '').toUpperCase();
                if (role === 'ADMIN' || role === 'SUPERADMIN') router.push('/admin/administratorlar');
                else if (role === 'MENTOR') router.push('/mentor');
                else if (role === 'ASSISTENT') router.push('/assistent');
                else router.push('/student');
              }}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Keyinroq
            </button>
          </div>
        </div>
      )}
    </>
  );
}
