// src/components/views/ClinicalCasesView.jsx
// دراسات الحالات العصبية السريرية المعمقة
import { useState } from "react";
import { clinicalCases } from "../../data/clinicalCases";

export default function ClinicalCasesView({ onSelectLobeAndSwitchTo3D }) {
  const [selectedCaseId, setSelectedCaseId] = useState(clinicalCases[0].id);

  const activeCase =
    clinicalCases.find((c) => c.id === selectedCaseId) || clinicalCases[0];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-y-auto space-y-6 animate-fadeIn">
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-2xl">clinical_notes</span>
            <h1 className="text-xl md:text-2xl font-headline-sm text-on-surface font-bold">
              دراسات الحالات العصبية السريرية المرجعية
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface-container-high text-secondary">
              Grand Rounds Archive
            </span>
          </div>
          <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">
            سجلات طبية حقيقية وتحليل سريري لحالات مرجعية في طب الأعصاب وجراحة الدماغ توضح العلاقة
            المباشرة بين موقع الآفة الدماغية والعجز الوظيفي والسلوكي.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* قائمة الحالات في العمود الأيمن */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-mono text-outline uppercase tracking-wider mb-2">
            سجلات الحالات السريرية ({clinicalCases.length})
          </h3>

          <div className="space-y-2">
            {clinicalCases.map((c) => {
              const isSelected = selectedCaseId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all space-y-2 ${
                    isSelected
                      ? "bg-surface-container-high border-secondary/60 shadow-lg ring-1 ring-secondary/30"
                      : "bg-surface-container-low border-outline-variant/20 hover:border-outline-variant/50 hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-on-surface leading-snug">{c.title}</h4>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container-lowest text-secondary shrink-0">
                      {c.lobe.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant/80 block line-clamp-1">
                    {c.complaint}
                  </span>
                  <div className="flex items-center justify-between text-[10px] font-mono text-outline pt-1 border-t border-outline-variant/20">
                    <span>{c.category}</span>
                    <span className="text-secondary">{c.brodmann.split("&")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ملف الحالة التفصيلي في العمود الأيسر */}
        <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 md:p-6 space-y-6 shadow-xl">
          {/* عنوان الحالة والوسوم */}
          <div className="space-y-2 pb-4 border-b border-outline-variant/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary/15 text-secondary">
                {activeCase.category}
              </span>
              <div className="flex items-center gap-2 font-mono text-xs text-outline" dir="ltr">
                <span>LOCALIZATION:</span>
                <span className="text-on-surface font-semibold">{activeCase.coords}</span>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold font-headline-sm text-on-surface">
              {activeCase.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-sm text-outline">badge</span>
              <span>{activeCase.patient}</span>
            </div>
          </div>

          {/* بطاقة الشكوى والعلامات الحيوية */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-1">
              <span className="text-xs font-mono text-secondary block">الشكوى الرئيسية (Chief Complaint):</span>
              <p className="text-sm font-semibold text-on-surface">{activeCase.complaint}</p>
              <p className="text-xs font-mono text-outline mt-2">الباحات المتأثرة: {activeCase.brodmann}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-1.5 font-mono text-xs">
              <span className="text-[11px] text-outline block">المؤشرات السريرية:</span>
              <div className="flex justify-between text-on-surface">
                <span>ضغط الدم:</span>
                <span className="text-secondary">{activeCase.vitals.bp}</span>
              </div>
              <div className="flex justify-between text-on-surface">
                <span>مقياس GCS:</span>
                <span className="text-secondary">{activeCase.vitals.gcs}</span>
              </div>
              <div className="flex justify-between text-on-surface">
                <span>مقياس NIHSS:</span>
                <span className="text-secondary">{activeCase.vitals.nihss}</span>
              </div>
            </div>
          </div>

          {/* الفحص السريري العصبي */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono text-outline uppercase tracking-wider">
              نتائج الفحص العصبي الموضوعي (Neurological Examination)
            </h3>
            <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/20 space-y-2">
              {activeCase.examination.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* الموجودات الشعاعية والتصوير */}
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">radiology</span>
                <h4 className="text-xs font-bold text-on-surface">تقرير التصوير العصبي الشعاعي</h4>
              </div>
              <span className="text-xs font-mono text-secondary px-2 py-0.5 rounded bg-surface-container-high">
                {activeCase.imaging.modality}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container/40 p-3 rounded-lg">
              {activeCase.imaging.findings}
            </p>
          </div>

          {/* الاستدلال الموضعي والتدبير */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-high/30 border border-outline-variant/20 space-y-2">
              <span className="text-xs font-mono text-secondary block font-semibold">
                الاستدلال التشريحي الموضعي:
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {activeCase.localizationReasoning}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-high/30 border border-outline-variant/20 space-y-2">
              <span className="text-xs font-mono text-secondary block font-semibold">
                خطة التدبير والعلاج:
              </span>
              <ul className="space-y-1.5 text-xs text-on-surface-variant">
                {activeCase.management.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-1.5">
                    <span className="text-secondary text-xs">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* زر التبديل للثلاثي الأبعاد */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onSelectLobeAndSwitchTo3D(activeCase.lobe)}
              className="py-2.5 px-5 rounded-xl bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-semibold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
              <span>عزل ومعاينة الفص المصاب ({activeCase.lobe.toUpperCase()}) في 3D</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
