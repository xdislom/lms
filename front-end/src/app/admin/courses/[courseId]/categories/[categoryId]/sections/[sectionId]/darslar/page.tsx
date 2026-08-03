'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function DarslarPage({ params }: { params: { courseId: string, categoryId: string, sectionId: string } }) {
  return (
    <div>
      <PageHeader
        title={`Darslar ro'yxati`}
        description="Bo'limga tegishli barcha darslar"
        action={<Button><Plus className="w-4 h-4 mr-2" /> Dars qo'shish</Button>}
        breadcrumbs={[
          { label: 'Kurslar', href: '/admin/courses' },
          { label: 'Bo\'lim', href: `/admin/courses/${params.courseId}/categories/${params.categoryId}/sections/${params.sectionId}` },
          { label: 'Darslar' }
        ]}
      />
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Mavjud darslar</h3>
        
        <div className="flex gap-4 border-b pb-4 mb-4 items-center justify-between">
           <div>
             <h4 className="font-semibold">1-dars: Kirish</h4>
             <p className="text-sm text-muted-foreground">React asoslari bilan tanishuv</p>
           </div>
           <Link href={`/admin/courses/${params.courseId}/categories/${params.categoryId}/sections/${params.sectionId}/darslar/1/materiallar`}>
             <Button variant="outline">Materiallar</Button>
           </Link>
        </div>
      </div>
    </div>
  );
}
