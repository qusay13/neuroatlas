// src/components/views/PsychiatricDisordersView.jsx
// أطلس الاضطرابات النفسية والعصبية-النفسية مع التحديد التشريحي للجزء المتضرر في الدماغ
import { useState } from "react";
import { PSYCHIATRIC_CATEGORIES, psychiatricDisorders } from "../../data/psychiatricDisorders";

export default function PsychiatricDisordersView({ onSelectLobeAndSwitchTo3D }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLobeFilter, setSelectedLobeFilter] = useState("all");
  const [causeFilter, setCauseFilter] = useState("all");

  const lobeNames = {
    frontal: "الفص الجبهي",
    parietal: "الفص الجداري",
    temporal: "الفص الصدغي",
    occipital: "الفص القذالي",
    limbic: "الجهاز الحوفي والحصين",
    subcortical: "تحت القشرة والجسم الثفني والجذع",
  };

  const filteredDisorders = psychiatricDisorders.filter((item) => {
    // فلتر الفئة
    if (selectedCategory !== "all" && item.category_id !== selectedCategory) return false;

    // فلتر الفص
    if (selectedLobeFilter !== "all" && item.lobe !== selectedLobeFilter) return false;

    // فلتر نوع السبب
    if (causeFilter === "organic" && !item.cause_type.includes("عضوي") && !item.cause_type.includes("بنيوي")) return false;
    if (causeFilter === "functional" && !item.cause_type.includes("وظيفي") && !item.cause_type.includes("كيميائي") && !item.cause_type.includes("شبكي")) return false;

    // البحث النصي
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name_ar.toLowerCase().includes(q) ||
      item.name_en.toLowerCase().includes(q) ||
      item.affected_structures.toLowerCase().includes(q) ||
      item.physical_cause_summary.toLowerCase().includes(q) ||
      item.clinical_features.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-y-auto space-y-6 animate-fadeIn">
      {/* ─── الترويسة الرئيسية ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-2xl">psychology</span>
            <h1 className="text-xl md:text-2xl font-headline-sm text-on-surface font-bold">
              أطلس الاضطرابات النفسية والعصبية والأساس العضوي
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-surface-container-high text-secondary border border-secondary/20">
              Neuropsychiatric Brain Mapping
            </span>
          </div>
          <p className="text-sm text-on-surface-variant max-w-4xl leading-relaxed">
            الربط التشريحي المرجعي بين الاضطرابات النفسية والأجزاء المتضررة فيزيائياً في الدماغ البشري،
            مع توضيح الخلل العضوي في الدارات العصبية، النواقل الكيميائية، أو الآفات البنيوية.
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="flex items-center gap-2 font-mono text-xs text-outline self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>11 تصنيفاً</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center gap-2">
            <span className="text-secondary font-bold">{filteredDisorders.length}</span>
            <span>اضطراب معالج</span>
          </div>
        </div>
      </div>

      {/* ─── شريط البحث والفلاتر المتقدمة ─── */}
      <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* حقل البحث */}
          <div className="flex items-center gap-2 w-full md:w-96 bg-surface-container px-3 py-2 rounded-lg border border-outline-variant/20">
            <span className="material-symbols-outlined text-outline text-lg">search</span>
            <input
              type="text"
              placeholder="ابحث بالاسم، أو الجزء المتضرر (مثل الحصين، اللوزة، الجزيرة)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-on-surface focus:outline-none w-full placeholder-outline"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-outline hover:text-on-surface text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* فلاتر الفصوص ونوع السبب */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* فلتر الفص الدماغي */}
            <select
              value={selectedLobeFilter}
              onChange={(e) => setSelectedLobeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-medium cursor-pointer"
            >
              <option value="all">كافة الفصوص الدماغية</option>
              {Object.entries(lobeNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>

            {/* فلتر نوع السبب */}
            <select
              value={causeFilter}
              onChange={(e) => setCauseFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-medium cursor-pointer"
            >
              <option value="all">كافة أنواع الأسباب</option>
              <option value="organic">سبب عضوي / بنيوي مثبت</option>
              <option value="functional">خلل شبكي وظيفي / كيميائي</option>
            </select>
          </div>
        </div>

        {/* فئات الاضطرابات الـ 11 (Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-outline-variant/20">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === "all"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span>الكل ({psychiatricDisorders.length})</span>
          </button>
          {PSYCHIATRIC_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
              <span>{cat.num}. {cat.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── شبكة بطاقات الاضطرابات النفسية والعصبية ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredDisorders.map((disorder) => (
          <div
            key={disorder.id}
            className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/25 hover:border-outline-variant/50 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md"
          >
            <div className="space-y-3">
              {/* الترويسة والوسوم */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface-variant">
                  {disorder.category_title}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-medium ${
                    disorder.cause_type.includes("عضوي") || disorder.cause_type.includes("بنيوي")
                      ? "bg-secondary/15 text-secondary border border-secondary/30"
                      : "bg-tertiary/15 text-tertiary border border-tertiary/30"
                  }`}
                >
                  {disorder.cause_type}
                </span>
              </div>

              {/* الاسم العربي والإنجليزي */}
              <div>
                <h3 className="text-lg font-bold font-headline-sm text-on-surface">
                  {disorder.name_ar}
                </h3>
                <span className="text-xs font-mono text-outline block mt-0.5" dir="ltr">
                  {disorder.name_en}
                </span>
              </div>

              {/* الجزء المتضرر تشريحياً في الدماغ (Anatomical Region Pin) */}
              <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">pin_drop</span>
                    <span>الجزء المتضرر في الدماغ:</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-container-high text-on-surface font-semibold">
                    {lobeNames[disorder.lobe] || disorder.lobe}
                  </span>
                </div>
                <p className="text-xs font-semibold text-on-surface pr-5">
                  {disorder.affected_structures}
                </p>
                {disorder.brodmann && (
                  <span className="text-[10px] font-mono text-outline block pr-5">
                    باحات برودمان: {disorder.brodmann}
                  </span>
                )}
              </div>

              {/* الأساس الفيزيائي والدارة العصبية المتضررة */}
              <div className="p-3.5 rounded-lg bg-surface-container/60 border border-outline-variant/20 space-y-1">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">biotech</span>
                  <span>الأساس الفيزيائي والخلل العصبي (Neurobiological Basis):</span>
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed pr-5">
                  {disorder.physical_cause_summary}
                </p>
              </div>

              {/* المظاهر السريرية */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-outline block">
                  المظاهر السريرية والسلوكية:
                </span>
                <p className="text-xs text-on-surface-variant/90 leading-relaxed">
                  {disorder.clinical_features}
                </p>
              </div>
            </div>

            {/* زر الربط بالمجسم ثلاثي الأبعاد */}
            <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
              <span className="text-[11px] font-mono text-outline">
                المسار العصبي: {disorder.dti_tract ? disorder.dti_tract.replace("_", " ").toUpperCase() : "DTI"}
              </span>
              <button
                onClick={() => onSelectLobeAndSwitchTo3D(disorder.lobe)}
                className="px-3.5 py-1.5 rounded-lg bg-primary-container hover:bg-primary-container/80 text-on-primary-container text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[15px]">view_in_ar</span>
                <span>معاينة {lobeNames[disorder.lobe] || disorder.lobe} في 3D</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDisorders.length === 0 && (
        <div className="p-12 text-center text-outline space-y-2 bg-surface-container-low rounded-xl border border-outline-variant/20">
          <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
          <p className="text-sm">لم يتم العثور على اضطرابات تطابق معايير البحث الحالية.</p>
        </div>
      )}
    </div>
  );
}
