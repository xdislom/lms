'use client';

import React from 'react';
import { Users, GraduationCap, BookOpen, Layers } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: 'Jami o\'quvchilar', value: '1,245', icon: <GraduationCap className="w-8 h-8 text-blue-500" /> },
    { title: 'Jami kurslar', value: '34', icon: <BookOpen className="w-8 h-8 text-green-500" /> },
    { title: 'Mentorlar', value: '12', icon: <Users className="w-8 h-8 text-purple-500" /> },
    { title: 'Kategoriyalar', value: '8', icon: <Layers className="w-8 h-8 text-orange-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-card border rounded-lg shadow-sm flex items-center gap-4">
            <div className="p-3 bg-muted rounded-full">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-card border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">So'nggi ro'yxatdan o'tganlar</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    O'
                  </div>
                  <div>
                    <p className="font-medium">O'quvchi {i}</p>
                    <p className="text-sm text-muted-foreground">oquvchi{i}@gmail.com</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Bugun</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Ommabop kurslar</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2 pb-4 border-b last:border-0 last:pb-0">
                <div className="flex justify-between">
                  <p className="font-medium">Frontend React {i}</p>
                  <p className="font-bold">{120 - i * 10} o'quvchi</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${80 - i * 10}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
