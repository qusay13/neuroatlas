// src/components/views/NeuroScalesView.jsx
// مقاييس القياس والتقييم العصبي السريري (Clinical Neurological Scales)
import { useState } from "react";

export default function NeuroScalesView() {
  const [activeScale, setActiveScale] = useState("gcs"); // 'gcs' | 'nihss'

  // GCS state
  const [gcsEye, setGcsEye] = useState(4);
  const [gcsVerbal, setGcsVerbal] = useState(5);
  const [gcsMotor, setGcsMotor] = useState(6);

  const totalGcs = gcsEye + gcsVerbal + gcsMotor;

  const getGcsSeverity = (score) => {
    if (score >= 13) {
      return {
        label: "إصابة رأس خفيفة (Mild Brain Injury)",
        color: "text-secondary",
        bg: "bg-secondary/15",
        advice: "مراقبة العلامات الحيوية العصبية كل ساعتين، تفريغ آمن مع توصيات بالعودة الفورية عند تدهور الوعي أو القيء المتكرر.",
      };
    } else if (score >= 9) {
      return {
        label: "إصابة رأس متوسطة (Moderate Brain Injury)",
        color: "text-tertiary",
        bg: "bg-tertiary/15",
        advice: "قبول في قسم العناية المتوسطة، تصوير طبقي محوري للرأس (CT Brain) عاجل، واستشارة جراحة الأعصاب.",
      };
    } else {
      return {
        label: "إصابة رأس شديدة / غيبوبة (Severe TBI / Coma)",
        color: "text-error",
        bg: "bg-error/15",
        advice: "حالة طارئة حرجة: تأمين مجرى التنفس فوراً بالتنبيب الرغامي (GCS ≤ 8 requires Intubation)، مراقبة الضغط داخل الجمجمة (ICP)، وإجراء CT عاجل.",
      };
    }
  };

  const gcsSeverity = getGcsSeverity(totalGcs);

  // NIHSS simplified calculator state
  const [nihssLoc, setNihssLoc] = useState(0);
  const [nihssGaze, setNihssGaze] = useState(0);
  const [nihssMotorArm, setNihssMotorArm] = useState(0);
  const [nihssSpeech, setNihssSpeech] = useState(0);

  const totalNihss = nihssLoc + nihssGaze + nihssMotorArm + nihssSpeech;

  const getNihssSeverity = (score) => {
    if (score === 0) return { label: "طبيعي - لا عجز عصبي (No Stroke Symptoms)", color: "text-secondary" };
    if (score <= 4) return { label: "سكتة دماغية طفيفة (Minor Stroke)", color: "text-primary" };
    if (score <= 15) return { label: "سكتة دماغية متوسطة (Moderate Stroke)", color: "text-tertiary" };
    return { label: "سكتة دماغية شديدة (Severe Stroke)", color: "text-error" };
  };

  const nihssSeverity = getNihssSeverity(totalNihss);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-y-auto space-y-6 animate-fadeIn">
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-2xl">straighten</span>
            <h1 className="text-xl md:text-2xl font-headline-sm text-on-surface font-bold">
              مقاييس القياس والتقييم العصبي السريري
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface-container-high text-secondary">
              Clinical Scoring Tools
            </span>
          </div>
          <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">
            حاسبات سريرية تفاعلية معتمدة في أقسام الطوارئ والعناية المركزة لطب وجراحة الأعصاب لتقييم
            درجة الوعي (GCS) وتحديد شدة السكتة الدماغية (NIHSS).
          </p>
        </div>

        {/* زر التبديل بين المقاييس */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-surface-container-low border border-outline-variant/30">
          <button
            onClick={() => setActiveScale("gcs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeScale === "gcs"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            مقياس غلاسكو للغيبوبة (GCS)
          </button>
          <button
            onClick={() => setActiveScale("nihss")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeScale === "nihss"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            مقياس السكتة (NIHSS)
          </button>
        </div>
      </div>

      {/* حاسبة GCS */}
      {activeScale === "gcs" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* خيارات التقييم على اليمين */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. فتح العين (E) */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-surface-container-high text-secondary flex items-center justify-center font-mono text-[11px]">E</span>
                  <span>الاستجابة لفتح العينين (Eye Opening)</span>
                </span>
                <span className="text-xs font-mono text-secondary font-bold">{gcsEye} / 4</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { val: 4, text: "تلقائياً (Spontaneous)" },
                  { val: 3, text: "للصوت (To Speech)" },
                  { val: 2, text: "للألم (To Pain)" },
                  { val: 1, text: "لا استجابة (None)" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setGcsEye(opt.val)}
                    className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      gcsEye === opt.val
                        ? "bg-primary-container text-on-primary-container border-secondary/50 shadow-sm"
                        : "bg-surface-container-lowest text-on-surface-variant border-transparent hover:border-outline-variant/30"
                    }`}
                  >
                    <div className="font-bold font-mono text-sm">{opt.val}</div>
                    <div className="text-[10px] leading-tight mt-0.5">{opt.text}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. الاستجابة اللفظية (V) */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-surface-container-high text-secondary flex items-center justify-center font-mono text-[11px]">V</span>
                  <span>الاستجابة اللفظية والكلام (Verbal Response)</span>
                </span>
                <span className="text-xs font-mono text-secondary font-bold">{gcsVerbal} / 5</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {[
                  { val: 5, text: "موجّه وواعٍ (Oriented)" },
                  { val: 4, text: "مشوش (Confused)" },
                  { val: 3, text: "كلمات غير ملائمة (Inappropriate)" },
                  { val: 2, text: "أصوات غير مفهومة (Incomprehensible)" },
                  { val: 1, text: "لا استجابة (None)" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setGcsVerbal(opt.val)}
                    className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      gcsVerbal === opt.val
                        ? "bg-primary-container text-on-primary-container border-secondary/50 shadow-sm"
                        : "bg-surface-container-lowest text-on-surface-variant border-transparent hover:border-outline-variant/30"
                    }`}
                  >
                    <div className="font-bold font-mono text-sm">{opt.val}</div>
                    <div className="text-[10px] leading-tight mt-0.5">{opt.text}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. الاستجابة الحركية (M) */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-surface-container-high text-secondary flex items-center justify-center font-mono text-[11px]">M</span>
                  <span>الاستجابة الحركية للأوامر والألم (Motor Response)</span>
                </span>
                <span className="text-xs font-mono text-secondary font-bold">{gcsMotor} / 6</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  { val: 6, text: "ينفذ الأوامر (Obeys Commands)" },
                  { val: 5, text: "يحدد موضع الألم (Localizes Pain)" },
                  { val: 4, text: "سحب ابتعادي عن الألم (Withdrawal)" },
                  { val: 3, text: "عطف غير طبيعي (Decorticate)" },
                  { val: 2, text: "بسط غير طبيعي (Decerebrate)" },
                  { val: 1, text: "انعدام الحركة (None)" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setGcsMotor(opt.val)}
                    className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      gcsMotor === opt.val
                        ? "bg-primary-container text-on-primary-container border-secondary/50 shadow-sm"
                        : "bg-surface-container-lowest text-on-surface-variant border-transparent hover:border-outline-variant/30"
                    }`}
                  >
                    <div className="font-bold font-mono text-sm">{opt.val}</div>
                    <div className="text-[10px] leading-tight mt-0.5">{opt.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* النتيجة وتوصية الطوارئ على اليسار */}
          <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 space-y-5 shadow-xl">
            <div className="text-center space-y-2 pb-4 border-b border-outline-variant/20">
              <span className="text-xs font-mono text-outline uppercase tracking-wider block">
                مجموع درجات مقياس غلاسكو (Total GCS Score)
              </span>
              <div className="text-5xl font-mono font-bold text-secondary">{totalGcs}</div>
              <div className="text-xs font-mono text-outline">
                E{gcsEye} + V{gcsVerbal} + M{gcsMotor} / 15
              </div>
            </div>

            <div className={`p-4 rounded-xl ${gcsSeverity.bg} border border-outline-variant/20 space-y-2`}>
              <span className="text-xs font-mono text-outline block">التصنيف السريري للإصابة:</span>
              <h3 className={`text-base font-bold ${gcsSeverity.color}`}>{gcsSeverity.label}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed pt-1">
                {gcsSeverity.advice}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-2 text-xs text-on-surface-variant">
              <span className="font-bold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-secondary">info</span>
                <span>قاعدة الحماية الذهبية في طب الطوارئ:</span>
              </span>
              <p className="leading-relaxed">
                إذا كانت درجة المقياس <strong className="text-error font-mono">GCS ≤ 8</strong>، فإن المريض عاجز عن حماية مجرى الهواء بنفسه (Loss of airway protective reflexes)، ويستوجب ذلك التنبيب الرغامي السريع دون تأخير.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* حاسبة NIHSS */}
      {activeScale === "nihss" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2.5">
              <span className="text-xs font-bold text-on-surface block">1. مستوى الوعي (Level of Consciousness):</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { val: 0, text: "مستيقظ ومنتبه (0)" },
                  { val: 1, text: "وسن - يُستثار بالنداء (1)" },
                  { val: 2, text: "سبات أو غيبوبة (2)" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setNihssLoc(opt.val)}
                    className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      nihssLoc === opt.val
                        ? "bg-primary-container text-on-primary-container border-secondary/50 shadow-sm"
                        : "bg-surface-container-lowest text-on-surface-variant border-transparent"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2.5">
              <span className="text-xs font-bold text-on-surface block">2. حركة العين والرمش الأفقي (Horizontal Gaze):</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { val: 0, text: "طبيعي (0)" },
                  { val: 1, text: "خزل جزئي بالنظر (1)" },
                  { val: 2, text: "انحراف تام للعينين (2)" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setNihssGaze(opt.val)}
                    className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      nihssGaze === opt.val
                        ? "bg-primary-container text-on-primary-container border-secondary/50 shadow-sm"
                        : "bg-surface-container-lowest text-on-surface-variant border-transparent"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2.5">
              <span className="text-xs font-bold text-on-surface block">3. ضعف الذراع الحركي (Motor Arm Drift):</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { val: 0, text: "لا هبوط لمدة 10 ثوان (0)" },
                  { val: 1, text: "هبوط جزئي دون ملامسة (1)" },
                  { val: 2, text: "هبوط سريع إلى السرير (2)" },
                  { val: 3, text: "شلل تام للذراع (3)" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setNihssMotorArm(opt.val)}
                    className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      nihssMotorArm === opt.val
                        ? "bg-primary-container text-on-primary-container border-secondary/50 shadow-sm"
                        : "bg-surface-container-lowest text-on-surface-variant border-transparent"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2.5">
              <span className="text-xs font-bold text-on-surface block">4. اللغة والكلام (Language & Aphasia):</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { val: 0, text: "طبيعي - لا حبسة (0)" },
                  { val: 1, text: "حبسة خفيفة إلى متوسطة (1)" },
                  { val: 2, text: "حبسة شديدة أو بكم تام (2)" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setNihssSpeech(opt.val)}
                    className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      nihssSpeech === opt.val
                        ? "bg-primary-container text-on-primary-container border-secondary/50 shadow-sm"
                        : "bg-surface-container-lowest text-on-surface-variant border-transparent"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 space-y-5 shadow-xl">
            <div className="text-center space-y-2 pb-4 border-b border-outline-variant/20">
              <span className="text-xs font-mono text-outline uppercase tracking-wider block">
                مجموع درجات سكتة NIHSS
              </span>
              <div className="text-5xl font-mono font-bold text-secondary">{totalNihss}</div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-2">
              <span className="text-xs font-mono text-outline block">التصنيف والشدة:</span>
              <h3 className={`text-base font-bold ${nihssSeverity.color}`}>{nihssSeverity.label}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                تُعد الدرجة العالية مؤشراً على انسداد وعائي كبير (LVO)، وتستوجب التقييم السريع لجاهزية استئصال الخثرة ميكانيكياً ضمن نافذة الساعات الست الأولى.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
