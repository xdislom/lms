'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, Loader2 } from 'lucide-react';
import { purchasesApi } from '@/lib/api/purchases';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          router.push('/login');
          return;
        }
        
        const user = JSON.parse(userStr);
        const purchases = await purchasesApi.getByUserId(user.id);
        
        // Filter only completed/approved courses
        const completedCourses = purchases.filter((p: any) => 
          p.status === 'COMPLETED' || p.status === 'APPROVED' || p.status === 'approved'
        );
        
        setMyCourses(completedCourses);
      } catch (error) {
        console.error('Kurslarni yuklashda xatolik:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  return (
    <div className="p-8 pb-20">
      <h1 className="text-[20px] font-bold text-slate-900 mb-6 font-sans">Mening kurslarim</h1>
      
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : myCourses.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center text-slate-500 shadow-sm border border-slate-100">
          Hali hech qanday kurs sotib olmagansiz yoki to'lovingiz tasdiqlanmoqda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myCourses.map((purchase) => {
            const course = purchase.cource || {};
            const categoryName = course.category?.name || 'Umumiy';
            // Placeholder values for mentor and progress since they might not be in the purchase API response
            const authorName = course.mentor?.user?.name || 'Mentor';
            const progress = 0; // default for now

            return (
              <div key={`${purchase.userId}-${purchase.courceId}`} className="bg-white rounded-[14px] overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col font-sans">
                {/* Image section */}
                <div className="relative h-44 bg-slate-100 w-full">
                  {course.banner ? (
                    <img 
                      src={`http://localhost:4000/uploads/images/${course.banner}`} 
                      alt={course.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image 
                      src="/api/placeholder/400/240" 
                      alt={course.name || 'Course'} 
                      fill 
                      className="object-cover"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 bg-[#22c55e] text-white text-[11px] font-bold rounded-full tracking-wide">
                      {categoryName}
                    </span>
                  </div>
                </div>
                
                {/* Content section */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Author and Like */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`} 
                          alt={authorName} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <span className="text-[13px] font-bold text-slate-800">{authorName}</span>
                    </div>
                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                      <Heart className="w-[18px] h-[18px]" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[16px] text-slate-900 mb-6">{course.name || 'Nomsiz kurs'}</h3>
                  
                  <div className="mt-auto space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-semibold">Ko'rildi:</span>
                        <span className="font-bold text-slate-700">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-[#3b82f6] h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>

                    {/* Button */}
                    <button 
                      onClick={() => router.push(`/student/courses/${purchase.courceId}`)}
                      className="w-full py-2.5 bg-[#3b82f6] text-white rounded-lg font-semibold text-[13px] hover:bg-blue-600 transition-colors"
                    >
                      Ko'rishni boshlash
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
