import React from 'react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { StudentHeader } from '@/components/layout/StudentHeader';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <StudentSidebar />
      <div className="pl-[260px] flex flex-col min-h-screen">
        <StudentHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
