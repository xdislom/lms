'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { adminsApi } from '@/lib/api/admins';
import { mentorsApi } from '@/lib/api/mentors';
import { assistentsApi } from '@/lib/api/assistents';
import { studentsApi } from '@/lib/api/students';
import { coursesApi } from '@/lib/api/courses';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    admins: 0,
    mentors: 0,
    assistants: 0,
    students: 0,
    courses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminsApi.getAll().catch(() => []),
      mentorsApi.getAll().catch(() => []),
      assistentsApi.getAll().catch(() => []),
      studentsApi.getAll().catch(() => []),
      coursesApi.getAll().catch(() => []),
    ]).then(([admins, mentors, assistants, students, courses]) => {
      setStats({
        admins: admins.length,
        mentors: mentors.length,
        assistants: assistants.length,
        students: students.length,
        courses: courses.length,
      });
      setLoading(false);
    });
  }, []);

  const statItems = [
    { title: 'Jami Administratorlar', value: stats.admins },
    { title: 'Jami Mentorlar', value: stats.mentors },
    { title: 'Jami Assistentlar', value: stats.assistants },
    { title: "Jami O'quvchilar", value: stats.students },
    { title: 'Jami Kurslar', value: stats.courses },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asosiy"
        breadcrumbs={[
          { label: 'Boshqaruv paneli' },
          { label: '' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statItems.map((item, i) => (
          <div
            key={i}
            className="p-6 bg-white border border-slate-100 rounded-[16px] shadow-sm flex flex-col justify-between min-h-[110px]"
          >
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-8 bg-slate-200 rounded w-12"></div>
                <div className="h-4 bg-slate-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <h3 className="text-[28px] font-bold text-slate-800 leading-none">
                  {item.value}
                </h3>
                <p className="text-[13px] font-medium text-slate-500 mt-3">
                  {item.title}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
