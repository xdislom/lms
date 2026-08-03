'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Category } from '@/types';
import { categoriesApi } from '@/lib/api/categories';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CategoriesPage() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({ name: '' });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    categoriesApi.getAll()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id.toString(), formData);
      } else {
        await categoriesApi.create(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setIsSaving(true);
    try {
      await categoriesApi.delete(selectedId.toString());
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { 
      key: 'name', 
      header: 'Kategoriya nomi',
      render: (row: Category) => (
        <Link
          href={`/admin/categories/${row.id}/sections`}
          className="font-semibold text-slate-800 hover:text-blue-500 transition-colors"
        >
          {row.name}
        </Link>
      )
    },
    { 
      key: 'create_at', 
      header: 'Yaratilgan vaqt',
      render: (row: Category) => <span className="text-slate-500">{row.create_at ? new Date(row.create_at).toLocaleString('ru-RU') : '-'}</span>
    },
    {
      key: 'actions',
      header: 'Amallar',
      render: (row: Category) => (
        <div className="flex items-center gap-2 text-slate-400">
          <button onClick={() => openEditModal(row)} className="hover:text-slate-600 p-1"><Edit2 className="w-[18px] h-[18px]" /></button>
          <button onClick={() => openDeleteModal(row.id)} className="hover:text-red-500 p-1"><Trash2 className="w-[18px] h-[18px]" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Kategoriyalar"
        breadcrumbs={[
          { label: 'Kurslar' },
          { label: 'Kategoriyalar' }
        ]}
        action={
          <Button onClick={openAddModal} className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold">
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white text-white font-bold text-xs mr-2 pb-px">+</span> Qo'shish
          </Button>
        }
      />
      <DataTable variant="default" columns={columns} data={data} isLoading={loading} emptyTitle="Kategoriyalar topilmadi" />

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya qo'shish"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Kategoriya nomi</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masalan, Web dasturlash"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Bekor qilish</Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSave} disabled={isSaving || !formData.name}>
              {isSaving ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-sm bg-white">
          <DialogHeader>
            <DialogTitle>Tasdiqlang</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-600">
            Haqiqatan ham bu kategoriyani o'chirmoqchimisiz?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Bekor qilish</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "O'chirilmoqda..." : "O'chirish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
