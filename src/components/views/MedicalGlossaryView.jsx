// src/components/views/MedicalGlossaryView.jsx
// معجم المصطلحات الطبية والعصبية التفاعلي
import { useState } from "react";
import { neuroGlossary } from "../../data/neuroGlossary";

export default function MedicalGlossaryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "جميع المصطلحات" },
    { id: "تشريح عصبي", label: "تشريح عصبي" },
    { id: "فيزيولوجيا عصبية", label: "فيزيولوجيا عصبية" },
    { id: "أمراض وعوارض سريرية", label: "أمراض وعوارض سريرية" },
    { id: "تقنيات تصوير وتشخيص", label: "تقنيات تصوير وتشخيص" },
  ];

  const filteredTerms = neuroGlossary.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.ar.toLowerCase().includes(q) ||
      item.en.toLowerCase().includes(q) ||
      item.latin.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-y-auto space-y-6 animate-fadeIn">
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-2xl">menu_book</span>
            <h1 className="text-xl md:text-2xl font-headline-sm text-on-surface font-bold">
              معجم المصطلحات الطبية والعصبية
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface-container-high text-secondary">
              Index of Neuro-Nomenclature
            </span>
          </div>
          <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">
            قاموس مصطلحات شامل يغطي البنى التشريحية، المفاهيم الفيزيولوجية، المتلازمات السريرية،
            وتقنيات الرنين والتصوير الوظيفي باللغات العربية والإنجليزية واللاتينية.
          </p>
        </div>
      </div>

      {/* شريط البحث وتصنيف الفئات */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 shadow-md">
        <div className="flex items-center gap-2 w-full md:w-96 bg-surface-container px-3 py-2 rounded-lg">
          <span className="material-symbols-outlined text-outline text-lg">search</span>
          <input
            type="text"
            placeholder="ابحث بالعربية، English، أو اللاتينية..."
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

        {/* فلاتر التصنيف */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-surface-container-lowest rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* شبكة عرض المصطلحات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/50 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-on-surface">{term.ar}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-container-high text-secondary shrink-0">
                  {term.category}
                </span>
              </div>

              <div className="font-mono text-xs text-outline space-y-0.5" dir="ltr">
                <div className="text-on-surface-variant font-medium">{term.en}</div>
                <div className="text-[11px] italic opacity-80">{term.latin}</div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed pt-1">
                {term.definition}
              </p>
            </div>

            {term.clinicalNote && (
              <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
                <span className="text-[10px] font-mono text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">stethoscope</span>
                  <span>الأهمية السريرية (Clinical Value):</span>
                </span>
                <p className="text-[11px] text-on-surface-variant/90 leading-tight">
                  {term.clinicalNote}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="p-12 text-center text-outline space-y-2">
          <span className="material-symbols-outlined text-4xl">search_off</span>
          <p className="text-sm">لم يتم العثور على مصطلحات تطابق استعلام البحث.</p>
        </div>
      )}
    </div>
  );
}
