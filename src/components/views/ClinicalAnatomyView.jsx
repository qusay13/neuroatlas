// src/components/views/ClinicalAnatomyView.jsx
// قسم التشريح السريري الشامل والأطلس النسيجي
import { useState } from "react";
import { neuroDatabase } from "../../data/neuroDatabase";
import regions from "../../data/regions";

const vascularTerritories = [
  {
    artery: "الشريان المخي الأمامي (ACA)",
    latin: "Arteria Cerebri Anterior",
    coverage: "السطح الإنسي للفصين الجبهي والجداري، الباحة الحركية والحسية للساق والقدم، والثلث الأمامي للجسم الثفني.",
    syndrome: "خزل شقي سفلي مع فقد حسي في الساق المعاكسة، سلس بولي، وخمول نفسي حاد (Abulia).",
    color: "#38bdf8",
  },
  {
    artery: "الشريان المخي الأوسط (MCA)",
    latin: "Arteria Cerebri Media",
    coverage: "معظم السطح الوحشي لنصفي الكرة المخية، باحتا بروكا وفيرنيكه، باحات الوجه واليد الحركية والحسية، والمحفظة الداخلية.",
    syndrome: "خزل شقي يتركز في الوجه والطرف العلوي، حبسة كلامية (في النصف السائد)، وإهمال مكاني نصفي (في النصف غير السائد).",
    color: "#f43f5e",
  },
  {
    artery: "الشريان المخي الخلفي (PCA)",
    latin: "Arteria Cerebri Posterior",
    coverage: "الفص القذالي بالكامل، السطح السفلي والإنسي للفص الصدغي، المهاد الحسي، والباحة البصرية الأولية (Calcarine).",
    syndrome: "عمى نصفي متماثل مقترن بحفظ الرؤية البقعية المركزية (Homonymous Hemianopia with Macular Sparing) وعمه بصري.",
    color: "#a78bfa",
  },
  {
    artery: "الشريان القاعدي والشرايين المخيخية (Vertebrobasilar)",
    latin: "Arteria Basilaris & Cerebellaris",
    coverage: "جذع الدماغ (الجسر والنخاع والدماغ المتوسط)، المخيخ بنصفيه، والممرات الشوكية الصاعدة والهابطة.",
    syndrome: "دوار حاد، ترنح مخيخي، شلل بالأعصاب القحفية، شلل رباعي أو متلازمة الانحباس (Locked-in Syndrome).",
    color: "#34d399",
  },
];

export default function ClinicalAnatomyView({ onSelectLobeAndSwitchTo3D }) {
  const [activeSubTab, setActiveSubTab] = useState("lobes"); // 'lobes' | 'gyri' | 'vascular'
  const [selectedLobe, setSelectedLobe] = useState("frontal");
  const [searchFilter, setSearchFilter] = useState("");

  const currentLobeData = neuroDatabase[selectedLobe] || neuroDatabase.frontal;

  const filteredRegions = regions.filter((r) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      r.name_ar.toLowerCase().includes(q) ||
      r.name_en.toLowerCase().includes(q) ||
      r.function.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-y-auto space-y-6 animate-fadeIn">
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-2xl">neurology</span>
            <h1 className="text-xl md:text-2xl font-headline-sm text-on-surface font-bold">
              التشريح السريري والتنظيم الطوبوغرافي
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface-container-high text-secondary">
              FIPAT Standard
            </span>
          </div>
          <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">
            استعراض أكاديمي معمق للبنى الدماغية، التلافيف، التلاميم، الباحات الوظيفية، والتروية
            الشريانية مع التوافق مع التسميات التشريحية الدولية.
          </p>
        </div>

        {/* أزرار التبويبات الفرعية */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-surface-container-low border border-outline-variant/30">
          <button
            onClick={() => setActiveSubTab("lobes")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "lobes"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            الفصوص والباحات
          </button>
          <button
            onClick={() => setActiveSubTab("gyri")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "gyri"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            فهرس التلافيف ({regions.length})
          </button>
          <button
            onClick={() => setActiveSubTab("vascular")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "vascular"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            التروية الوعائية
          </button>
        </div>
      </div>

      {/* التبويب الأول: الفصوص الستة والتفصيل السريري */}
      {activeSubTab === "lobes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* قائمة الفصوص على اليمين */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-mono text-outline uppercase tracking-wider mb-2">
              الفصوص الدماغية الرئيسية
            </h3>
            {Object.entries(neuroDatabase).map(([key, data]) => {
              const isSelected = selectedLobe === key;
              return (
                <div
                  key={key}
                  onClick={() => setSelectedLobe(key)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-surface-container-high border-secondary/60 shadow-md ring-1 ring-secondary/30"
                      : "bg-surface-container-low border-outline-variant/20 hover:border-outline-variant/50 hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: data.highlightColor }}
                    ></span>
                    <div>
                      <h4 className="text-sm font-semibold text-on-surface">{data.title}</h4>
                      <span className="text-xs text-on-surface-variant/70 font-mono">
                        {data.latin}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-secondary px-2 py-0.5 rounded bg-surface-container-lowest">
                    {data.volume}
                  </span>
                </div>
              );
            })}

            <button
              onClick={() => onSelectLobeAndSwitchTo3D(selectedLobe)}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
              <span>معاينة {currentLobeData.title} في المستكشف الثلاثي الأبعاد</span>
            </button>
          </div>

          {/* بطاقة تفاصيل الفص المحدد على اليسار */}
          <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 md:p-6 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold font-headline-sm text-on-surface">
                    {currentLobeData.title}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-secondary/15 text-secondary">
                    {currentLobeData.tag}
                  </span>
                </div>
                <span className="text-sm font-mono text-on-surface-variant">
                  {currentLobeData.latin}
                </span>
              </div>
              <div className="text-left font-mono" dir="ltr">
                <span className="text-[11px] text-outline block">STEREOTAXIC COORDS</span>
                <span className="text-sm font-bold text-secondary">{currentLobeData.coords}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono text-outline uppercase tracking-wider mb-2">
                النبذة التشريحية والارتباطات الوظيفية
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container/60 p-4 rounded-xl border border-outline-variant/20">
                {currentLobeData.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                <span className="text-xs font-mono text-secondary block mb-1">
                  الباحة الوظيفية الأولى
                </span>
                <h5 className="text-sm font-bold text-on-surface mb-1">
                  {currentLobeData.fn1Label}
                </h5>
                <p className="text-xs text-on-surface-variant">{currentLobeData.fn1Desc}</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                <span className="text-xs font-mono text-secondary block mb-1">
                  الباحة الوظيفية الثانية
                </span>
                <h5 className="text-sm font-bold text-on-surface mb-1">
                  {currentLobeData.fn2Label}
                </h5>
                <p className="text-xs text-on-surface-variant">{currentLobeData.fn2Desc}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono text-outline uppercase tracking-wider mb-2">
                أبرز الاضطرابات السريرية الناتجة عن أذية هذا الفص
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentLobeData.pathologies.map((path, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex items-start gap-2.5"
                  >
                    <span className="material-symbols-outlined text-error text-[18px] mt-0.5">
                      {path.icon}
                    </span>
                    <div>
                      <strong className="text-xs text-on-surface block font-semibold">
                        {path.title}
                      </strong>
                      <span className="text-[11px] text-on-surface-variant leading-tight block mt-0.5">
                        {path.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* التبويب الثاني: فهرس التلافيف القشرية التفصيلي */}
      {activeSubTab === "gyri" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
            <div className="flex items-center gap-2 w-full sm:w-80 bg-surface-container px-3 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-outline text-lg">search</span>
              <input
                type="text"
                placeholder="ابحث في التلافيف، الباحات، والوظائف..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-on-surface focus:outline-none w-full placeholder-outline"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className="text-outline hover:text-on-surface text-xs"
                >
                  ✕
                </button>
              )}
            </div>
            <span className="text-xs font-mono text-outline">
              عدد البنى المسترجعة: {filteredRegions.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRegions.map((reg) => (
              <div
                key={reg.id}
                className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/50 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-on-surface">{reg.name_ar}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-container-high text-secondary">
                      {reg.lobe.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-outline block mb-2">{reg.name_en}</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    {reg.function}
                  </p>
                </div>

                <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                  <span className="text-[11px] text-error font-medium line-clamp-1">
                    التأثير النفسي: {reg.psychological_impact.split(".")[0]}
                  </span>
                  <button
                    onClick={() => onSelectLobeAndSwitchTo3D(reg.lobe)}
                    className="text-[11px] font-semibold text-secondary hover:underline shrink-0 mr-2 flex items-center gap-0.5"
                  >
                    <span>معاينة</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* التبويب الثالث: مناطق التروية الوعائية الدماغية */}
      {activeSubTab === "vascular" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-container-high/40 border border-outline-variant/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-2xl mt-0.5">water_drop</span>
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                التروية الوعائية للدماغ ودائرة ويليس (Cerebral Vascular Territories)
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                ترتبط معظم الحوادث الوعائية الدماغية (السكتات الإقفارية والنزفية) بمناطق تروية
                شريانية دقيقة. يعتمد تشخيص السكتة السريري على تحديد المتلازمة الشريانية المسؤولة عن
                العجز العصبي.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vascularTerritories.map((vasc, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: vasc.color }}
                    ></span>
                    <h4 className="text-sm font-bold text-on-surface">{vasc.artery}</h4>
                  </div>
                  <span className="text-xs font-mono text-outline">{vasc.latin}</span>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                  <span className="text-[11px] font-mono text-secondary block mb-0.5">
                    النطاق التشريحي للتروية:
                  </span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{vasc.coverage}</p>
                </div>

                <div className="p-3 rounded-lg bg-error-container/20 border border-error/30">
                  <span className="text-[11px] font-mono text-error block mb-0.5">
                    المتلازمة السريرية عند الانسداد (Stroke Syndrome):
                  </span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{vasc.syndrome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
