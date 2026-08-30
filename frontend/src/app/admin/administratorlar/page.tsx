'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { EyeOff, Edit2, Trash2 } from 'lucide-react';
import { Admin } from '@/types';
import { adminsApi } from '@/lib/api/admins';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdministratorlarPage() {
  const [data, setData] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    adminsApi.getAll()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingAdmin(null);
    setFormData({ name: '', phone: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({ name: admin.name, phone: admin.phone, password: '' }); // password omitted for security unless changing
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingAdmin) {
        const updateData = { name: formData.name, phone: formData.phone, ...(formData.password ? { password: formData.password } : {}) };
        await adminsApi.update(editingAdmin.id.toString(), updateData);
      } else {
        await adminsApi.create({ ...formData, role: 'admin' });
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
      await adminsApi.delete(selectedId.toString());
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
      render: (row: Admin) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
            {row.file ? (
              <img src={`http://localhost:4000/uploads/images/${row.file}`} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Avatar" className="w-full h-full object-cover" />
            )}
          </div>
          <span className="font-semibold text-slate-800">{row.name}</span>
        </div>
      )
    },
    { 
      key: 'phone', 
      header: 'Telefon raqam',
      render: (row: Admin) => <span className="text-slate-500">{row.phone}</span>
    },
    { 
      key: 'create_at', 
      header: 'Yaratilgan vaqt',
      render: (row: Admin) => <span className="text-slate-500">{row.create_at ? new Date(row.create_at).toLocaleString('ru-RU') : '-'}</span>
    },
    { 
      key: 'role', 
      header: 'Rol',
      render: (row: Admin) => <span className="text-slate-600 capitalize">Administrator</span>
    },
    { 
      key: 'password', 
      header: 'Parol',
      render: (row: Admin) => (
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">********</span>
          <button className="text-slate-400 hover:text-slate-600">
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row: Admin) => (
        <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-500">
          Faol
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Amallar',
      render: (row: Admin) => (
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
        title="Administratorlar"
        breadcrumbs={[
          { label: 'Foydalanuvchilar' },
          { label: 'Administratorlar' }
        ]}
        action={
          <Button onClick={openAddModal} className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold">
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white text-white font-bold text-xs mr-2 pb-px">+</span> Qo'shish
          </Button>
        }
      />
      <DataTable columns={columns} data={data} isLoading={loading} emptyTitle="Administratorlar topilmadi" />

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{editingAdmin ? "Administratorni tahrirlash" : "Yangi administrator qo'shish"}</DialogTitle>
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
              <Label htmlFor="password">Parol {editingAdmin && "(o'zgartirish uchun)"}</Label>
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
            Haqiqatan ham bu administratorni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
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
