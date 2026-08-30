'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import { Exam, Answer, Lesson } from '@/types';
import { examsApi } from '@/lib/api/exams';
import { lessonsApi } from '@/lib/api/lessons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/* ── Answer labels ──────────────────────────────────────── */
const ANSWER_OPTIONS: { value: Answer; label: string }[] = [
  { value: 'answerA', label: 'A javob (To\'g\'ri)' },
  { value: 'answerB', label: 'B javob' },
  { value: 'answerC', label: 'C javob' },
  { value: 'answerD', label: 'D javob' },
];

const answerLabel: Record<Answer, string> = {
  answerA: 'A',
  answerB: 'B',
  answerC: 'C',
  answerD: 'D',
};

/* ── Empty form ─────────────────────────────────────────── */
const emptyForm = {
  question: '',
  variantA: '',
  variantB: '',
  variantC: '',
  variantD: '',
  answer: 'answerA' as Answer,
};

/* ── Page ───────────────────────────────────────────────── */
export default function ExamsPage({
  params,
}: {
  params: Promise<{ courseId: string; sectionId: string; lessonId: string }>;
}) {
  const { courseId, sectionId, lessonId } = React.use(params);

  const [exams, setExams] = useState<Exam[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const basePath = `/admin/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`;

  const loadData = () => {
    setLoading(true);
    Promise.all([
      examsApi.getByLesson(lessonId),
      lessonsApi.getOne(lessonId),
    ])
      .then(([examsRes, lessonRes]) => {
        setExams(examsRes);
        setLesson(lessonRes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [courseId, sectionId, lessonId]);

  /* Helpers */
  const openAddModal = () => {
    setEditingExam(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      question: exam.question,
      variantA: exam.variantA,
      variantB: exam.variantB,
      variantC: exam.variantC,
      variantD: exam.variantD,
      answer: exam.answer,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  /* Save */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingExam) {
        await examsApi.update(editingExam.id.toString(), formData);
      } else {
        await examsApi.create({ lessonId: Number(lessonId), ...formData });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Xatolik yuz berdi');
    } finally {
      setIsSaving(false);
    }
  };

  /* Delete */
  const handleDelete = async () => {
    if (!selectedId) return;
    setIsSaving(true);
    try {
      await examsApi.delete(selectedId.toString());
      setIsDeleteOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Xatolik yuz berdi');
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid =
    formData.question.trim() &&
    formData.variantA.trim() &&
    formData.variantB.trim() &&
    formData.variantC.trim() &&
    formData.variantD.trim();

  /* ── Render ─────────────────────────────────────────── */
  return (
    <div>
      <PageHeader
        title="Darslar"
        breadcrumbs={[
          { label: 'Kurslar', href: '/admin/courses' },
          { label: "Bo'limlar", href: `/admin/courses/${courseId}/sections` },
          { label: 'Darslar', href: `/admin/courses/${courseId}/sections/${sectionId}/lessons` },
          { label: lesson?.name || '...' },
        ]}
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <Link href={`${basePath}/materials`}>
          <div className="bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 px-6 py-2 rounded-xl text-sm font-medium border border-slate-200 transition-colors cursor-pointer">
            Materiallar
          </div>
        </Link>
        <Link href={`${basePath}/homeworks`}>
          <div className="bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 px-6 py-2 rounded-xl text-sm font-medium border border-slate-200 transition-colors cursor-pointer">
            Vazifalar
          </div>
        </Link>
        <Link href={`${basePath}/exams`}>
          <div className="bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-medium shadow-sm cursor-pointer">
            Imtihonlar
          </div>
        </Link>

        <div className="ml-auto">
          <Button
            onClick={openAddModal}
            className="bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl px-4 py-2 font-semibold"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white text-white font-bold text-xs mr-2 pb-px">+</span>
            Savol qo'shish
          </Button>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
              <p className="text-slate-500 text-sm">Yuklanmoqda...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48">
              <p className="text-slate-500 text-sm">Imtihon savollari topilmadi</p>
            </div>
          ) : (
            <table className="w-full text-[13px] text-left">
              <thead>
                <tr>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100 w-8">№</th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">Savol</th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">A javob</th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">B javob</th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">C javob</th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100">D javob</th>
                  <th className="px-4 py-4 font-bold text-slate-800 border-b-2 border-slate-100 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, idx) => (
                  <tr key={exam.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-4 py-4 text-slate-700 font-medium max-w-[220px]">{exam.question}</td>
                    {/* Variants — highlight correct answer */}
                    {(['variantA', 'variantB', 'variantC', 'variantD'] as const).map((key, vi) => {
                      const ansKey = (['answerA', 'answerB', 'answerC', 'answerD'] as Answer[])[vi];
                      const isCorrect = exam.answer === ansKey;
                      return (
                        <td key={key} className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2 py-1 rounded-lg ${
                              isCorrect
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'text-slate-600'
                            }`}
                          >
                            {isCorrect && (
                              <span className="text-green-500 font-bold text-[10px]">To&apos;g&apos;ri javob</span>
                            )}
                            {exam[key]}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end text-slate-400">
                        <button onClick={() => openEditModal(exam)} className="hover:text-slate-600 p-1 bg-slate-50 rounded-full">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => openDeleteModal(exam.id)} className="hover:text-red-500 p-1 bg-slate-50 rounded-full">
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

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 text-slate-500 font-medium">
          <div className="flex items-center gap-6">
            <span className="text-[13px] text-slate-800">Sahifada 0-10 gacha. Umumiy {exams.length}ta</span>
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
        <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-bold text-slate-800">
              {editingExam ? 'Savolni tahrirlash' : "Savol qo'shish"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">

            {/* Lesson (disabled) */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-slate-700">Dars</Label>
              <Select value={lessonId} disabled>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-600">
                  <SelectValue>{lesson?.name || 'Dars'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={lessonId}>{lesson?.name || ''}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Question */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="question" className="text-sm font-semibold text-slate-700">Savol</Label>
              <textarea
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Savolni kiriting"
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-400 resize-none transition-all"
              />
            </div>

            {/* Variants grid */}
            <div className="grid grid-cols-2 gap-3">
              {(['variantA', 'variantB', 'variantC', 'variantD'] as const).map((key, i) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <Label htmlFor={key} className="text-sm font-semibold text-slate-700">
                    {['A', 'B', 'C', 'D'][i]} variant
                  </Label>
                  <Input
                    id={key}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    placeholder="Variantni kiriting"
                    className="h-11 rounded-xl border-slate-200"
                  />
                </div>
              ))}
            </div>

            {/* Correct answer */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-slate-700">To&apos;g&apos;ri javob</Label>
              <Select
                value={formData.answer}
                onValueChange={(v) => setFormData({ ...formData, answer: (v ?? 'answerA') as Answer })}
              >
                <SelectTrigger className="h-11 rounded-xl border-slate-200">
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {ANSWER_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 h-11 font-semibold flex items-center gap-2"
              onClick={handleSave}
              disabled={isSaving || !isFormValid}
            >
              {isSaving ? 'Saqlanmoqda...' : <><span className="text-lg leading-none">✓</span> Saqlash</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-sm bg-white">
          <DialogHeader>
            <DialogTitle>Tasdiqlang</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-600">Haqiqatan ham bu savolni o&apos;chirmoqchimisiz?</div>
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
