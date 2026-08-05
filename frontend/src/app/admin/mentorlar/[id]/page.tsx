'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';

export default function MentorDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <PageHeader
        title={`Mentor profili`}
        description="Mentorning shaxsiy ma'lumotlari va kurslari"
        breadcrumbs={[
          { label: 'Mentorlar', href: '/admin/mentorlar' },
          { label: 'Profil' }
        ]}
      />
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Mentor ID: {params.id}</h3>
        <p className="text-muted-foreground">Tez orada mentor haqida to'liq ma'lumot shu yerda bo'ladi.</p>
      </div>
    </div>
  );
}
