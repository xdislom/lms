'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Loader2, SlidersHorizontal, Search, ArrowDownToLine } from 'lucide-react';
import Link from 'next/link';
import { Section } from '@/types';
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

export default function CourseSectionsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = React.use(params);

  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formName, setFormName] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadSections = () => {
    setLoading(true);
    sectionsApi
      .getByCourse(courseId)
      .then(setSections)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSections();
  }, [courseId]);

  const openAddModal = () => {
    setEditingSection(null);
    setFormName('');
    setIsModalOpen(true);
  };

  const openEditModal = (section: Section) => {
    setEditingSection(section);
    setFormName(section.name);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingSection) {
        await sectionsApi.update(editingSection.id.toString(), { name: formName });
      } else {
        await sectionsApi.create({ name: formName, courceId: Number(courseId) });
      }
      setIsModalOpen(false);
      loadSections();
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
      await sectionsApi.delete(selectedId.toString());
      setIsDeleteOpen(false);
      loadSections();
    } catch (error) {
      console.error(error);
      alert('Xatolik yuz berdi');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Bo'limlar"
        breadcrumbs={[
          { label: 'Kurslar', href: '/admin/courses' },
          { label: "Bo'limlar" },
        ]}
        action={
          <Button
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white text-white font-bold text-xs mr-2 pb-px">
              +
            </span>
            Bo'lim qo'shish
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
          ) : sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48">
              <p className="text-slate-500 text-sm">Bo'limlar topilmadi</p>
            </div>
          ) : (
            <table className="w-full text-[13px] text-left">
              <thead>
                <tr>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">
                    <div className="flex items-center gap-2">
                      Bo'lim nomi <ArrowDownToLine className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100 text-right">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr
                    key={section.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-slate-700 font-medium">
                      <Link
                        href={`/admin/courses/${courseId}/sections/${section.id}/lessons`}
                        className="hover:text-blue-500 transition-colors"
                      >
                        {section.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end text-slate-400">
                        <button
                          onClick={() => openEditModal(section)}
                          className="hover:text-slate-600 p-1"
                        >
                          <Edit2 className="w-[18px] h-[18px]" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(section.id)}
                          className="hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-[18px] h-[18px]" />
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
              Sahifada 0-10 gacha. Umumiy {sections.length}ta
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
              {editingSection ? "Bo'limni tahrirlash" : "Bo'lim qo'shish"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sectionName" className="text-sm font-semibold text-slate-700">Bo'lim nomi</Label>
              <Input
                id="sectionName"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Kiriting"
                className="h-11 rounded-xl border-slate-200 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 h-11 font-semibold flex items-center gap-2"
              onClick={handleSave}
              disabled={isSaving || !formName}
            >
              {isSaving ? 'Saqlanmoqda...' : '✓ Saqlash'}
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
            Haqiqatan ham bu bo'limni o'chirmoqchimisiz?
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
