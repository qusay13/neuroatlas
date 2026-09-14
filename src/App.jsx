import { useState, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center } from "@react-three/drei";
import BrainModel from "./components/BrainModel";
import NeuralTracts from "./components/NeuralTracts";
import { neuroDatabase } from "./data/neuroDatabase";
import regions from "./data/regions";

// استيراد الأقسام السريرية والأدوات التحليلية الجديدة
import ClinicalAnatomyView from "./components/views/ClinicalAnatomyView";
import ClinicalCasesView from "./components/views/ClinicalCasesView";
import MedicalGlossaryView from "./components/views/MedicalGlossaryView";
import DiagnosticModeView from "./components/views/DiagnosticModeView";
import NeuroScalesView from "./components/views/NeuroScalesView";
import ResearchGuideView from "./components/views/ResearchGuideView";
import PsychiatricDisordersView from "./components/views/PsychiatricDisordersView";

const NAV_ITEMS_ACADEMIC = [
  { id: "explorer", label: "المستكشف الثلاثي الأبعاد", icon: "view_in_ar" },
  { id: "anatomy", label: "التشريح السريري", icon: "neurology" },
  { id: "psychiatry", label: "الاضطرابات النفسية والدماغ", icon: "psychology" },
  { id: "cases", label: "دراسات الحالات العصبية", icon: "clinical_notes" },
  { id: "glossary", label: "المصطلحات الطبية", icon: "menu_book" },
];

const NAV_ITEMS_TOOLS = [
  { id: "diagnostic_mode", label: "نمط الفحص السريري", icon: "upload_file" },
  { id: "scales", label: "مقياس القياس العصبي", icon: "straighten" },
  { id: "research_guide", label: "دليل الأطباء والباحثين", icon: "school" },
];

export default function App() {
  const [activeNavSection, setActiveNavSection] = useState("explorer");
  const [selectedLobeKey, setSelectedLobeKey] = useState("frontal");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'pathology' | 'diagnostics'
  const [isIsolatingTracts, setIsIsolatingTracts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle states
  const [showTracts, setShowTracts] = useState(true);
  const [showPlanes, setShowPlanes] = useState(false);
  const [isTranslucent, setIsTranslucent] = useState(false);

  const controlsRef = useRef();

  const currentLobe = neuroDatabase[selectedLobeKey] || neuroDatabase.frontal;

  const handleSelectLobe = (lobeKey) => {
    setSelectedLobeKey(lobeKey);
    setSelectedRegion(null); // مسح التحديد الدقيق للعودة لنظرة الفص
  };

  const handleSelectRegionFrom3D = (region) => {
    setSelectedRegion(region);
    if (region && region.lobe) {
      setSelectedLobeKey(region.lobe);
    }
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleToggleIsolate = () => {
    setIsIsolatingTracts((prev) => !prev);
  };

  // تصفية المناطق عند البحث
  const filteredRegions = searchQuery.trim()
    ? regions.filter(
        (r) =>
          r.name_ar.includes(searchQuery) ||
          r.name_en.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      {/* ─── الشريط الجانبي الأيمن الثابت (Fixed Right Sidebar) ─── */}
      <aside className="fixed right-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col pt-space-md pb-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-l border-outline-variant/20">
        {/* الشعار وإصدار النظام */}
        <div className="px-space-md mb-space-lg flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-secondary transition-opacity duration-1000 animate-pulse"></div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none">
                أطلس الدماغ العصبي
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1">
                NEUROATLAS LAB
              </span>
            </div>
          </div>
          <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container text-secondary font-mono">
            v4.2
          </span>
        </div>

        {/* حقل البحث السريري */}
        <div className="px-space-md mb-space-md relative">
          <div className="bg-surface-container px-space-sm py-2 rounded-lg flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-outline text-lg">search</span>
            <input
              className="bg-transparent border-none text-on-surface placeholder-outline text-xs focus:outline-none w-full font-body-sm"
              placeholder="البحث في التراكيب والمسارات..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* قائمة نتائج البحث السريع */}
          {filteredRegions.length > 0 && (
            <div className="absolute left-space-md right-space-md top-full mt-1 bg-surface-container-high border border-outline-variant/40 rounded-lg shadow-xl z-50 max-h-56 overflow-y-auto p-1 space-y-1">
              {filteredRegions.map((reg) => (
                <button
                  key={reg.id}
                  className="w-full text-right px-2 py-1.5 rounded hover:bg-primary-container hover:text-on-primary-container text-xs flex flex-col transition-colors"
                  onClick={() => {
                    handleSelectRegionFrom3D(reg);
                    setActiveNavSection("explorer");
                    setSearchQuery("");
                  }}
                >
                  <span className="font-semibold">{reg.name_ar}</span>
                  <span className="text-[10px] opacity-70 font-mono">{reg.name_en}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* الأقسام السريرية والأكاديمية */}
        <div className="px-space-md mb-space-xs">
          <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
            الأقسام السريرية الأكاديمية
          </span>
        </div>
        <nav className="flex-1 px-space-sm space-y-1">
          {NAV_ITEMS_ACADEMIC.map((item) => {
            const isActive = activeNavSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNavSection(item.id)}
                className={`w-full flex items-center gap-space-sm px-space-md py-space-sm transition-all text-right ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-title-sm font-semibold rounded-lg shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg font-body-md text-body-md"
                }`}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-space-md px-space-sm mb-space-xs">
            <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
              أدوات التشخيص والتحليل
            </span>
          </div>

          {NAV_ITEMS_TOOLS.map((item) => {
            const isActive = activeNavSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNavSection(item.id)}
                className={`w-full flex items-center gap-space-sm px-space-md py-space-sm transition-all text-right ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-title-sm font-semibold rounded-lg shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg font-body-md text-body-md"
                }`}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* مؤشر دقة الاسترجاع الحجمي */}
        <div className="px-space-md pt-space-sm border-t-0 bg-surface-container-lowest mx-space-sm rounded-xl p-space-sm">
          <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mb-1">
            <span>دقة الاسترجاع الحجمي</span>
            <span className="font-mono text-secondary">0.4mm³</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-secondary h-full w-[88%]"></div>
          </div>
        </div>
      </aside>

      {/* ─── الحيز الرئيسي الأيسر (Left/Center Content) ─── */}
      <div className="pr-72">
        {/* البار العلوي الأفقي (Top Horizontal Header) */}
        <header className="fixed top-0 right-72 left-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter-desktop border-b border-outline-variant/20">
          <div className="flex items-center gap-space-md">
            {activeNavSection !== "explorer" ? (
              <button
                onClick={() => setActiveNavSection("explorer")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
                <span>العودة للمستكشف ثلاثي الأبعاد</span>
              </button>
            ) : (
              <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-space-sm py-1.5 rounded">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  location_searching
                </span>
                <span className="font-mono">MNI152: [X: +14.2, Y: -28.6, Z: +42.1]</span>
              </div>
            )}
            <div className="hidden xl:flex items-center gap-space-xs text-outline font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span>
                {activeNavSection === "explorer"
                  ? "وضع الاتصال العصبي الوظيفي (fMRI/DTI) نشط"
                  : activeNavSection === "anatomy"
                  ? "أطلس التشريح السريري والتنظيم الطوبوغرافي"
                  : activeNavSection === "psychiatry"
                  ? "أطلس الاضطرابات النفسية والعصبية والأساس العضوي للدماغ"
                  : activeNavSection === "cases"
                  ? "أرشيف دراسات الحالات العصبية السريرية"
                  : activeNavSection === "glossary"
                  ? "معجم المصطلحات الطبية والعصبية"
                  : activeNavSection === "diagnostic_mode"
                  ? "محرك الفحص والاستدلال السريري الموضعي"
                  : activeNavSection === "scales"
                  ? "مقاييس التقييم العصبي السريري (GCS / NIHSS)"
                  : "دليل الأطباء والباحثين في العلوم العصبية"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => setActiveNavSection("diagnostic_mode")}
              className={`h-9 px-space-sm rounded flex items-center gap-space-xs font-label-sm text-label-sm transition-colors ${
                activeNavSection === "diagnostic_mode"
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>المعايرة المقطعية</span>
            </button>
            <button
              onClick={() => setActiveNavSection("anatomy")}
              className={`h-9 px-space-sm rounded flex items-center gap-space-xs font-label-sm text-label-sm transition-colors ${
                activeNavSection === "anatomy"
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">layers</span>
              <span>الطبقات النسيجية</span>
            </button>
            <div className="h-6 w-[1px] bg-surface-container-highest mx-space-xs"></div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </header>

        {/* مساحة العمل (Main Spatial Deck / Clinical Views) */}
        <main className="relative pt-16 bg-surface min-h-screen w-full px-gutter-desktop py-space-lg">
          <div className="flex flex-col w-full relative -mt-space-lg">
            {activeNavSection === "explorer" ? (
              /* إطار فضاء العمل ثلاثي الأبعاد (100vh spatial viewport shell) */
              <div className="relative w-full h-[calc(100vh-5rem)] overflow-hidden rounded-xl bg-surface-container-lowest flex flex-col justify-between p-gutter-desktop shadow-2xl border border-outline-variant/30">
              {/* شبكة الإحداثيات الاستريوتاكتية الدقيقة (Stereotaxic Grid Overlay) */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern
                      height="64"
                      id="neuro-grid"
                      patternUnits="userSpaceOnUse"
                      width="64"
                    >
                      <path
                        className="text-outline-variant"
                        d="M 64 0 L 0 0 0 64"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      ></path>
                      <circle
                        className="text-outline"
                        cx="32"
                        cy="32"
                        fill="currentColor"
                        r="0.75"
                      ></circle>
                    </pattern>
                  </defs>
                  <rect fill="url(#neuro-grid)" height="100%" width="100%"></rect>
                </svg>

                {/* الحلقات البصرية المركزية (Optical Reticles) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 rounded-full border-[0.5px] border-outline-variant/30 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-[0.5px] border-outline-variant/40 border-dashed"></div>
                  </div>
                </div>
              </div>

              {/* طبقة الكانفاس الحقيقية لمجسم الدماغ (3D Canvas Layer) */}
              <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
                <Canvas
                  camera={{ position: [0, 0, 7.5], fov: 42 }}
                  style={{ background: "transparent" }}
                  gl={{
                    powerPreference: "default",
                    antialias: true,
                    alpha: true,
                  }}
                >
                  {/* إضاءة سريرية ناعمة استوديو (بدون أي نيون) */}
                  <ambientLight intensity={1.4} color="#d5e1e8" />
                  <directionalLight position={[6, 10, 8]} intensity={1.6} color="#ffffff" />
                  <directionalLight position={[-6, -6, -4]} intensity={0.8} color="#94a3b8" />
                  <directionalLight position={[0, -5, -6]} intensity={0.5} color="#b0c4de" />

                  {/* محور مسارات ألياف خفيف عند تفعيل المحاور */}
                  {showPlanes && (
                    <gridHelper
                      args={[6, 12, "#3e5c76", "#1e293b"]}
                      position={[0, -1.8, 0]}
                    />
                  )}

                  <Suspense fallback={null}>
                    {/* مجسم الدماغ التشريحي المرجعي */}
                    <Center scale={0.00032} position={[0.75, -0.1, 0]}>
                      <BrainModel
                        selectedLobeKey={selectedLobeKey}
                        selectedRegion={selectedRegion}
                        hoveredRegion={hoveredRegion}
                        onSelectRegion={handleSelectRegionFrom3D}
                        onHoverRegion={setHoveredRegion}
                        cortexOpacity={
                          isIsolatingTracts
                            ? 0.18
                            : isTranslucent
                            ? 0.25
                            : showTracts
                            ? 0.42
                            : 1.0
                        }
                      />
                    </Center>

                    {/* المسارات العصبية الحقيقية (DTI Fiber Tractography in World Space) */}
                    <NeuralTracts
                      visible={showTracts}
                      selectedLobeKey={selectedLobeKey}
                      isIsolating={isIsolatingTracts}
                    />
                  </Suspense>

                  <OrbitControls
                    ref={controlsRef}
                    makeDefault
                    enablePan={false}
                    autoRotate={!selectedRegion}
                    autoRotateSpeed={0.6}
                  />
                </Canvas>
              </div>

              {/* ─── الشريط العلوي العائم (Top HUD Bar) ─── */}
              <header className="relative z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
                {/* شريط اختيار الفصوص السريع (Lobe Quick-Selection Strip) */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-container-low/90 backdrop-blur-md shadow-md border border-outline-variant/20 overflow-x-auto">
                  {Object.entries(neuroDatabase).map(([key, data]) => {
                    const isActive = selectedLobeKey === key;
                    return (
                      <button
                        key={key}
                        className={`lobe-btn px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-primary-container text-on-primary-container shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                        }`}
                        onClick={() => handleSelectLobe(key)}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: data.highlightColor }}
                        ></span>
                        <span>{data.title}</span>
                        <span className="opacity-60 font-mono text-[11px]">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* معلومات المعايرة السريرية (Calibration Meta Bar) */}
                <div className="hidden 2xl:flex items-center gap-space-md p-1.5 px-space-md rounded-lg bg-surface-container-low/75 backdrop-blur-md shadow-sm border border-outline-variant/20">
                  <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
                    <span>العرض: 3D Reconstructed Mesh (MNI Standard)</span>
                  </div>
                  <div className="h-3 w-0.5 bg-surface-container-highest"></div>
                  <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm font-mono">
                    <span>FOV: 220mm</span>
                    <span className="opacity-40">|</span>
                    <span>ISO: 0.5T Submillimeter</span>
                  </div>
                </div>
              </header>

              {/* ─── مساحة التفاعل الرئيسية: بطاقة الفحص السريري + تلميح الفأرة ─── */}
              <div className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-space-md items-center my-2 pointer-events-none min-h-0">
                {/* دليل التدوير بالماوس (Bottom-Right Cue) */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-end h-full pointer-events-none pb-1">
                  <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-surface-container-low/90 backdrop-blur-md shadow-md w-fit pointer-events-auto border border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      gesture
                    </span>
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                      اسحب بالماوس للتدوير الحر بزاوية 360°
                    </span>
                    <span className="text-outline text-body-sm mx-1">|</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      انقر المباشر على التراكيب للتشخيص الفوري
                    </span>
                  </div>
                </div>

                {/* بطاقة الفحص السريري العلمية الزجاجية على اليسار (Left Scientific Card) */}
                <div className="lg:col-span-5 xl:col-span-4 w-full h-[580px] max-h-[68vh] flex flex-col pointer-events-auto">
                  <div className="relative w-full h-full flex flex-col rounded-xl bg-surface-container/90 backdrop-blur-xl shadow-2xl overflow-hidden border border-outline-variant/30">
                    {/* ترويسة البطاقة */}
                    <div className="p-space-md bg-surface-container-high/90 flex flex-col gap-space-xs border-b border-outline-variant/30">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-secondary-container text-on-secondary-container tracking-wider">
                          {selectedRegion
                            ? `SUBREGION: ${selectedRegion.name_en.toUpperCase()}`
                            : currentLobe.tag}
                        </span>
                        <div className="flex items-center gap-1 font-label-sm text-label-sm text-secondary font-mono">
                          <span
                            className={`w-1.5 h-1.5 rounded-full bg-secondary ${
                              isIsolatingTracts ? "bg-tertiary" : "animate-ping"
                            }`}
                          ></span>
                          <span className="whitespace-nowrap font-mono text-[11px]">
                            {isIsolatingTracts
                              ? "TRACT ISOLATED"
                              : selectedRegion
                              ? "FOCAL INSPECTION"
                              : "ACTIVE INSPECTION"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-1 flex items-baseline justify-between">
                        <div>
                          <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                            {selectedRegion ? selectedRegion.name_ar : currentLobe.title}
                          </h1>
                          <span className="font-label-md text-label-md text-on-surface-variant font-mono">
                            {selectedRegion ? selectedRegion.name_en : currentLobe.latin}
                          </span>
                        </div>
                        <div className="text-left font-mono">
                          <span className="text-outline font-label-sm text-label-sm block">
                            الحجم النسبي
                          </span>
                          <span className="font-data-metric text-data-metric text-secondary leading-none">
                            {currentLobe.volume}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* أزرار التبويبات الثلاثة للطبقات السريرية */}
                    <div className="flex items-center bg-surface-container-low px-space-md gap-space-sm pt-space-xs border-b border-outline-variant/20">
                      <button
                        className={`detail-tab-btn py-2 px-space-xs font-title-sm text-title-sm transition-colors ${
                          activeTab === "overview"
                            ? "text-secondary border-b-2 border-secondary font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                        onClick={() => setActiveTab("overview")}
                      >
                        التشريح والوظيفة
                      </button>
                      <button
                        className={`detail-tab-btn py-2 px-space-xs font-title-sm text-title-sm transition-colors ${
                          activeTab === "pathology"
                            ? "text-secondary border-b-2 border-secondary font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                        onClick={() => setActiveTab("pathology")}
                      >
                        المضاعفات السريرية والتأثير النفسي
                      </button>
                      <button
                        className={`detail-tab-btn py-2 px-space-xs font-title-sm text-title-sm transition-colors ${
                          activeTab === "diagnostics"
                            ? "text-secondary border-b-2 border-secondary font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                        onClick={() => setActiveTab("diagnostics")}
                      >
                        الفحوصات العصبية
                      </button>
                    </div>

                    {/* محتوى البطاقة التفاعلي القابل للتمرير */}
                    <div className="flex-1 p-space-md overflow-y-auto space-y-space-md text-right">
                      {/* التبويب 1: النبذة التشريحية والارتباطات الوظيفية */}
                      {activeTab === "overview" && (
                        <div className="space-y-space-md">
                          <div>
                            <div className="flex items-center gap-space-xs mb-space-xs">
                              <span className="material-symbols-outlined text-secondary text-[18px]">
                                account_tree
                              </span>
                              <h2 className="font-title-md text-title-md text-on-surface">
                                النبذة التشريحية والارتباطات الوظيفية
                              </h2>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                              {selectedRegion ? selectedRegion.function : currentLobe.overview}
                            </p>
                          </div>

                          {/* محاور الوظائف الفرعية */}
                          <div className="grid grid-cols-2 gap-space-sm">
                            <div className="p-space-sm rounded-lg bg-surface-container-lowest">
                              <span className="font-label-sm text-label-sm text-outline block">
                                {currentLobe.fn1Label}
                              </span>
                              <span className="font-title-sm text-title-sm text-on-surface mt-1 block">
                                {currentLobe.fn1Desc}
                              </span>
                            </div>
                            <div className="p-space-sm rounded-lg bg-surface-container-lowest">
                              <span className="font-label-sm text-label-sm text-outline block">
                                {currentLobe.fn2Label}
                              </span>
                              <span className="font-title-sm text-title-sm text-on-surface mt-1 block">
                                {currentLobe.fn2Desc}
                              </span>
                            </div>
                          </div>

                          {/* مؤشر سلامة المسارات العصبية */}
                          <div className="p-space-sm rounded-lg bg-surface-container-high/60">
                            <div className="flex items-center justify-between text-on-surface mb-1">
                              <span className="font-title-sm text-title-sm">
                                كثافة المسارات العصبية الحركية (Corticospinal)
                              </span>
                              <span className="font-mono text-secondary font-label-sm text-label-sm">
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

                      {/* التبويب 2: المضاعفات السريرية والتأثير النفسي والسلوكي */}
                      {activeTab === "pathology" && (
                        <div className="space-y-space-sm">
                          <div className="flex items-center gap-space-xs mb-space-xs">
                            <span className="material-symbols-outlined text-tertiary text-[18px]">
                              warning
                            </span>
                            <h2 className="font-title-md text-title-md text-on-surface">
                              الاضطرابات والأعطال السريرية والتأثير النفسي
                            </h2>
                          </div>

                          {/* إذا تم تحديد تلافيف معين، نعرض تأثيره النفسي المتخصص أولاً */}
                          {selectedRegion && selectedRegion.psychological_impact && (
                            <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-secondary/40 mb-2">
                              <div className="flex items-center gap-1 text-secondary font-title-sm text-title-sm mb-1">
                                <span className="material-symbols-outlined text-[16px]">
                                  psychology
                                </span>
                                <span>التأثير النفسي والسلوكي لـ {selectedRegion.name_ar}:</span>
                              </div>
                              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                                {selectedRegion.psychological_impact}
                              </p>
                            </div>
                          )}

                          <ul className="space-y-2">
                            {currentLobe.pathologies.map((path, idx) => (
                              <li
                                key={idx}
                                className="p-space-sm rounded-lg bg-surface-container-lowest flex items-start gap-space-sm"
                              >
                                <span className="material-symbols-outlined text-error text-[18px] mt-0.5">
                                  {path.icon}
                                </span>
                                <div>
                                  <strong className="font-title-sm text-title-sm text-on-surface block">
                                    {path.title}
                                  </strong>
                                  <span className="font-body-sm text-body-sm text-on-surface-variant">
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
                        <div className="space-y-space-sm">
                          <div className="flex items-center gap-space-xs mb-space-xs">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              upload_file
                            </span>
                            <h2 className="font-title-md text-title-md text-on-surface">
                              بروتوكولات الفحص والتقييم السريري
                            </h2>
                          </div>
                          <div className="space-y-2">
                            {currentLobe.diagnostics.map((diag, idx) => (
                              <div
                                key={idx}
                                className="p-space-sm rounded-lg bg-surface-container-lowest"
                              >
                                <div className="flex justify-between items-center text-on-surface mb-1">
                                  <span className="font-title-sm text-title-sm">{diag.title}</span>
                                  <span className="font-label-sm text-label-sm text-secondary font-mono">
                                    {diag.tag}
                                  </span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                  {diag.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* أسفل البطاقة: الإحداثيات الاستريوتاكتية وزر العزل */}
                    <div className="p-space-sm bg-surface-container-lowest/90 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/30">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-outline" dir="ltr">
                        <span className="text-secondary/80">TALAIRACH:</span>
                        <span className="text-on-surface font-semibold">{currentLobe.coords}</span>
                      </div>
                      <button
                        className={`px-space-sm py-1 rounded transition-colors text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap ${
                          isIsolatingTracts
                            ? "bg-secondary text-on-secondary shadow-sm ring-1 ring-secondary/50"
                            : "bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-on-primary-container"
                        }`}
                        onClick={handleToggleIsolate}
                        title="عزل المسار العصبي للفص المختار وتعتيم باقي المسارات"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isIsolatingTracts ? "flare" : "timeline"}
                        </span>
                        <span>{isIsolatingTracts ? "إلغاء عزل المسار" : "عزل المسار العصبي"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── شريط الأدوات السفلي العائم والمراجع (Bottom Controls HUD) ─── */}
              <footer className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-space-md pt-space-sm pointer-events-auto">
                {/* أزرار التحكم في طبقات المنظور */}
                <div className="flex items-center gap-space-xs bg-surface-container-low/85 backdrop-blur-md p-1 rounded-lg shadow-md border border-outline-variant/20">
                  <button
                    className={`px-space-sm py-1.5 rounded-lg font-title-sm text-title-sm flex items-center gap-space-xs transition-colors ${
                      showTracts
                        ? "text-on-surface bg-surface-container-high"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                    onClick={() => setShowTracts(!showTracts)}
                  >
                    <span className="material-symbols-outlined text-secondary text-[16px]">
                      polyline
                    </span>
                    <span>المسارات العصبية (DTI)</span>
                  </button>

                  <button
                    className={`px-space-sm py-1.5 rounded-lg font-title-sm text-title-sm flex items-center gap-space-xs transition-colors ${
                      showPlanes
                        ? "text-on-surface bg-surface-container-high"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                    onClick={() => setShowPlanes(!showPlanes)}
                  >
                    <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
                    <span>المحاور (Sagittal / Axial)</span>
                  </button>

                  <button
                    className={`px-space-sm py-1.5 rounded-lg font-title-sm text-title-sm flex items-center gap-space-xs transition-colors ${
                      isTranslucent
                        ? "text-on-surface bg-surface-container-high"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                    onClick={() => setIsTranslucent(!isTranslucent)}
                  >
                    <span className="material-symbols-outlined text-[16px]">opacity</span>
                    <span>شفافية القشرة (%60)</span>
                  </button>

                  <div className="h-4 w-px bg-surface-container-highest mx-1"></div>

                  <button
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    onClick={resetCamera}
                    title="إعادة ضبط زاوية الرؤية"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  </button>
                </div>

                {/* اعتمادية المعايير السريرية */}
                <div className="flex items-center gap-space-xs text-on-surface-variant/70 font-body-sm text-body-sm bg-surface-container-lowest/60 px-space-md py-1 rounded-lg border border-outline-variant/10">
                  <span className="material-symbols-outlined text-secondary text-[16px]">
                    verified
                  </span>
                  <span>
                    البيانات مستندة إلى المراجع الأكاديمية لطب الأعصاب والتشريح العصبي السريري
                    (Clinical Neuroanatomy Reference Standard)
                  </span>
                </div>
              </footer>
            </div>
            ) : (
              /* إطار عارض الأقسام السريرية والأدوات التحليلية */
              <div className="relative w-full min-h-[calc(100vh-5rem)] overflow-hidden rounded-xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 flex flex-col">
                {activeNavSection === "anatomy" && (
                  <ClinicalAnatomyView
                    onSelectLobeAndSwitchTo3D={(lobe) => {
                      setSelectedLobeKey(lobe);
                      setSelectedRegion(null);
                      setActiveNavSection("explorer");
                    }}
                  />
                )}
                {activeNavSection === "psychiatry" && (
                  <PsychiatricDisordersView
                    onSelectLobeAndSwitchTo3D={(lobe) => {
                      setSelectedLobeKey(lobe);
                      setSelectedRegion(null);
                      setActiveNavSection("explorer");
                    }}
                  />
                )}
                {activeNavSection === "cases" && (
                  <ClinicalCasesView
                    onSelectLobeAndSwitchTo3D={(lobe) => {
                      setSelectedLobeKey(lobe);
                      setSelectedRegion(null);
                      setActiveNavSection("explorer");
                    }}
                  />
                )}
                {activeNavSection === "glossary" && <MedicalGlossaryView />}
                {activeNavSection === "diagnostic_mode" && (
                  <DiagnosticModeView
                    onSelectLobeAndSwitchTo3D={(lobe) => {
                      setSelectedLobeKey(lobe);
                      setSelectedRegion(null);
                      setActiveNavSection("explorer");
                    }}
                  />
                )}
                {activeNavSection === "scales" && <NeuroScalesView />}
                {activeNavSection === "research_guide" && <ResearchGuideView />}
              </div>
            )}
          </div>
        </main>

        {/* ─── الفوتر الأكاديمي السريري (Academic Clinical Footer) ─── */}
        <footer className="w-full bg-surface-container-lowest py-space-xl px-gutter-desktop mt-space-xl border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-space-lg text-right font-body-sm text-body-sm">
            <div className="space-y-space-xs">
              <div className="font-headline-sm text-headline-sm text-on-surface">
                أطلس الدماغ التفاعلي | NeuroAtlas
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                منصة سريرية وبحثية متقدمة مخصصة لجراحي الأعصاب، أطباء الدماغ والأعصاب، والباحثين في
                العلوم العصبية المعرفية. تعتمد على معايير الإحداثيات الاستريوتاكتية الفضائية
                المعتمدة دولياً.
              </p>
            </div>
            <div className="space-y-space-xs">
              <div className="font-title-sm text-title-sm text-on-surface">
                المراجع والاعتمادات الطبية
              </div>
              <ul className="text-on-surface-variant space-y-1 font-label-sm text-label-sm">
                <li>• International Consortium for Brain Mapping (ICBM-152)</li>
                <li>• Talairach &amp; Tournoux Stereotaxic Co-planar Grid System</li>
                <li>• Federative International Programme on Anatomical Terminology (FIPAT)</li>
              </ul>
            </div>
            <div className="space-y-space-xs">
              <div className="font-title-sm text-title-sm text-on-surface">
                إخلاء المسؤولية السريرية
              </div>
              <p className="text-outline leading-relaxed">
                هذا الأطلس مخصص للأغراض التعليمية والأكاديمية ودعم القرارات الاسترشادية فقط. لا يُغني
                عن الفحص السريري المباشر، وصور الرنين المغناطيسي التشخيصية الخاصة بالمريض، ولا يعتبر
                تصريحاً جراحياً منفرداً.
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-space-lg mt-space-lg flex flex-col md:flex-row items-center justify-between text-on-surface-variant font-label-sm text-label-sm gap-space-sm border-t border-outline-variant/10">
            <div className="flex items-center gap-space-md">
              <span className="font-mono">SYSTEM REV: 2024.11-CLINICAL</span>
              <span>المركز الجامعي لأبحاث العلوم العصبية</span>
            </div>
            <div>جميع الحقوق محفوظة © 2024 أطلس الدماغ العصبي.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
