import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center } from "@react-three/drei";
import BrainModel from "./components/BrainModel";
import NeuralGuide from "./components/NeuralGuide";
import { neuroDatabase, wholeBrainData } from "./data/neuroDatabase";
import regions from "./data/regions";

// استيراد الأقسام السريرية والأدوات التحليلية الجديدة
import ClinicalAnatomyView from "./components/views/ClinicalAnatomyView";
import ClinicalCasesView from "./components/views/ClinicalCasesView";
import MedicalGlossaryView from "./components/views/MedicalGlossaryView";
import DiagnosticModeView from "./components/views/DiagnosticModeView";
import NeuroScalesView from "./components/views/NeuroScalesView";
import ResearchGuideView from "./components/views/ResearchGuideView";
import PsychiatricDisordersView from "./components/views/PsychiatricDisordersView";
import ClinicalDetailsPanel from "./components/ClinicalDetailsPanel";

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
  const [selectedLobeKey, setSelectedLobeKey] = useState(null); // null = الحالة الطبيعية المبدئية لكامل الدماغ
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'pathology' | 'diagnostics'
  const [isIsolatingTracts, setIsIsolatingTracts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mobile responsive states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const checkResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", checkResize);
    return () => window.removeEventListener("resize", checkResize);
  }, []);

  // الحالة المبدئية للمجسم: مصمت بحالته الطبيعية والمسارات مغلقة حتى يطلبها المستخدم
  const [showTracts, setShowTracts] = useState(false);
  const [showPlanes, setShowPlanes] = useState(false);
  const [isTranslucent, setIsTranslucent] = useState(false);
  const [neuralMode, setNeuralMode] = useState(null);
  const [selectedStructureId, setSelectedStructureId] = useState(null);

  const controlsRef = useRef();

  const inferiorView = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.object.up.set(0, 0, -1);
    controls.target.set(isMobile ? 0 : 0.65, isMobile ? 0 : -0.1, 0);
    controls.object.position.set(controls.target.x, controls.target.y - (isMobile ? 8.5 : 7), 0.001);
    controls.update();
  };

  const openNeuralGuide = (mode) => {
    setNeuralMode(mode);
    setSelectedStructureId(mode === "cranial" ? "cn-01" : "tract-arcuate");
    setShowTracts(mode === "tracts");
    setIsIsolatingTracts(false);
    setSelectedLobeKey(null);
    setSelectedRegion(null);
    if (mode === "cranial") inferiorView();
    else if (controlsRef.current) {
      controlsRef.current.object.up.set(0, 1, 0);
      controlsRef.current.reset();
    }
  };

  const selectNeuralStructure = (id) => {
    setSelectedStructureId(id);
    const mode = id.startsWith("cn-") ? "cranial" : "tracts";
    setNeuralMode(mode);
    setShowTracts(mode === "tracts");
    setIsIsolatingTracts(false);
  };

  const closeNeuralGuide = () => {
    setNeuralMode(null);
    setSelectedStructureId(null);
    if (controlsRef.current) {
      controlsRef.current.object.up.set(0, 1, 0);
      controlsRef.current.reset();
    }
  };

  const currentLobe = selectedLobeKey
    ? neuroDatabase[selectedLobeKey] || wholeBrainData
    : wholeBrainData;

  const handleSelectLobe = (lobeKey) => {
    closeNeuralGuide();
    setSelectedLobeKey(lobeKey);
    setSelectedRegion(null); // مسح التحديد الدقيق للعودة لنظرة الفص
  };

  const handleSelectRegionFrom3D = (region) => {
    setNeuralMode(null);
    setSelectedStructureId(null);
    setSelectedRegion(region);
    if (region && region.lobe) {
      setSelectedLobeKey(region.lobe);
    }
  };

  const resetCamera = () => {
    setNeuralMode(null);
    setSelectedStructureId(null);
    if (controlsRef.current) {
      controlsRef.current.object.up.set(0, 1, 0);
      controlsRef.current.reset();
    }
    setSelectedLobeKey(null);
    setSelectedRegion(null);
    setShowTracts(false);
    setIsTranslucent(false);
    setIsIsolatingTracts(false);
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
      {/* ─── خلفية معتمة للجوال عند فتح القائمة الجانبية ─── */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity"
        />
      )}

      {/* ─── الشريط الجانبي الأيمن المتجاوب (Responsive Right Sidebar) ─── */}
      <aside
        className={`fixed right-0 top-0 h-full w-72 max-w-[85vw] bg-surface-container-low z-50 flex flex-col pt-space-md pb-space-lg shadow-2xl lg:shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-l border-outline-variant/20 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* الشعار وإصدار النظام وزر الإغلاق في الجوال */}
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
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container text-secondary font-mono">
              v4.2
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
              title="إغلاق القائمة"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
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
                    setMobileMenuOpen(false);
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
        <nav className="flex-1 px-space-sm space-y-1 overflow-y-auto">
          {NAV_ITEMS_ACADEMIC.map((item) => {
            const isActive = activeNavSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNavSection(item.id);
                  setMobileMenuOpen(false);
                }}
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
                onClick={() => {
                  setActiveNavSection(item.id);
                  setMobileMenuOpen(false);
                }}
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
      <div className="lg:pr-72 pr-0 w-full min-w-0 transition-all">
        {/* البار العلوي الأفقي (Top Horizontal Header) */}
        <header className="fixed top-0 lg:right-72 right-0 left-0 h-14 sm:h-16 bg-surface/85 backdrop-blur-xl shadow-sm z-40 flex items-center justify-between px-3 sm:px-6 border-b border-outline-variant/20">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* زر فتح القائمة الجانبية للجوال */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-on-surface hover:bg-surface-container flex items-center justify-center border border-outline-variant/25 transition-colors"
              aria-label="القائمة الرئيسية"
              title="القائمة الرئيسية"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            {activeNavSection !== "explorer" ? (
              <button
                onClick={() => setActiveNavSection("explorer")}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:shadow-md transition-all whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
                <span className="hidden xs:inline">العودة للمستكشف 3D</span>
                <span className="xs:hidden">3D</span>
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-space-sm py-1.5 rounded">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  location_searching
                </span>
                <span className="font-mono">MNI152: [X:+14, Y:-28, Z:+42]</span>
              </div>
            )}
            <div className="hidden xl:flex items-center gap-space-xs text-outline font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span>
                {activeNavSection === "explorer"
                  ? "عرض تشريحي تعليمي ثلاثي الأبعاد"
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

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveNavSection("diagnostic_mode")}
              className={`h-8 sm:h-9 px-2 sm:px-3 rounded flex items-center gap-1 sm:gap-1.5 text-xs transition-colors ${
                activeNavSection === "diagnostic_mode"
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
              title="نمط الفحص السريري"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span className="hidden md:inline font-label-sm">المعايرة المقطعية</span>
            </button>
            <button
              onClick={() => setActiveNavSection("anatomy")}
              className={`h-8 sm:h-9 px-2 sm:px-3 rounded flex items-center gap-1 sm:gap-1.5 text-xs transition-colors ${
                activeNavSection === "anatomy"
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
              title="التشريح السريري"
            >
              <span className="material-symbols-outlined text-[18px]">layers</span>
              <span className="hidden md:inline font-label-sm">الطبقات النسيجية</span>
            </button>
            <div className="h-5 sm:h-6 w-[1px] bg-surface-container-highest mx-0.5 sm:mx-1"></div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[16px] sm:text-[18px]">person</span>
            </div>
          </div>
        </header>

        {/* مساحة العمل (Main Spatial Deck / Clinical Views) */}
        <main className="relative pt-14 sm:pt-16 bg-surface min-h-screen w-full px-2 sm:px-4 lg:px-gutter-desktop py-space-sm sm:py-space-lg">
          <div className="flex flex-col w-full relative -mt-space-sm sm:-mt-space-lg">
            {activeNavSection === "explorer" ? (
              /* إطار فضاء العمل ثلاثي الأبعاد (100vh spatial viewport shell) */
              <div className="relative w-full h-[calc(100vh-4.5rem)] min-h-[560px] overflow-hidden rounded-xl bg-surface-container-lowest flex flex-col justify-between p-2 sm:p-4 lg:p-gutter-desktop shadow-2xl border border-outline-variant/30">
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
                    <Center
                      scale={isMobile ? 0.00026 : 0.00028}
                      position={isMobile ? [0, 0, 0] : [0.65, -0.1, 0]}
                    >
                      <BrainModel
                        neuralMode={neuralMode}
                        selectedStructureId={selectedStructureId}
                        onSelectStructure={selectNeuralStructure}
                        showTracts={showTracts}
                        isIsolatingTracts={isIsolatingTracts}
                        selectedLobeKey={selectedLobeKey}
                        selectedRegion={selectedRegion}
                        hoveredRegion={hoveredRegion}
                        onSelectRegion={handleSelectRegionFrom3D}
                        onHoverRegion={setHoveredRegion}
                        cortexOpacity={
                          neuralMode === "tracts" ? 0.12
                            : neuralMode === "cranial" ? (isTranslucent ? 0.12 : 1)
                            : isIsolatingTracts
                            ? 0.18
                            : isTranslucent
                            ? 0.25
                            : showTracts
                            ? 0.42
                            : 1.0
                        }
                      />
                    </Center>

                  </Suspense>

                  <OrbitControls
                    ref={controlsRef}
                    makeDefault
                    enablePan={false}
                    autoRotate={!selectedRegion && !neuralMode}
                    autoRotateSpeed={0.6}
                  />
                </Canvas>
              </div>

              {/* ─── الشريط العلوي العائم (Top HUD Bar) ─── */}
              <header className="relative z-20 flex flex-col gap-1.5 pointer-events-auto w-full">
                <div className="flex items-center justify-between gap-1.5 w-full">
                  {/* شريط اختيار الفصوص السريع (Lobe Quick-Selection Strip) */}
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-container-low/90 backdrop-blur-md shadow-md border border-outline-variant/20 overflow-x-auto max-w-full scrollbar-none">
                    {/* خيار كامل الدماغ بالحالة الطبيعية السليمة */}
                    <button
                      className={`lobe-btn px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                        !selectedLobeKey
                          ? "bg-primary-container text-on-primary-container shadow-sm ring-1 ring-primary/40"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                      }`}
                      onClick={() => handleSelectLobe(null)}
                    >
                      <span className="text-[13px]">🧠</span>
                      <span>كامل الدماغ (طبيعي)</span>
                    </button>

                    {Object.entries(neuroDatabase).map(([key, data]) => {
                      const isActive = selectedLobeKey === key;
                      return (
                        <button
                          key={key}
                          className={`lobe-btn px-2 sm:px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                            isActive
                              ? "bg-primary-container text-on-primary-container shadow-sm"
                              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                          }`}
                          onClick={() => handleSelectLobe(key)}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: data.highlightColor }}
                          ></span>
                          <span>{data.title}</span>
                          <span className="hidden sm:inline opacity-60 font-mono text-[11px]">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* معلومات المعايرة السريرية (Calibration Meta Bar) */}
                  <div className="hidden 2xl:flex items-center gap-space-md p-1.5 px-space-md rounded-lg bg-surface-container-low/75 backdrop-blur-md shadow-sm border border-outline-variant/20 shrink-0">
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
                </div>

                {/* ─── اللوحة السريرية المرفوعة للأعلى بالجوال (Raised Mobile Clinical Bar) ─── */}
                <div className="lg:hidden w-full bg-surface-container-low/95 backdrop-blur-xl border border-outline-variant/30 rounded-xl p-2 px-3 shadow-lg flex items-center justify-between gap-2 pointer-events-auto">
                  <div
                    className="flex items-center gap-2 min-w-0 cursor-pointer"
                    onClick={() => setMobileDetailsOpen(true)}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: selectedLobeKey ? currentLobe.highlightColor : "#d6cbbe" }}
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-on-surface truncate">
                        {selectedRegion
                          ? selectedRegion.name_ar
                          : selectedLobeKey
                          ? currentLobe.title
                          : "كامل الدماغ البشري (الحالة الطبيعية)"}
                      </div>
                      <div className="text-[10px] text-outline font-mono truncate">
                        {selectedRegion
                          ? selectedRegion.name_en
                          : selectedLobeKey
                          ? `${currentLobe.latin} • ${currentLobe.volume}`
                          : "Anatomical Baseline · 100% Volume"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {selectedLobeKey && (
                      <button
                        onClick={handleToggleIsolate}
                        className={`p-1.5 rounded-lg text-xs transition-colors flex items-center justify-center ${
                          isIsolatingTracts
                            ? "bg-secondary text-on-secondary shadow-sm"
                            : "bg-surface-container-high text-on-surface"
                        }`}
                        title={isIsolatingTracts ? "إلغاء عزل المسار" : "عزل المسار"}
                      >
                        <span className="material-symbols-outlined text-[17px]">
                          {isIsolatingTracts ? "flare" : "timeline"}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => setMobileDetailsOpen(true)}
                      className="px-2.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      <span>اللوحة السريرية</span>
                    </button>
                  </div>
                </div>
              </header>

              {/* ─── مساحة التفاعل الرئيسية: بطاقة الفحص السريري لسطح المكتب + تلميح الفأرة ─── */}
              <div className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-space-md items-end lg:items-center my-1 sm:my-2 pointer-events-none min-h-0">
                {/* دليل التدوير باللمس أو الماوس (Bottom-Right Cue) */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-end pointer-events-none pb-1">
                  <div className={`${neuralMode ? "hidden" : "inline-flex"} items-center gap-1 sm:gap-space-xs px-2.5 sm:px-space-md py-1 rounded-lg bg-surface-container-low/90 backdrop-blur-md shadow-md w-fit pointer-events-auto border border-outline-variant/20 text-[11px] sm:text-xs`}>
                    <span className="material-symbols-outlined text-secondary text-[16px] sm:text-[18px]">
                      touch_app
                    </span>
                    <span className="font-semibold text-on-surface">
                      اسحب باللمس أو الماوس للتدوير 360°
                    </span>
                    <span className="hidden sm:inline text-outline mx-1">|</span>
                    <span className="hidden sm:inline text-on-surface-variant">
                      انقر على التراكيب للتشخيص الفوري
                    </span>
                  </div>
                </div>

                {/* بطاقة الفحص السريري لسطح المكتب فقط (Desktop Only Floating Card) */}
                <div className={`${neuralMode ? "flex" : "hidden lg:flex"} lg:col-span-5 xl:col-span-4 w-full flex-col pointer-events-auto`}>
                  {neuralMode ? <NeuralGuide
                    mode={neuralMode}
                    selectedId={selectedStructureId}
                    onModeChange={openNeuralGuide}
                    onSelect={selectNeuralStructure}
                    onClose={closeNeuralGuide}
                    onInferiorView={inferiorView}
                  /> : <ClinicalDetailsPanel
                    currentLobe={currentLobe}
                    selectedRegion={selectedRegion}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isIsolatingTracts={isIsolatingTracts}
                    onToggleIsolate={handleToggleIsolate}
                    isMobileSheet={false}
                  />}
                </div>
              </div>

              {/* ─── شريط الأدوات السفلي العائم والمراجع (Bottom Controls HUD) ─── */}
              <footer className="relative z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 sm:pt-space-sm pointer-events-auto">
                {/* أزرار التحكم في طبقات المنظور */}
                <div className="flex items-center gap-1 bg-surface-container-low/85 backdrop-blur-md p-1 rounded-lg shadow-md border border-outline-variant/20 overflow-x-auto max-w-full scrollbar-none">
                  <button
                    className={`px-2 sm:px-space-sm py-1 sm:py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap ${
                      showTracts
                        ? "text-on-surface bg-surface-container-high font-semibold"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                    onClick={() => neuralMode === "tracts" ? (closeNeuralGuide(), setShowTracts(false)) : openNeuralGuide("tracts")}
                  >
                    <span className="material-symbols-outlined text-secondary text-[15px]">
                      polyline
                    </span>
                    <span>الألياف ووظائفها</span>
                  </button>

                  <button className="px-2 py-1.5 rounded-lg text-xs whitespace-nowrap shrink-0 bg-surface-container-high text-on-surface" onClick={() => openNeuralGuide("cranial")} aria-pressed={neuralMode === "cranial"}>
                    الأعصاب القحفية I–XII
                  </button>

                  <button
                    className={`px-2 sm:px-space-sm py-1 sm:py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap ${
                      showPlanes
                        ? "text-on-surface bg-surface-container-high font-semibold"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                    onClick={() => setShowPlanes(!showPlanes)}
                  >
                    <span className="material-symbols-outlined text-[15px]">grid_4x4</span>
                    <span>المحاور</span>
                  </button>

                  <button
                    className={`px-2 sm:px-space-sm py-1 sm:py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap ${
                      isTranslucent
                        ? "text-on-surface bg-surface-container-high font-semibold"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                    onClick={() => setIsTranslucent(!isTranslucent)}
                  >
                    <span className="material-symbols-outlined text-[15px]">opacity</span>
                    <span>الشفافية</span>
                  </button>

                  <div className="h-4 w-px bg-surface-container-highest mx-0.5 shrink-0"></div>

                  <button
                    className="p-1 sm:p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors shrink-0"
                    onClick={resetCamera}
                    title="إعادة ضبط زاوية الرؤية"
                  >
                    <span className="material-symbols-outlined text-[17px]">restart_alt</span>
                  </button>
                </div>

                {/* اعتمادية المعايير السريرية */}
                <div className="flex flex-col items-start gap-0.5 text-on-surface-variant/70 font-body-sm bg-surface-container-lowest/70 px-2.5 py-1 rounded-lg border border-outline-variant/10 text-[10px] sm:text-xs">
                  <div>الألياف والأعصاب وجذع الدماغ تقريبية تعليمية؛ النصف المقابل مستكمل بالانعكاس.</div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[14px]">
                      verified
                    </span>
                    <span className="line-clamp-1 sm:line-clamp-none">
                      البيانات مستندة إلى المراجع الأكاديمية لطب الأعصاب والتشريح العصبي السريري
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-secondary font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">psychology</span>
                    <span>شارك ببناء الموقع المختص عمر فهد الشمري</span>
                  </div>
                </div>
              </footer>
            </div>
            ) : (
              /* إطار عارض الأقسام السريرية والأدوات التحليلية */
              <div className="relative w-full min-h-[calc(100vh-4.5rem)] overflow-x-hidden rounded-xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 flex flex-col">
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
        <footer className="w-full bg-surface-container-lowest py-space-md sm:py-space-xl px-4 sm:px-6 lg:px-gutter-desktop mt-space-md sm:mt-space-xl border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-space-lg text-right font-body-sm text-body-sm">
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
              <div className="pt-2 text-xs text-secondary font-medium border-t border-outline-variant/15 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>شارك ببناء الموقع المختص عمر فهد الشمري</span>
              </div>
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

      {/* ─── ورقة التفاصيل السريرية المنزلقة للجوال (Mobile Clinical Bottom Sheet Modal) ─── */}
      {mobileDetailsOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end animate-fade-in">
          {/* خلفية معتمة تتيح النقر للإغلاق */}
          <div
            onClick={() => setMobileDetailsOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            aria-label="إغلاق اللوحة السريرية"
          />

          {/* محتوى الورقة المنزلقة */}
          <div className="relative z-10 w-full animate-slide-up">
            <ClinicalDetailsPanel
              currentLobe={currentLobe}
              selectedRegion={selectedRegion}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isIsolatingTracts={isIsolatingTracts}
              onToggleIsolate={handleToggleIsolate}
              onClose={() => setMobileDetailsOpen(false)}
              isMobileSheet={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
