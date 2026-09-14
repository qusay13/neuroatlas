// src/components/views/DiagnosticModeView.jsx
// نمط الفحص والتقييم السريري التشخيصي التفاعلي
import { useState } from "react";

const CLINICAL_SYMPTOMS = [
  {
    id: "symp_motor_weakness",
    label: "خزل شقي أو ضعف حركي بؤري (الوجه أو الذراع)",
    category: "حركي",
    weights: { frontal: 4, subcortical: 3, parietal: 1 },
    clue: "يشير إلى تلف في التلفيف أمام المركزي (M1) أو المحفظة الداخلية للمسار القشري الشوكي.",
  },
  {
    id: "symp_broca_aphasia",
    label: "حبسة تعبيرية وصعوبة إخراج الكلام مع سلامة الفهم",
    category: "لغة",
    weights: { frontal: 5, temporal: 1 },
    clue: "علامة موضعية نوعية لإصابة باحة بروكا (BA 44/45) في الفص الجبهي السفلي الأيسر.",
  },
  {
    id: "symp_wernicke_aphasia",
    label: "حبسة استقبالية (فقدان فهم الكلام وسلس كلامي غير مفهوم)",
    category: "لغة",
    weights: { temporal: 5, parietal: 2 },
    clue: "تشير نموذجياً إلى آفة باحة فيرنيكه في التلفيف الصدغي العلوي لنصف الكرة السائد.",
  },
  {
    id: "symp_sensory_loss",
    label: "خدر، تنميل، أو فقدان الإحساس الجسدي المقابل",
    category: "حسي",
    weights: { parietal: 5, subcortical: 3 },
    clue: "أذية القشرة الحسية الأولية (S1) خلف التلم المركزي أو نوى المهاد الحسي.",
  },
  {
    id: "symp_hemineglect",
    label: "إهمال الحيز المكاني النصفي (تجاهل الجانب الأيسر)",
    category: "إدراكي",
    weights: { parietal: 5, frontal: 1 },
    clue: "آفة نوعية في الفص الجداري السفلي غير السائد (الأيمن عادة).",
  },
  {
    id: "symp_visual_field",
    label: "عمى نصفي متماثل أو اضطراب في الساحة البصرية",
    category: "بصري",
    weights: { occipital: 5, temporal: 2, parietal: 2 },
    clue: "أذية القشرة البصرية الأولية (Calcarine) أو مسارات الإشعاع البصري.",
  },
  {
    id: "symp_memory_loss",
    label: "فقدان الذاكرة العرضية القريبة وصعوبة تشفير المعلومات",
    category: "معرفي",
    weights: { limbic: 5, temporal: 4 },
    clue: "يشير إلى خلل في تشكيلة الحصين (Hippocampus) أو الفص الصدغي الإنسي.",
  },
  {
    id: "symp_disinhibition",
    label: "تغيرات في الشخصية، اندفاعية، وفقدان الكبح الاجتماعي",
    category: "سلوكي",
    weights: { frontal: 5, limbic: 2 },
    clue: "خلل في القشرة الجبهية الحجاجية (OFC) والشبكات التنفيذية الأمامية.",
  },
  {
    id: "symp_ataxia",
    label: "ترنح، فقدان التوازن، وخلل في تناسق حركات الأطراف",
    category: "توازن",
    weights: { subcortical: 4, parietal: 1 },
    clue: "يشير لخلل في المخيخ أو المسارات النخاعية المخيخية وجذع الدماغ.",
  },
];

export default function DiagnosticModeView({ onSelectLobeAndSwitchTo3D }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([
    "symp_motor_weakness",
    "symp_broca_aphasia",
  ]);

  const toggleSymptom = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  // محرك الاستدلال الموضعي الرياضي
  const scores = {
    frontal: 0,
    parietal: 0,
    temporal: 0,
    occipital: 0,
    limbic: 0,
    subcortical: 0,
  };

  selectedSymptoms.forEach((sId) => {
    const symp = CLINICAL_SYMPTOMS.find((s) => s.id === sId);
    if (symp && symp.weights) {
      Object.entries(symp.weights).forEach(([lobe, w]) => {
        scores[lobe] = (scores[lobe] || 0) + w;
      });
    }
  });

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const sortedLobes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primaryLobe = sortedLobes[0][0];

  const lobeTitles = {
    frontal: "الفص الجبهي (Frontal Lobe)",
    parietal: "الفص الجداري (Parietal Lobe)",
    temporal: "الفص الصدغي (Temporal Lobe)",
    occipital: "الفص القذالي (Occipital Lobe)",
    limbic: "الجهاز الحوفي والحصين (Limbic System)",
    subcortical: "النوى القاعدية وجذع الدماغ (Subcortical / Brainstem)",
  };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-y-auto space-y-6 animate-fadeIn">
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-2xl">upload_file</span>
            <h1 className="text-xl md:text-2xl font-headline-sm text-on-surface font-bold">
              نمط الفحص والاستدلال السريري الموضعي
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface-container-high text-secondary">
              Diagnostic Localization Engine
            </span>
          </div>
          <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">
            حدد الأعراض والعلامات العصبية المشاهدة لدى المريض ليقوم المحرك بحساب احتمالات التموضع
            التشريحي للآفة الدماغية والتوصية بالبروتوكولات التشخيصية الفورية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* قائمة الأعراض والعلامات السريرية على اليمين */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono text-outline uppercase tracking-wider">
              قائمة الأعراض والعلامات العصبية (اختر للمطابقة)
            </h3>
            <span className="text-xs font-mono text-secondary">
              {selectedSymptoms.length} محددة
            </span>
          </div>

          <div className="space-y-2">
            {CLINICAL_SYMPTOMS.map((symp) => {
              const isChecked = selectedSymptoms.includes(symp.id);
              return (
                <div
                  key={symp.id}
                  onClick={() => toggleSymptom(symp.id)}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all flex items-start gap-3 ${
                    isChecked
                      ? "bg-surface-container-high border-secondary/60 shadow-md ring-1 ring-secondary/30"
                      : "bg-surface-container-low border-outline-variant/20 hover:border-outline-variant/40 hover:bg-surface-container"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded text-secondary focus:ring-0 bg-surface-container-lowest border-outline cursor-pointer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">{symp.label}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-surface-container-lowest text-outline">
                        {symp.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant/80">{symp.clue}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* نتائج التحليل الموضعي والتوصيات على اليسار */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <span className="text-xs font-mono text-secondary uppercase tracking-wider">
                التموضع التشريحي المرجّح (Top Localization)
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-secondary/15 text-secondary font-bold">
                {Math.round((sortedLobes[0][1] / totalScore) * 100)}% احتمالية
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold font-headline-sm text-on-surface">
                {lobeTitles[primaryLobe]}
              </h2>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                بناءً على الأعراض المدخلة، تشير الأدلة السريرية بأعلى درجة تطابق إلى وجود الآفة أو
                العطل الوظيفي في نطاق هذا الفص والمسارات العصبية المنطلقة منه.
              </p>
            </div>

            {/* أشرطة الاحتمالية النسبية لجميع الفصوص */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-mono text-outline uppercase tracking-wider">
                توزيع الاحتمالات الطوبوغرافية
              </h4>
              {sortedLobes.map(([lobe, score]) => {
                const pct = Math.round((score / totalScore) * 100);
                return (
                  <div key={lobe} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-on-surface capitalize">{lobe}</span>
                      <span className="text-secondary">{pct}%</span>
                    </div>
                    <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-secondary h-full transition-all duration-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* بروتوكول التقييم والفحوصات الموصى بها */}
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">science</span>
                <h4 className="text-xs font-bold text-on-surface">الفحوصات السريرية الموصى بها فوراً:</h4>
              </div>
              <ul className="space-y-1.5 text-xs text-on-surface-variant">
                <li className="flex items-start gap-1.5">
                  <span className="text-secondary font-bold">1.</span>
                  <span>رنين مغناطيسي دماغي عاجل مع تسلسل الانتشار (Brain MRI with DWI/ADC) لنفي السكتة الإقفارية الحادة.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-secondary font-bold">2.</span>
                  <span>تصوير شرايين الرأس والعنق الظليل (CTA or MRA) لتقييم سالكية دائرة ويليس والشرايين السباتية.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-secondary font-bold">3.</span>
                  <span>تخطيط كهربية الدماغ (EEG) في حال وجود نوبات متكررة أو شك في بؤر صرعية موضعية.</span>
                </li>
              </ul>
            </div>

            {/* زر النقل للثلاثي الأبعاد */}
            <button
              onClick={() => onSelectLobeAndSwitchTo3D(primaryLobe)}
              className="w-full py-2.5 px-4 rounded-xl bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
              <span>عزل وفحص {lobeTitles[primaryLobe].split("(")[0]} في المستكشف 3D</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
