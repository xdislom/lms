'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Loader2, SlidersHorizontal, Search, ArrowDownToLine, FileVideo, Upload, X, CheckCircle2 } from 'lucide-react';
import { Lesson, Section } from '@/types';
import { lessonsApi } from '@/lib/api/lessons';
import { sectionsApi } from '@/lib/api/sections';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/* в”Ђв”Ђв”Ђ File Upload Zone в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */
function FileUploadZone({
  label,
  accept,
  hint,
  file,
  onChange,
}: {
  label: string;
  accept: string;
  hint: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <div
        onClick={() => ref.current?.click()}
        className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-5 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all min-h-[110px]"
      >
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <span className="text-[12px] text-slate-600 text-center font-medium break-all px-2">
              {file.name}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <Upload className="w-7 h-7 text-blue-400" />
            <p className="text-[12px] text-center text-slate-500">
              <span className="text-blue-500 font-semibold">Bu yerga bosing</span> yoki faylni suring
            </p>
            <p className="text-[11px] text-slate-400 text-center">{hint}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function CategoryLessonsPage({
  params,
}: {
  params: Promise<{ courseId: string; sectionId: string }>;
}) {
  const { courseId, sectionId } = React.use(params);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [section, setSection] = useState<Section | null>(null);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      lessonsApi.getBySection(sectionId),
      sectionsApi.getOne(sectionId),
    ])
      .then(([lessonsRes, sectionRes]) => {
        setLessons(lessonsRes);
        setSection(sectionRes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [courseId, sectionId]);

  const openAddModal = () => {
    setEditingLesson(null);
    setFormData({ name: '', description: '' });
    setVideoFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({ name: lesson.name, description: lesson.description });
    setVideoFile(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingLesson) {
        // Edit is application/json but using formData format since backend has only PATCH logic
        // If the backend doesn't support changing video via PATCH, we only update text.
        // The backend controller for updateLesson takes UpdateLessonDto (JSON). 
        // We will send JSON for patch.
        await lessonsApi.update(editingLesson.id.toString(), {
          name: formData.name,
          description: formData.description,
          sectionId: Number(sectionId)
        });
      } else {
        // Create is multipart/form-data
        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('description', formData.description);
        fd.append('sectionId', sectionId);
        if (videoFile) fd.append('intro_video', videoFile);
        
        await lessonsApi.create(fd);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert('Xatolik yuz berdi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setIsSaving(true);
    try {
      await lessonsApi.delete(selectedId.toString());
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert('Xatolik yuz berdi');
    } finally {
      setIsSaving(false);
    }
  };

  // require video only when creating
  const isFormValid = formData.name && formData.description && (editingLesson || videoFile);

  return (
    <div>
      <PageHeader
        title="Darslar"
        breadcrumbs={[
          { label: 'Kurslar', href: '/admin/courses' },
          { label: "Bo'limlar", href: `/admin/courses/${courseId}/sections` },
          { label: section?.name || '...', href: `/admin/courses/${courseId}/sections` },
          { label: "Darslar" },
        ]}
        action={
          <Button
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white text-white font-bold text-xs mr-2 pb-px">
              +
            </span>
            Dars qo'shish
          </Button>
        }
      />

      {/* Table Card */}
      <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 p-6">
        {/* Top toolbar */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between py-4 border-b border-slate-200 gap-4 xl:gap-0">
          {/* Left: search */}
          <div className="relative w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Izlash"
              className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] outline-none focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
            />
            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer" />
          </div>

          {/* Right: pagination controls */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-slate-500">Bir sahifada:</span>
              <Select defaultValue="10">
                <SelectTrigger className="h-8 w-[70px] text-[13px] bg-transparent border-none shadow-none focus:ring-0 p-0 font-medium">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1 text-[13px] font-medium text-slate-500">
              <button className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center text-slate-800">1</button>
              <button className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center">2</button>
              <button className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center">3</button>
              <span className="px-1">..</span>
              <button className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center">15</button>
              <button className="ml-2 hover:text-slate-800">Keyingi</button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
              <p className="text-slate-500 text-sm">Yuklanmoqda...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48">
              <p className="text-slate-500 text-sm">Darslar topilmadi</p>
            </div>
          ) : (
            <table className="w-full text-[13px] text-left">
              <thead>
                <tr>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">
                    <div className="flex items-center gap-2">
                      Biriktirilgan kurs <ArrowDownToLine className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">
                    <div className="flex items-center gap-2">
                      Dars mavzusi <ArrowDownToLine className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">
                    <div className="flex items-center gap-2">
                      Dars haqida <ArrowDownToLine className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">
                    <div className="flex items-center gap-2">
                      Dars video fayli <ArrowDownToLine className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">
                    Materiallar
                  </th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100 text-center">
                    Vazifalar
                  </th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100 text-center">
                    Imtihonlar
                  </th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100 text-right">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr
                    key={lesson.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-slate-700 font-medium">{section?.name || '-'}</td>
                    <td className="px-4 py-4 text-slate-700 font-medium">{lesson.name}</td>
                    <td className="px-4 py-4 text-slate-500 max-w-[250px] truncate">{lesson.description}</td>
                    <td className="px-4 py-4">
                      {lesson.introVideo ? (
                         <button 
                           onClick={() => setPreviewVideo(`http://localhost:4000/uploads/videos/${lesson.introVideo}`)}
                           className="flex items-center gap-2 text-blue-500 bg-blue-50/50 hover:bg-blue-100/50 transition-colors px-3 py-1.5 rounded-lg w-max"
                         >
                           <FileVideo className="w-4 h-4" />
                           <span className="font-semibold text-xs">Video</span>
                         </button>
                      ) : (
                         <span className="text-slate-400 text-xs">Fayl yo'q</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}/materials`}>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-8 px-4 text-[12px] font-semibold">
                          Biriktirish
                        </Button>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Link href={`/admin/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}/homeworks`}>
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full h-8 px-4 text-[12px] font-semibold">
                          Vazifalar
                        </Button>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Link href={`/admin/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}/exams`}>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-full h-8 px-4 text-[12px] font-semibold">
                          Imtihonlar
                        </Button>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end text-slate-400">
                        <button
                          onClick={() => openEditModal(lesson)}
                          className="hover:text-slate-600 p-1 bg-slate-50 rounded-full"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(lesson.id)}
                          className="hover:text-red-500 p-1 bg-slate-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Bottom toolbar */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between py-4 border-t border-slate-200 gap-4 xl:gap-0 mt-4">
          <div className="flex items-center gap-6">
            <span className="text-[13px] font-medium text-slate-800">
              Sahifada 0-10 gacha. Umumiy {lessons.length}ta
            </span>
            <button className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors">
              <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">X</span>
              </div>
              (2) Yuklab olish .XLS
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-slate-500">Bir sahifada:</span>
              <Select defaultValue="10">
                <SelectTrigger className="h-8 w-[70px] text-[13px] bg-transparent border-none shadow-none focus:ring-0 p-0 font-medium">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1 text-[13px] font-medium text-slate-500">
              <button className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center text-slate-800">1</button>
              <button className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center">2</button>
              <button className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center">3</button>
              <span className="px-1">..</span>
              <button className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center">15</button>
              <button className="ml-2 hover:text-slate-800">Keyingi</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-bold text-slate-800">
              {editingLesson ? "Darsni tahrirlash" : "Dars qo'shish"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-slate-700">Biriktirilgan bo'lim</Label>
              <Select value={sectionId} disabled>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-600">
                  <SelectValue>{section?.name || "Bo'lim"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={sectionId}>{section?.name || ''}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lessonName" className="text-sm font-semibold text-slate-700">Dars mavzusi</Label>
              <Input
                id="lessonName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Kiriting"
                className="h-11 rounded-xl border-slate-200 focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lessonDesc" className="text-sm font-semibold text-slate-700">Dars haqida</Label>
              <textarea
                id="lessonDesc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kiriting"
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-400 resize-none transition-all"
              />
            </div>

            {!editingLesson && (
              <FileUploadZone
                label="Dars video fayli"
                accept="video/mp4"
                hint=".mp4 fayl kengaytma mumkin (max. 50 Mb)"
                file={videoFile}
                onChange={setVideoFile}
              />
            )}
          </div>
          <div className="flex gap-3 pt-1">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 h-11 font-semibold flex items-center gap-2"
              onClick={handleSave}
              disabled={isSaving || !isFormValid}
            >
              {isSaving ? 'Saqlanmoqda...' : (
                <><span className="text-lg leading-none">вњ“</span> Saqlash</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-sm bg-white">
          <DialogHeader>
            <DialogTitle>Tasdiqlang</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-600">
            Haqiqatan ham bu darsni o'chirmoqchimisiz?
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "O'chirilmoqda..." : "O'chirish"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Preview Modal */}
      <Dialog open={!!previewVideo} onOpenChange={(open) => !open && setPreviewVideo(null)}>
        <DialogContent className="sm:max-w-2xl bg-black border-none p-0 overflow-hidden">
          {previewVideo && (
            <video 
              src={previewVideo} 
              controls 
              autoPlay 
              className="w-full max-h-[80vh] bg-black"
            >
              Brauzeringiz videoni qollab quvvatlamaydi.
            </video>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

