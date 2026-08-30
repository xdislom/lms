'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, CheckCircle2, MessageCircle, Loader2, FileText, ClipboardList, HelpCircle, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { sectionsApi } from '@/lib/api/sections';
import { lessonsApi } from '@/lib/api/lessons';
import { materialsApi } from '@/lib/api/materials';
import { homeworksApi } from '@/lib/api/homeworks';
import { examsApi } from '@/lib/api/exams';
import { Section, Lesson, Material, Homework, Exam } from '@/types';

export default function CourseDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<string>('qa');
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [tabLoading, setTabLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const sectionList = await sectionsApi.getByCourse(id);
        const sectionsWithLessons = await Promise.all(
          sectionList.map(async (section) => {
            try {
              const lessons = await lessonsApi.getBySection(String(section.id));
              return { ...section, lessons: lessons || [] };
            } catch {
              return { ...section, lessons: [] };
            }
          })
        );
        setSections(sectionsWithLessons);
        if (sectionsWithLessons.length > 0) {
          setExpandedSections(new Set([sectionsWithLessons[0].id]));
          if (sectionsWithLessons[0].lessons && sectionsWithLessons[0].lessons.length > 0) {
            setSelectedLesson(sectionsWithLessons[0].lessons[0]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, [id]);

  useEffect(() => {
    if (!selectedLesson) return;
    const fetchTabData = async () => {
      setTabLoading(true);
      try {
        if (activeTab === 'materials') {
          setMaterials(await materialsApi.getByLesson(String(selectedLesson.id)) || []);
        } else if (activeTab === 'homework') {
          setHomeworks(await homeworksApi.getByLesson(String(selectedLesson.id)) || []);
        } else if (activeTab === 'exams') {
          setExams(await examsApi.getByLesson(String(selectedLesson.id)) || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setTabLoading(false);
      }
    };
    fetchTabData();
  }, [selectedLesson, activeTab]);

  const toggleSection = (sId: number) => {
    setExpandedSections(prev => {
      const n = new Set(prev);
      n.has(sId) ? n.delete(sId) : n.add(sId);
      return n;
    });
  };

  const goNextLesson = () => {
    const all = sections.flatMap(s => s.lessons || []);
    const idx = all.findIndex(l => l.id === selectedLesson?.id);
    if (idx >= 0 && idx < all.length - 1) {
      setSelectedLesson(all[idx + 1]);
      setActiveTab('qa');
    }
  };

  const videoSrc = selectedLesson?.introVideo
    ? 'http://localhost:4000/uploads/videos/' + selectedLesson.introVideo
    : null;

  const tabs = [
    { key: 'qa', label: 'Q&A', icon: <MessageCircle className="w-4 h-4" /> },
    { key: 'materials', label: 'Materiallar', icon: <FileText className="w-4 h-4" /> },
    { key: 'homework', label: 'Vazifalar', icon: <ClipboardList className="w-4 h-4" /> },
    { key: 'exams', label: 'Imtihonlar', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-screen bg-[#f3f4f6] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] flex-shrink-0 bg-white border-r border-slate-100 overflow-y-auto">
        <div className="p-5 border-b border-slate-100">
          <button
            onClick={() => router.push('/student')}
            className="text-[12px] text-slate-400 hover:text-slate-600 mb-3 block"
          >
            &#8592; Orqaga
          </button>
          {loading ? (
            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
          ) : (
            <h2 className="text-[14px] font-bold text-slate-900 line-clamp-2">
              {sections[0]?.cources?.name || 'Kurs'}
            </h2>
          )}
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="py-2">
            {sections.map((section) => {
              const isExp = expandedSections.has(section.id);
              return (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div>
                      <p className="text-[13px] font-bold text-slate-800">{section.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {section.lessons?.length || 0} ta dars
                      </p>
                    </div>
                    {isExp
                      ? <ChevronUp className="w-4 h-4 text-slate-400" />
                      : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isExp && (
                    <div className="border-t border-slate-50">
                      {(section.lessons || []).map((lesson) => {
                        const isActive = selectedLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => { setSelectedLesson(lesson); setActiveTab('qa'); }}
                            className={"w-full flex items-center gap-3 px-5 py-3 text-left transition-colors " + (isActive ? "bg-blue-50 border-r-2 border-blue-500" : "hover:bg-slate-50")}
                          >
                            <div className={"w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 " + (isActive ? "bg-blue-500" : "bg-slate-100")}>
                              <Play className={"w-3 h-3 " + (isActive ? "text-white fill-white" : "text-slate-400")} />
                            </div>
                            <p className={"text-[12px] font-medium flex-1 min-w-0 truncate " + (isActive ? "text-blue-600" : "text-slate-700")}>
                              {lesson.name}
                            </p>
                            {isActive
                              ? <MessageCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              : <CheckCircle2 className="w-4 h-4 text-slate-200 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-6">
        {!selectedLesson ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p className="text-[14px]">Darsni tanlang</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-[16px] font-bold text-slate-900">{selectedLesson.name}</h1>
              <button
                onClick={goNextLesson}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Keyingi dars <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Video */}
            <div className="bg-black rounded-2xl overflow-hidden aspect-video mb-4">
              {videoSrc ? (
                <video key={videoSrc} controls className="w-full h-full" src={videoSrc} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40 flex-col gap-3">
                  <Play className="w-16 h-16" />
                  <p className="text-[13px]">Video mavjud emas</p>
                </div>
              )}
            </div>

            {/* Description */}
            {selectedLesson.description && (
              <div className="bg-white rounded-xl p-4 mb-4 border border-slate-100">
                <p className="text-[13px] text-slate-600">{selectedLesson.description}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
              <div className="flex border-b border-slate-100">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={"flex items-center gap-2 px-5 py-3.5 text-[13px] font-semibold transition-colors border-b-2 " +
                      (activeTab === tab.key
                        ? "border-blue-500 text-blue-600 bg-blue-50/50"
                        : "border-transparent text-slate-500 hover:text-slate-700")}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                  </div>
                ) : (
                  <>
                    {activeTab === 'qa' && (
                      <p className="text-[13px] text-slate-500">
                        Bu dars boyicha savollaringiz bolsa, yozing.
                      </p>
                    )}

                    {activeTab === 'materials' && (
                      <div className="space-y-3">
                        {materials.length === 0
                          ? <p className="text-[13px] text-slate-400 text-center py-6">Materiallar mavjud emas</p>
                          : materials.map((m) => (
                            <div key={m.id} className="border border-slate-100 rounded-xl p-4">
                              <p className="text-[13px] font-medium text-slate-700 mb-2">{m.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {(m.materialFiles || []).map((f) => (
                                  <a
                                    key={f.id}
                                    href={'http://localhost:4000/uploads/files/' + f.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-[12px] font-medium rounded-lg hover:bg-blue-100"
                                  >
                                    <FileText className="w-3.5 h-3.5" /> {f.file}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {activeTab === 'homework' && (
                      <div className="space-y-3">
                        {homeworks.length === 0
                          ? <p className="text-[13px] text-slate-400 text-center py-6">Vazifalar mavjud emas</p>
                          : homeworks.map((hw) => (
                            <div key={hw.id} className="border border-slate-100 rounded-xl p-4">
                              <p className="text-[13px] font-medium text-slate-700">{hw.description}</p>
                              {hw.file && (
                                <a
                                  href={'http://localhost:4000/uploads/files/' + hw.file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-[12px] font-medium rounded-lg"
                                >
                                  <ClipboardList className="w-3.5 h-3.5" /> {hw.file}
                                </a>
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {activeTab === 'exams' && (
                      <div className="space-y-4">
                        {exams.length === 0
                          ? <p className="text-[13px] text-slate-400 text-center py-6">Imtihonlar mavjud emas</p>
                          : exams.map((exam, qi) => (
                            <ExamQuestion key={exam.id} exam={exam} index={qi} />
                          ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExamQuestion({ exam, index }: { exam: Exam; index: number }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean>(false);

  const options = [
    { key: 'answerA', label: 'A', value: exam.variantA },
    { key: 'answerB', label: 'B', value: exam.variantB },
    { key: 'answerC', label: 'C', value: exam.variantC },
    { key: 'answerD', label: 'D', value: exam.variantD },
  ];

  const getClass = (key: string) => {
    if (!checked) {
      return selected === key
        ? 'border-blue-400 bg-blue-50 text-blue-700'
        : 'border-slate-200 hover:border-slate-300 text-slate-700';
    }
    if (key === exam.answer) return 'border-green-400 bg-green-50 text-green-700';
    if (selected === key) return 'border-red-400 bg-red-50 text-red-700';
    return 'border-slate-200 text-slate-400';
  };

  const formattedAnswer = exam.answer ? exam.answer.replace('answer', '') : '';

  return (
    <div className="border border-slate-100 rounded-xl p-5">
      <p className="text-[13px] font-semibold text-slate-800 mb-4">
        {index + 1}. {exam.question}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {options.map(opt => (
          <button
            key={opt.key}
            onClick={() => !checked && setSelected(opt.key)}
            className={"flex items-center gap-3 px-4 py-2.5 rounded-lg border text-[12px] font-medium text-left transition-all " + getClass(opt.key)}
          >
            <span className="font-bold">{opt.label})</span> {opt.value}
          </button>
        ))}
      </div>
      {!checked ? (
        <button
          onClick={() => selected && setChecked(true)}
          disabled={!selected}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-semibold rounded-lg disabled:opacity-40"
        >
          Tekshirish
        </button>
      ) : (
        <p className={"text-[12px] font-semibold " + (selected === exam.answer ? 'text-green-600' : 'text-red-500')}>
          {selected === exam.answer ? "To'g'ri!" : `Noto'g'ri. To'g'ri javob: ${formattedAnswer}`}
        </p>
      )}
    </div>
  );
}
