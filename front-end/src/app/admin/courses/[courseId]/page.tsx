'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Course, User } from '@/types';
import { coursesApi } from '@/lib/api/courses';

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesApi.getById(courseId)
      .then(setCourse)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

  const students: User[] = course?.users || [];

  const columns = [
    {
      key: 'name',
      header: 'Ism',
      render: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
            {row.file ? (
              <img
                src={`http://localhost:3001/uploads/images/${row.file}`}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || 'User')}&background=random`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="font-medium text-slate-800">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Telefon raqami',
      render: (row: User) => <span className="text-slate-500">{row.phone}</span>,
    },
    {
      key: 'price',
      header: 'Narxi',
      render: () => (
        <span className="text-slate-600">
          {course?.price
            ? Number(course.price).toLocaleString('uz-UZ').replace(/,/g, ' ')
            : '-'}
        </span>
      ),
    },
    {
      key: 'payment',
      header: "To'lov turi",
      render: () => (
        <span className="text-slate-600">Payme</span>
      ),
    },
    {
      key: 'create_at',
      header: 'Yaratilgan vaqt',
      render: (row: User) => (
        <span className="text-slate-500">
          {row.create_at
            ? new Date(row.create_at).toLocaleDateString('ru-RU')
            : '01.01.2024'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Kursda qatnashuvchilar"
        breadcrumbs={[
          { label: 'Kurslar', href: '/admin/courses' },
          { label: course?.name || '...' },
        ]}
      />
      <DataTable
        variant="courses"
        columns={columns}
        data={students}
        isLoading={loading}
        emptyTitle="Bu kursda hali o'quvchilar yo'q"
      />
    </div>
  );
}
