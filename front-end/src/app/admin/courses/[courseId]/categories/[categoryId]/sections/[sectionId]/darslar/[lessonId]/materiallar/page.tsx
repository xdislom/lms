'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FileUpload } from '@/components/shared/FileUpload';

export default function MateriallarPage({ params }: { params: { courseId: string, categoryId: string, sectionId: string, lessonId: string } }) {
  return (
    <div>
      <PageHeader
        title={`Dars materiallari`}
        description="Dars uchun qo'shimcha fayllar va materiallar yuklash"
        breadcrumbs={[
          { label: 'Darslar', href: `/admin/courses/${params.courseId}/categories/${params.categoryId}/sections/${params.sectionId}/darslar` },
          { label: 'Materiallar' }
        ]}
      />
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Material yuklash</h3>
        <FileUpload onFileSelect={(file) => console.log(file)} label="Yangi material qo'shish" />
      </div>
    </div>
  );
}
