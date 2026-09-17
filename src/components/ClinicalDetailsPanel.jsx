// src/components/ClinicalDetailsPanel.jsx
// لوحة تفاصيل الفص السريرية المتجاوبة (تعمل كبطاقة سطح مكتب أو ورقة سفلية للجوال)

export default function ClinicalDetailsPanel({
  currentLobe,
  selectedRegion,
  activeTab,
  setActiveTab,
  isIsolatingTracts,
  onToggleIsolate,
  onClose,
  isMobileSheet = false,
  isInlineMobile = false,
}) {
  return (
    <div
      className={`${isInlineMobile ? "clinical-inline" : ""} relative w-full flex flex-col bg-surface-container-low/95 backdrop-blur-xl border border-outline-variant/30 overflow-hidden shadow-2xl ${
        isMobileSheet
          ? "rounded-t-2xl max-h-[88vh] h-[88vh]"
          : "rounded-xl h-[580px] max-h-[68vh]"
      }`}
    >
      {/* ─── الترويسة ─── */}
      <div className="p-3 sm:p-4 bg-surface-container-high/90 flex flex-col gap-2 border-b border-outline-variant/30 shrink-0">
        {isMobileSheet && (
          <div className="w-10 h-1 bg-outline-variant/60 rounded-full mx-auto mb-1" />
        )}

        <div className="flex items-center justify-between gap-2">
          {/* وسم باحات برودمان المنسق */}
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-secondary/15 text-secondary border border-secondary/25 truncate max-w-[260px] sm:max-w-none">
            {selectedRegion
              ? `SUBREGION: ${selectedRegion.name_en.toUpperCase()}`
              : currentLobe.tag}
          </span>

          <div className="flex items-center gap-2">
            <div className="inspection-status flex items-center gap-1 text-[11px] text-secondary font-mono">
              <span
                className={`w-1.5 h-1.5 rounded-full bg-secondary ${
                  isIsolatingTracts ? "bg-tertiary" : "animate-ping"
                }`}
              ></span>
              <span className="whitespace-nowrap font-mono">
                {isIsolatingTracts
                  ? "TRACT ISOLATED"
                  : selectedRegion
                  ? "FOCAL INSPECTION"
                  : "ACTIVE INSPECTION"}
              </span>
            </div>

            {/* زر الإغلاق في الجوال */}
            {isMobileSheet && onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-surface-container text-outline hover:text-on-surface transition-colors mr-1"
                title="إغلاق"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>
        </div>

        {/* عنوان الفص أو المنطقة مع الحجم النسبي */}
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: currentLobe.highlightColor }}
              />
              <h1 className="text-base sm:text-xl font-bold text-on-surface tracking-tight truncate">
                {selectedRegion ? selectedRegion.name_ar : currentLobe.title}
              </h1>
            </div>
            <span className="text-xs text-on-surface-variant font-mono truncate block mt-0.5 pr-4">
              {selectedRegion ? selectedRegion.name_en : currentLobe.latin}
            </span>
          </div>

          <div className="text-left font-mono shrink-0">
            <span className="text-outline text-[10px] sm:text-xs block">
              الحجم النسبي
            </span>
            <span className="text-sm sm:text-base text-secondary font-bold leading-none">
              {currentLobe.volume}
            </span>
          </div>
        </div>
      </div>

      {/* ─── أزرار التبويبات الثلاثة ─── */}
      <div className="clinical-tabs flex items-center bg-surface-container-low px-3 sm:px-4 gap-2 pt-1 border-b border-outline-variant/20 overflow-x-auto scrollbar-none shrink-0">
        <button
          className={`py-2 px-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === "overview"
              ? "text-secondary border-secondary font-bold"
              : "text-on-surface-variant border-transparent hover:text-on-surface"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          التشريح والوظيفة
        </button>
        <button
          className={`py-2 px-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === "pathology"
              ? "text-secondary border-secondary font-bold"
              : "text-on-surface-variant border-transparent hover:text-on-surface"
          }`}
          onClick={() => setActiveTab("pathology")}
        >
          الارتباطات السريرية
        </button>
        <button
          className={`py-2 px-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === "diagnostics"
              ? "text-secondary border-secondary font-bold"
              : "text-on-surface-variant border-transparent hover:text-on-surface"
          }`}
          onClick={() => setActiveTab("diagnostics")}
        >
          الفحوصات العصبية
        </button>
      </div>

      {/* ─── محتوى البطاقة القابل للتمرير ─── */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4 text-right">
        {/* التبويب 1: النبذة التشريحية والارتباطات الوظيفية */}
        {activeTab === "overview" && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-secondary">
                <span className="material-symbols-outlined text-base">account_tree</span>
                <h2 className="text-xs sm:text-sm font-bold text-on-surface">
                  النبذة التشريحية والارتباطات الوظيفية
                </h2>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {selectedRegion ? selectedRegion.function : currentLobe.overview}
              </p>
            </div>

            {/* محاور الوظائف الفرعية */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/15">
                <span className="text-[10px] text-outline block font-medium">
                  {currentLobe.fn1Label}
                </span>
                <span className="text-xs text-on-surface font-semibold mt-0.5 block">
                  {currentLobe.fn1Desc}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/15">
                <span className="text-[10px] text-outline block font-medium">
                  {currentLobe.fn2Label}
                </span>
                <span className="text-xs text-on-surface font-semibold mt-0.5 block">
                  {currentLobe.fn2Desc}
                </span>
              </div>
            </div>

            {/* مؤشر سلامة المسارات العصبية */}
            <div className="p-2.5 rounded-lg bg-surface-container-high/60 border border-outline-variant/15">
              <div className="flex items-center justify-between text-on-surface mb-1 text-xs">
                <span className="font-semibold">
                  كثافة المسارات العصبية الحركية (Corticospinal)
                </span>
                <span className="font-mono text-secondary text-[11px]">
                  {currentLobe.density}
                </span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full transition-all duration-700"
                  style={{ width: currentLobe.barWidth }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* التبويب 2: الارتباطات السريرية والسلوكي */}
        {activeTab === "pathology" && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 mb-1.5 text-tertiary">
              <span className="material-symbols-outlined text-base">warning</span>
              <h2 className="text-xs sm:text-sm font-bold text-on-surface">
                الاضطرابات والأعطال السريرية والتأثير النفسي
              </h2>
            </div>

            {/* إذا تم تحديد تلافيف معين، نعرض تأثيره النفسي المتخصص أولاً */}
            {selectedRegion && selectedRegion.psychological_impact && (
              <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-secondary/30 mb-2">
                <div className="flex items-center gap-1 text-secondary text-xs font-bold mb-1">
                  <span className="material-symbols-outlined text-[15px]">psychology</span>
                  <span>التأثير النفسي والسلوكي لـ {selectedRegion.name_ar}:</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {selectedRegion.psychological_impact}
                </p>
              </div>
            )}

            <ul className="space-y-2">
              {currentLobe.pathologies.map((path, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/15 flex items-start gap-2"
                >
                  <span className="material-symbols-outlined text-error text-base mt-0.5 shrink-0">
                    {path.icon}
                  </span>
                  <div>
                    <strong className="text-xs text-on-surface block font-bold">
                      {path.title}
                    </strong>
                    <span className="text-[11px] text-on-surface-variant leading-normal">
                      {path.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* التبويب 3: الفحوصات والتقييمات العصبية */}
        {activeTab === "diagnostics" && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 mb-1.5 text-primary">
              <span className="material-symbols-outlined text-base">upload_file</span>
              <h2 className="text-xs sm:text-sm font-bold text-on-surface">
                بروتوكولات الفحص والتقييم السريري
              </h2>
            </div>
            <div className="space-y-2">
              {currentLobe.diagnostics.map((diag, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/15"
                >
                  <div className="flex justify-between items-center text-on-surface mb-1">
                    <span className="text-xs font-semibold">{diag.title}</span>
                    <span className="text-[10px] text-secondary font-mono px-1.5 py-0.5 rounded bg-surface-container">
                      {diag.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-normal">
                    {diag.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── أسفل البطاقة: الإحداثيات الاستريوتاكتية وزر العزل ─── */}
      <div className="p-2.5 sm:p-3 bg-surface-container-lowest/90 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/30 shrink-0">
        <div className="flex items-center gap-1 font-mono text-[11px] text-outline" dir="ltr">
          <span className="text-secondary/80">مرجع وصفي:</span>
          <span className="text-on-surface font-semibold">{currentLobe.coords}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap ${
              isIsolatingTracts
                ? "bg-secondary text-on-secondary shadow-sm ring-1 ring-secondary/50"
                : "bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-on-primary-container"
            }`}
            onClick={onToggleIsolate}
            title="عزل المسار العصبي للفص المختار وتعتيم باقي المسارات"
          >
            <span className="material-symbols-outlined text-[15px]">
              {isIsolatingTracts ? "flare" : "timeline"}
            </span>
            <span>{isIsolatingTracts ? "إلغاء عزل المسار" : "عزل الألياف التعليمية"}</span>
          </button>

          {isMobileSheet && onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface text-xs font-semibold"
            >
              تم
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
