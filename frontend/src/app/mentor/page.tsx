'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, ShoppingBag, Star } from 'lucide-react';
import { mentorsApi } from '@/lib/api/mentors';

export default function MentorDashboardPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.phone || 'Mentor'); // Assuming we use phone or some other field if name isn't there
      }
    } catch (e) {
      // ignore
    }

    const fetchCourses = async () => {
      try {
        const data = await mentorsApi.getAllMyCourses();
        console.log('API dan kelgan ma`lumot:', data);
        
        let coursesArray = [];
        if (Array.isArray(data)) {
          coursesArray = data;
        } else if (data && Array.isArray(data.cources)) {
          coursesArray = data.cources;
        } else if (data && data.mentor && Array.isArray(data.mentor.cources)) {
          coursesArray = data.mentor.cources;
        } else if (data && data.mentor && Array.isArray(data.mentor.courses)) {
          coursesArray = data.mentor.courses;
        } else if (data && Array.isArray(data.courses)) {
          coursesArray = data.courses;
        } else if (data && Array.isArray(data.data)) {
          coursesArray = data.data;
        } else if (data && typeof data === 'object') {
          // just in case it's nested deeper
          const possibleArray = Object.values(data).find(val => Array.isArray(val));
          if (possibleArray) coursesArray = possibleArray as any[];
        }

        setCourses(coursesArray);
      } catch (err: any) {
        console.error('Kurslarni olishda xatolik:', err);
        setError(err.response?.data?.message || err.message || 'Xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const validCourses = Array.isArray(courses) ? courses : [];
  const totalCourses = validCourses.length;
  // Assume all fetched are published for now unless we have a status field
  const publishedCourses = validCourses.length; 
  // Assume mock values for purchases and ratings if not provided by api
  const totalPurchases = validCourses.reduce((acc, c) => acc + (c.users?.length || c.purchases || 0), 0) || 0;
  const totalRatings = 0;

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto">
      {/* Welcome Section */}
      <div>
        <h1 className="text-[28px] font-bold text-slate-900 mb-2">Xush kelibsiz{userName ? `, ${userName}` : ''}!</h1>
        <p className="text-slate-500 text-[15px]">
          Bu yerda o'zingizga tegishli kurslar va o'quvchilarni boshqarishingiz mumkin.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-[24px] font-bold text-slate-800 leading-none mb-1">{totalCourses}</div>
            <div className="text-sm font-medium text-slate-500">Jami Kurslar</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-[24px] font-bold text-slate-800 leading-none mb-1">{publishedCourses}</div>
            <div className="text-sm font-medium text-slate-500">Nashr qilingan</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
            <ShoppingBag size={24} />
          </div>
          <div>
            <div className="text-[24px] font-bold text-slate-800 leading-none mb-1">{totalPurchases}</div>
            <div className="text-sm font-medium text-slate-500">Sotib olganlar</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-400">
            <Star size={24} />
          </div>
          <div>
            <div className="text-[24px] font-bold text-slate-800 leading-none mb-1">{totalRatings}</div>
            <div className="text-sm font-medium text-slate-500">Jami baholar</div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Mening kurslarim</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Yuklanmoqda...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : validCourses.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Hozircha kurslar mavjud emas</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">KURS</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">KATEGORIYA</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">NARXI</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">DARAJASI</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">HOLATI</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SOTIB OLGAN</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">BAHO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {validCourses.map((course: any, idx: number) => {

                  const getInitial = (name: string) => {
                    return name ? name.substring(0, 2).toUpperCase() : 'KU';
                  };

                  return (
                    <tr key={course.id || idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {course.banner ? (
                            <img src={course.banner.startsWith('http') ? course.banner : `http://localhost:4000/${course.banner}`} alt={course.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                              <span className="text-xs">{getInitial(course.name)}</span>
                            </div>
                          )}
                          <span className="font-bold text-slate-800">{course.name || 'Nomsiz kurs'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                        {course.category?.name || course.categoryId || 'Kategoriyasiz'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                        {course.price ? `${Number(course.price).toLocaleString()} so'm` : "Bepul"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                          {course.level || 'Noma\'lum'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                          Nashr qilingan
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-medium text-center">
                        {course.users?.length || course.purchases || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-slate-800 font-bold text-sm">
                          <Star size={14} className="text-orange-400 fill-orange-400" />
                          {course.rating || 0}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
