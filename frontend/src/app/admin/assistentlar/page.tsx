'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Assistent } from '@/types';
import { assistentsApi } from '@/lib/api/assistents';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AssistentlarPage() {
  const [data, setData] = useState<Assistent[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingAssistent, setEditingAssistent] = useState<Assistent | null>(null);
  
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    assistentsApi.getAll()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingAssistent(null);
    setFormData({ name: '', phone: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (assistent: Assistent) => {
    setEditingAssistent(assistent);
    setFormData({ name: assistent.name, phone: assistent.phone, password: '' });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingAssistent) {
        await assistentsApi.update(editingAssistent.id.toString(), formData);
      } else {
        await assistentsApi.create({ ...formData, role: 'assistent', courceId: 1 }); // Hardcoded course ID to avoid schema error, should be a dropdown later
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
      await assistentsApi.delete(selectedId.toString());
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
      header: 'F.I.Sh',
      render: (row: Assistent) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
            {row.file ? (
              <img src={`http://localhost:3001/uploads/images/${row.file}`} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || 'Assistent')}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
            )}
          </div>
          <span className="font-semibold text-slate-800">{row.name}</span>
        </div>
      )
    },
    { 
      key: 'cources', 
      header: 'Biriktirilgan kurs',
      render: (row: Assistent) => <span className="text-slate-600">{row.cources?.name || '-'}</span>
    },
    { 
      key: 'phone', 
      header: 'Telefon raqami',
      render: (row: Assistent) => <span className="text-slate-500">{row.phone}</span>
    },
    { 
      key: 'role', 
      header: 'Rol',
      render: (row: Assistent) => <span className="text-slate-600 capitalize">Assistent</span>
    },
    { 
      key: 'create_at', 
      header: 'Yaratilgan vaqt',
      render: (row: Assistent) => <span className="text-slate-500">{row.create_at ? new Date(row.create_at).toLocaleString('ru-RU') : '-'}</span>
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row: Assistent) => (
        <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-500">
          Faol
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Amallar',
      render: (row: Assistent) => (
        <div className="flex items-center gap-2 text-slate-400">
          <button className="hover:text-blue-500 p-1"><Eye className="w-[18px] h-[18px]" /></button>
          <button onClick={() => openEditModal(row)} className="hover:text-slate-600 p-1"><Edit2 className="w-[18px] h-[18px]" /></button>
          <button onClick={() => openDeleteModal(row.id)} className="hover:text-red-500 p-1"><Trash2 className="w-[18px] h-[18px]" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Assistentlar"
        breadcrumbs={[
          { label: 'Foydalanuvchilar' },
          { label: 'Assistentlar' }
        ]}
        action={
          <Button onClick={openAddModal} className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold">
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white text-white font-bold text-xs mr-2 pb-px">+</span> Qo'shish
          </Button>
        }
      />
      <DataTable columns={columns} data={data} isLoading={loading} emptyTitle="Assistentlar topilmadi" />

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{editingAssistent ? "Assistentni tahrirlash" : "Yangi assistent qo'shish"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">F.I.Sh</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="To'liq ismni kiriting"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telefon raqami</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+998 90 123 45 67"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Parol {editingAssistent && "(o'zgartirish uchun)"}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="********"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Bekor qilish</Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSave} disabled={isSaving || !formData.name || !formData.phone}>
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
            Haqiqatan ham bu assistentni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
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
