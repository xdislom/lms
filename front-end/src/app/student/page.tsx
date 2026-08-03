'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { BookOpen, Video, FileText } from 'lucide-react';

export default function StudentDashboard() {
  const myCourses = [
    { id: 1, title: 'Frontend ReactJS', progress: 45, nextLesson: 'React Hooks' },
    { id: 2, title: 'UI/UX Design', progress: 12, nextLesson: 'Figma Asoslari' },
  ];

  return (
    <div className="min-h-screen bg-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader 
          title="Mening Kurslarim" 
          description="Siz obuna bo'lgan barcha o'quv dasturlari" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.map((course) => (
            <div key={course.id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-40 bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-primary/40" />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-lg">{course.title}</h3>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">O'zlashtirish</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Video className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Navbatdagi dars:</span>
                    <span className="font-medium">{course.nextLesson}</span>
                  </div>
                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
                    Davom ettirish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
