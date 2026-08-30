import React from 'react';
import { MentorSidebar } from '@/components/layout/MentorSidebar';
import { MentorHeader } from '@/components/layout/MentorHeader';

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <MentorSidebar />
      <div className="flex-1 flex flex-col pl-[260px]">
        <MentorHeader />
        <main className="flex-1 p-8 overflow-auto bg-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
}
