'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { CheckCircle, Trash2, SlidersHorizontal, Search, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { purchasesApi } from '@/lib/api/purchases';

interface Purchase {
  id: number;
  userId: number;
  courceId: number;
  status: string;
  createdAt?: string;
  user?: {
    id: number;
    name: string;
    phone: string;
    file?: string;
  };
  cource?: {
    id: number;
    name: string;
    price: string | number;
    category?: { name: string };
  };
}

export default function TolovlarPage() {
  const [data, setData] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await purchasesApi.getAll();
      setData(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error('Tolovlarni yuklashda xato:', e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (purchase: Purchase) => {
    const key = `${purchase.userId}-${purchase.courceId}`;
    setApprovingId(key);
    try {
      await purchasesApi.approve(purchase.userId, purchase.courceId);
      showToast("To'lov tasdiqlandi!", 'success');
      await fetchData();
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Tasdiqlashda xato yuz berdi", 'error');
    } finally {
      setApprovingId(null);
    }
  };

  const openDeleteModal = (userId: number, courceId: number) => {
    setSelectedId(`${userId}-${courceId}`);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (selectedId === null) return;
    setDeletingId(selectedId);
    try {
      const [userIdStr, courceIdStr] = selectedId.split('-');
      const userId = Number(userIdStr);
      const courceId = Number(courceIdStr);
      
      await purchasesApi.delete(userId, courceId); 
      
      setData(prev => prev.filter(item => `${item.userId}-${item.courceId}` !== selectedId));
      showToast("O'chirildi", 'success');
      await fetchData();
    } catch (e: any) {
      showToast(e?.response?.data?.message || "O'chirishda xato yuz berdi", 'error');
    } finally {
      setDeletingId(null);
      setIsDeleteOpen(false);
    }
  };

  const filteredData = data.filter(item =>
    item.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.cource?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.cource?.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusLabel = (status: string) => {
    if (status === 'approved' || status === 'APPROVED') return "To'landi";
    if (status === 'pending' || status === 'PENDING') return "Kutilmoqda";
    if (status === 'rejected' || status === 'REJECTED') return "Bekor qilindi";
    return status;
  };

  const getStatusClass = (status: string) => {
    if (status === 'approved' || status === 'APPROVED') return 'bg-green-50 text-green-600';
    if (status === 'pending' || status === 'PENDING') return 'bg-amber-50 text-amber-600';
    return 'bg-red-50 text-red-600';
  };

  const isPending = (status: string) =>
    status === 'pending' || status === 'PENDING';

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold transition-all ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}

      <PageHeader
        title="To'lovlar"
        breadcrumbs={[
          { label: 'Foydalanuvchilar' },
          { label: "To'lovlar" }
        ]}
      />

      <div className="bg-white rounded-[20px] shadow-sm overflow-hidden flex flex-col w-full border border-slate-100 p-6">
        {/* Top Toolbar */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between py-4 border-b border-slate-200 gap-4 xl:gap-0 mb-6">
          <div className="relative w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Izlash"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] outline-none focus:border-blue-500 transition-all text-[#1a1a1a] placeholder:text-slate-400"
            />
            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer" />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[13px] font-medium text-slate-500">
              Jami: <strong className="text-slate-800">{filteredData.length}</strong> ta
            </span>
            <button
              onClick={fetchData}
              className="text-[13px] font-medium text-blue-500 hover:text-blue-700 transition-colors"
            >
              Yangilash
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[250px]">
          <table className="w-full text-[13px] text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-4 font-bold text-[#1a1a1a] whitespace-nowrap">ID</th>
                <th className="px-4 py-4 font-bold text-[#1a1a1a] whitespace-nowrap">Sotib oluvchi</th>
                <th className="px-4 py-4 font-bold text-[#1a1a1a] whitespace-nowrap">Kurs nomi</th>
                <th className="px-4 py-4 font-bold text-[#1a1a1a] whitespace-nowrap">Yo'nalish</th>
                <th className="px-4 py-4 font-bold text-[#1a1a1a] whitespace-nowrap">Summa</th>
                <th className="px-4 py-4 font-bold text-[#1a1a1a] whitespace-nowrap">Sana</th>
                <th className="px-4 py-4 font-bold text-[#1a1a1a] whitespace-nowrap">Holat</th>
                <th className="px-4 py-4 font-bold text-[#1a1a1a] whitespace-nowrap">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-[13px] font-medium">Yuklanmoqda...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-500 font-medium">
                    To'lovlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr key={`${row.userId}-${row.courceId}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 text-slate-600 font-medium">{index + 1}</td>
                    <td className="px-4 py-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                          {row.user?.file ? (
                            <img
                              src={`http://localhost:4000/uploads/images/${row.user.file}`}
                              alt={row.user?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.user?.name || 'U')}&background=0284c7&color=fff`}
                              alt={row.user?.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{row.user?.name || '—'}</div>
                          <div className="text-[11px] text-slate-400">{row.user?.phone || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700 font-medium">{row.cource?.name || '—'}</td>
                    <td className="px-4 py-4 text-slate-500">{row.cource?.category?.name || '—'}</td>
                    <td className="px-4 py-4 font-bold text-slate-800">
                      {row.cource?.price
                        ? Number(row.cource.price).toLocaleString('uz-UZ').replace(/,/g, ' ')
                        : '—'}
                    </td>
                    <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString('ru-RU') + ' - ' +
                          new Date(row.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(row.status)}`}>
                        {getStatusLabel(row.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        {/* Approve button — faqat pending holatlarda ko'rinadi */}
                        {isPending(row.status) && (
                          <button
                            onClick={() => handleApprove(row)}
                            disabled={approvingId === `${row.userId}-${row.courceId}`}
                            title="Tasdiqlash"
                            className="hover:text-green-500 p-1 disabled:opacity-50 transition-colors"
                          >
                            {approvingId === `${row.userId}-${row.courceId}`
                              ? <Loader2 className="w-[18px] h-[18px] animate-spin" />
                              : <CheckCircle className="w-[18px] h-[18px]" />
                            }
                          </button>
                        )}
                        <button
                          onClick={() => openDeleteModal(row.userId, row.courceId)}
                          title="O'chirish"
                          className="hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between py-4 border-t border-slate-200 mt-6">
          <span className="text-[13px] font-medium text-[#1a1a1a]">
            Umumiy {filteredData.length} ta to'lov
          </span>
          <button className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">X</span>
            </div>
            ({filteredData.length}) Yuklab olish .XLS
          </button>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>To'lovni o'chirish</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-500 text-sm">Haqiqatan ham bu to'lovni o'chirib tashlamoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDeleteOpen(false)} variant="outline" className="rounded-xl">Bekor qilish</Button>
            <Button
              onClick={handleDelete}
              disabled={deletingId !== null}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              {deletingId !== null ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              O'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
