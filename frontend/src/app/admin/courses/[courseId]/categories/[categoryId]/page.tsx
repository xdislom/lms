'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CourseCategoryPage({ params }: { params: { courseId: string, categoryId: string } }) {
  return (
    <div>
      <PageHeader
        title={`Kurs kategoriyasi`}
        description="Kurs ichidagi kategoriya ma'lumotlari"
        breadcrumbs={[
          { label: 'Kurslar', href: '/admin/courses' },
          { label: 'Tafsilotlar', href: `/admin/courses/${params.courseId}` },
          { label: 'Kategoriya' }
        ]}
      />
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Kategoriya: {params.categoryId}</h3>
        
        <Link href={`/admin/courses/${params.courseId}/categories/${params.categoryId}/sections/1`}>
          <Button>Bo'limni ko'rish (Mock Data)</Button>
        </Link>
      </div>
    </div>
  );
}
