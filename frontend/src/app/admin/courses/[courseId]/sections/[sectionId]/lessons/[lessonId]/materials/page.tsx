'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Loader2, FileText, Upload, X, CheckCircle2, FileArchive, FileIcon } from 'lucide-react';
import { Material, Lesson } from '@/types';
import { materialsApi } from '@/lib/api/materials';
import { lessonsApi } from '@/lib/api/lessons';
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

export default function MaterialsPage({
  params,
}: {
  params: Promise<{ courseId: string; sectionId: string; lessonId: string }>;
}) {
  const { courseId, sectionId, lessonId } = React.use(params);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const [formData, setFormData] = useState({ description: '' });
  const [file, setFile] = useState<File | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      materialsApi.getByLesson(lessonId),
      lessonsApi.getOne(lessonId),
    ])
      .then(([matsRes, lessonRes]) => {
        setMaterials(matsRes);
        setLesson(lessonRes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [courseId, sectionId, lessonId]);

  const openAddModal = () => {
    setEditingMaterial(null);
    setFormData({ description: '' });
    setFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (material: Material) => {
    setEditingMaterial(material);
    setFormData({ description: material.description });
    setFile(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingMaterial) {
        await materialsApi.update(editingMaterial.id.toString(), {
          description: formData.description,
          lessonId: Number(lessonId),
        });
      } else {
        const fd = new FormData();
        fd.append('description', formData.description);
        fd.append('lessonId', lessonId);
        if (file) fd.append('file', file);
        await materialsApi.create(fd);
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
      await materialsApi.delete(selectedId.toString());
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert('Xatolik yuz berdi');
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = formData.description && (editingMaterial || file);

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="w-4 h-4 text-red-500" />;
    if (ext === 'zip') return <FileArchive className="w-4 h-4 text-yellow-500" />;
    if (ext === 'txt') return <FileText className="w-4 h-4 text-slate-500" />;
    return <FileIcon className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div>
      <PageHeader
        title="Darslar"
        breadcrumbs={[
          { label: 'Kurslar', href: '/admin/courses' },
          { label: "Bo'limlar", href: `/admin/courses/${courseId}/sections` },
          { label: "Darslar", href: `/admin/courses/${courseId}/sections/${sectionId}/lessons` },
          { label: lesson?.name || '...' },
        ]}
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/admin/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/materials`}>
          <div className="bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors cursor-pointer">
            Materiallar
          </div>
        </Link>
        <Link href={`/admin/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/homeworks`}>
          <div className="bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 px-6 py-2 rounded-xl text-sm font-medium border border-slate-200 transition-colors cursor-pointer">
            Vazifalar
          </div>
        </Link>
        <Link href={`/admin/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/exams`}>
          <div className="bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 px-6 py-2 rounded-xl text-sm font-medium border border-slate-200 transition-colors cursor-pointer">
            Imtihonlar
          </div>
        </Link>

        {/* Add Button aligned to right */}
        <div className="ml-auto">
          <Button
            onClick={openAddModal}
            className="bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl px-4 py-2 font-semibold"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white text-white font-bold text-xs mr-2 pb-px">
              +
            </span>
            Qo'shish
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
              <p className="text-slate-500 text-sm">Yuklanmoqda...</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48">
              <p className="text-slate-500 text-sm">Materiallar topilmadi</p>
            </div>
          ) : (
            <table className="w-full text-[13px] text-left">
              <thead>
                <tr>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">
                    Dars
                  </th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100 w-1/2">
                    Material uchun izoh
                  </th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">
                    Biriktirilgan fayllar
                  </th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100 text-right">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {materials.map((mat) => (
                  <tr
                    key={mat.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-slate-700 font-medium">{mat.lesson?.name || lesson?.name}</td>
                    <td className="px-4 py-4 text-slate-500">
                      {mat.description}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {mat.materialFiles?.map(f => (
                          <a
                            key={f.id}
                            href={`http://localhost:4000/uploads/materials/${f.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-blue-500 hover:border-blue-200 transition-colors"
                          >
                            {getFileIcon(f.file)}
                            <span className="font-semibold text-xs uppercase">{f.file.split('.').pop()}</span>
                          </a>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end text-slate-400">
                        <button
                          onClick={() => openEditModal(mat)}
                          className="hover:text-slate-600 p-1 bg-slate-50 rounded-full"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(mat.id)}
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

        <div className="flex items-center justify-between mt-6 text-slate-500 font-medium">
          <div className="flex items-center gap-6">
            <span className="text-[13px] text-slate-800">Sahifada 0-10 gacha. Umumiy {materials.length}ta</span>
            <button className="flex items-center gap-1.5 text-[13px] hover:text-slate-800 transition-colors">
              <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">X</span>
              </div>
              (2) Yuklab olish .XLS
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[13px]">Bir sahifada:</span>
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
            <div className="flex items-center gap-1 text-[13px]">
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
              {editingMaterial ? "Materialni tahrirlash" : "Material qo'shish"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-slate-700">Dars</Label>
              <Select value={lessonId} disabled>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-600">
                  <SelectValue>{lesson?.name || "Dars"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={lessonId}>{lesson?.name || ''}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="matDesc" className="text-sm font-semibold text-slate-700">Material uchun izoh</Label>
              <textarea
                id="matDesc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kiriting"
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-400 resize-none transition-all"
              />
            </div>

            {!editingMaterial && (
              <FileUploadZone
                label="Biriktirilgan fayllar"
                accept=".pdf,.txt,.zip"
                hint=".pdf, .txt, .zip fayllar mumkin"
                file={file}
                onChange={setFile}
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
                <><span className="text-lg leading-none">✓</span> Saqlash</>
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
            Haqiqatan ham bu materialni o'chirmoqchimisiz?
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
    </div>
  );
}
