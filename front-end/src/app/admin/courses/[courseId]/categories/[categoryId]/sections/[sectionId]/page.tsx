'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SectionPage({ params }: { params: { courseId: string, categoryId: string, sectionId: string } }) {
  return (
    <div>
      <PageHeader
        title={`Bo'lim tafsilotlari`}
        description="Tanlangan bo'lim bo'yicha darslar"
        breadcrumbs={[
          { label: 'Kurslar', href: '/admin/courses' },
          { label: 'Tafsilotlar', href: `/admin/courses/${params.courseId}` },
          { label: 'Kategoriya', href: `/admin/courses/${params.courseId}/categories/${params.categoryId}` },
          { label: 'Bo\'lim' }
        ]}
      />
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Bo'lim: {params.sectionId}</h3>
        
        <Link href={`/admin/courses/${params.courseId}/categories/${params.categoryId}/sections/${params.sectionId}/darslar`}>
          <Button>Darslarni ko'rish</Button>
        </Link>
      </div>
    </div>
  );
}
