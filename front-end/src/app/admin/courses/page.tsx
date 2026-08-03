'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { FileText, Edit2, Trash2, Upload, X, CheckCircle2 } from 'lucide-react';
import { Course, Category, Mentor } from '@/types';
import { coursesApi } from '@/lib/api/courses';
import { categoriesApi } from '@/lib/api/categories';
import { mentorsApi } from '@/lib/api/mentors';
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

/* ─── File Upload Zone ─────────────────────────────── */
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

/* ─── Main Page ────────────────────────────────────── */
export default function CoursesPage() {
  const [data, setData] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: '',
    price: '',
    categoryId: '',
    mentorId: '',
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      coursesApi.getAll(),
      categoriesApi.getAll(),
      mentorsApi.getAll(),
    ])
      .then(([coursesRes, categoriesRes, mentorsRes]) => {
        setData(coursesRes);
        setCategories(categoriesRes);
        setMentors(mentorsRes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({ name: '', description: '', level: '', price: '', categoryId: '', mentorId: '' });
    setBannerFile(null);
    setVideoFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description,
      level: course.level || '',
      price: course.price.toString(),
      categoryId: course.categoryId?.toString() || '',
      mentorId: course.mentorId?.toString() || '',
    });
    setBannerFile(null);
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
      if (editingCourse) {
        // PATCH: backend spreads payload directly into Prisma.
        // Prisma model has: name, description, level, price (direct fields).
        // categoriesId & mentorId cause "Unknown arg" errors in Prisma → 500.
        // Only send the safe text/number fields.
        // PATCH: only send fields that have actually changed
        const patchData: any = {};
        if (formData.name !== editingCourse.name) patchData.name = formData.name;
        if (formData.description !== editingCourse.description) patchData.description = formData.description;
        if (formData.level !== editingCourse.level) patchData.level = formData.level;
        if (Number(formData.price) !== Number(editingCourse.price)) patchData.price = Number(formData.price);

        // If no fields changed, just close modal
        if (Object.keys(patchData).length === 0) {
          setIsModalOpen(false);
          setIsSaving(false);
          return;
        }

        await coursesApi.update(editingCourse.id.toString(), patchData);
      } else {
        // POST accepts multipart/form-data with files
        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('description', formData.description);
        fd.append('level', formData.level);
        fd.append('price', formData.price);
        fd.append('categoriesId', formData.categoryId);
        fd.append('mentorId', formData.mentorId);
        if (bannerFile) fd.append('banner', bannerFile);
        if (videoFile) fd.append('intro_video', videoFile);
        await coursesApi.create(fd);
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
      await coursesApi.delete(selectedId.toString());
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert('Xatolik yuz berdi');
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid =
    formData.name && formData.description && formData.level &&
    formData.price && formData.categoryId && formData.mentorId &&
    (editingCourse || (bannerFile && videoFile));

  const columns = [
    {
      key: 'checkbox',
      header: '',
      render: () => (
        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500 cursor-pointer" />
      ),
    },
    {
      key: 'banner',
      header: 'Banner',
      render: (row: Course) => (
        <div className="w-16 h-10 rounded-lg overflow-hidden bg-gradient-to-r from-blue-400 to-indigo-500">
          {row.banner && row.banner !== '' && row.banner !== 'default.jpg' ? (
            <img src={`http://localhost:3001/uploads/images/${row.banner}`} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Kurs nomi',
      render: (row: Course) => (
        <Link href={`/admin/courses/${row.id}`} className="font-semibold text-slate-800 hover:text-blue-500 transition-colors">
          {row.name}
        </Link>
      ),
    },
    {
      key: 'sections',
      header: "Bo'limlar",
      render: (row: Course) => (
        <Link href={`/admin/courses/${row.id}/sections`} className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors">
          <span className="text-[13px] font-medium">Batafsil</span>
          <FileText className="w-4 h-4" />
        </Link>
      ),
    },
    {
      key: 'level',
      header: 'Darajasi',
      render: (row: Course) => (
        <span className="text-slate-600 capitalize">
          {row.level?.toLowerCase().replace(/_/g, ' ') || 'Beginner'}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Narxi',
      render: (row: Course) => (
        <span className="text-slate-600">
          {Number(row.price).toLocaleString('uz-UZ').replace(/,/g, ' ')}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Kategoriya',
      render: (row: Course) => (
        <span className="text-slate-400">{row.category?.name || '—'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Holati',
      render: () => (
        <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-500">
          Faol
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Amallar',
      render: (row: Course) => (
        <div className="flex items-center gap-2 text-slate-400">
          <button onClick={() => openEditModal(row)} className="hover:text-slate-600 p-1">
            <Edit2 className="w-[18px] h-[18px]" />
          </button>
          <button onClick={() => openDeleteModal(row.id)} className="hover:text-red-500 p-1">
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Kurslar"
        breadcrumbs={[{ label: 'Kurslar' }, { label: 'Barcha kurslar' }]}
        action={
          <Button onClick={openAddModal} className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold">
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white text-white font-bold text-xs mr-2 pb-px">+</span>
            Qo'shish
          </Button>
        }
      />
      <DataTable variant="courses" columns={columns} data={data} isLoading={loading} emptyTitle="Kurslar topilmadi" />

      {/* ── Add / Edit Modal ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white max-h-[92vh] overflow-y-auto">
          <DialogHeader className="pb-2 border-b border-slate-100">
            <DialogTitle className="text-[17px] font-bold text-slate-800">
              {editingCourse ? 'Kursni tahrirlash' : "Qo'shish"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5 py-4">
            {/* Banner + Intro video row */}
            <div className="grid grid-cols-2 gap-4">
              <FileUploadZone
                label="Banner"
                accept="image/svg+xml,image/png,image/jpeg,image/gif"
                hint="SVG, PNG, JPG or GIF (max. 800×400px)"
                file={bannerFile}
                onChange={setBannerFile}
              />
              <FileUploadZone
                label="Intro video"
                accept="video/mp4"
                hint=".mp4 fayl kengaytma mumkin (max. 5 Mb)"
                file={videoFile}
                onChange={setVideoFile}
              />
            </div>

            {/* Kurs nomi */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Kurs nomi</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Kiriting"
                className="h-11 rounded-xl border-slate-200 focus:border-blue-400"
              />
            </div>

            {/* Kurs haqida */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Kurs haqida</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kiriting"
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-400 resize-none transition-all"
              />
            </div>

            {/* Daraja + Narxi */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-semibold text-slate-700">Darajasi</Label>
                <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:border-blue-400">
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="ELEMENTRY">Elementary</SelectItem>
                    <SelectItem value="PRE_INTERMIDIATE">Pre-Intermediate</SelectItem>
                    <SelectItem value="INTERMIDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="price" className="text-sm font-semibold text-slate-700">Narxi</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="h-11 rounded-xl border-slate-200 focus:border-blue-400 pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-slate-400 font-medium pointer-events-none">
                    so'm
                  </span>
                </div>
              </div>
            </div>

            {/* Kategoriya */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-slate-700">Kategoriya</Label>
              <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:border-blue-400">
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mentor */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-slate-700">Mentor</Label>
              <Select value={formData.mentorId} onValueChange={(v) => setFormData({ ...formData, mentorId: v })}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:border-blue-400">
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((m) => (
                    <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100">
            <Button
              onClick={handleSave}
              disabled={isSaving || !isFormValid}
              className="w-auto bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 h-11 font-semibold flex items-center gap-2"
            >
              {isSaving ? (
                'Saqlanmoqda...'
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Saqlash
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-sm bg-white">
          <DialogHeader>
            <DialogTitle>Tasdiqlang</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-600">
            Haqiqatan ham bu kursni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Bekor qilish</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "O'chirilmoqda..." : "O'chirish"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
