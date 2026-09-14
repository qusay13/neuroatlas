// src/components/LobeLegend.jsx
import { useState } from "react";
import { LOBES } from "../data/lobes";
import regions from "../data/regions";

export default function LobeLegend({
  selectedRegion,
  hoveredLobe,
  onSelectRegion,
  onHoverRegion,
  onHoverLobe,
  colorMode,
  onToggleColorMode,
}) {
  const [activeLobeTab, setActiveLobeTab] = useState(null);
  const [showAllDrawer, setShowAllDrawer] = useState(false);

  // حساب عدد المناطق لكل فص
  const regionsByLobe = {};
  Object.keys(LOBES).forEach((lobeKey) => {
    regionsByLobe[lobeKey] = regions.filter((r) => r.lobe === lobeKey);
  });

  const handleLobeClick = (lobeKey) => {
    if (activeLobeTab === lobeKey) {
      setActiveLobeTab(null); // إغلاق عند الضغط مرة ثانية
    } else {
      setActiveLobeTab(lobeKey);
    }
  };

  return (
    <nav className="lobe-legend" aria-label="تقسيمات فصوص المخ">
      <div className="lobe-legend__bar">
        {/* عنوان التقسيم وزر نمط الألوان */}
        <div className="lobe-legend__actions">
          <button
            className={`legend-mode-btn ${colorMode === "lobes" ? "legend-mode-btn--active" : ""}`}
            onClick={onToggleColorMode}
            title="التبديل بين التقسيم الملون ومظهر الأنسجة الطبيعي"
          >
            <span className="legend-mode-btn__icon">
              {colorMode === "lobes" ? "🎨" : "🧠"}
            </span>
            <span className="legend-mode-btn__text">
              {colorMode === "lobes" ? "تقسيم ملون" : "مظهر طبيعي"}
            </span>
          </button>

          <button
            className={`legend-all-btn ${showAllDrawer ? "legend-all-btn--active" : ""}`}
            onClick={() => setShowAllDrawer(!showAllDrawer)}
          >
            <span>دليل المناطق (23)</span>
            <span className="legend-all-btn__arrow">{showAllDrawer ? "▲" : "▼"}</span>
          </button>
        </div>

        {/* أزرار الفصوص الستة مع مؤشرات الألوان */}
        <div className="lobe-legend__items">
          {Object.entries(LOBES).map(([lobeKey, lobe]) => {
            const count = regionsByLobe[lobeKey]?.length || 0;
            const isTabActive = activeLobeTab === lobeKey;
            const isLobeSelected = selectedRegion?.lobe === lobeKey;
            const isLobeHovered = hoveredLobe === lobeKey;

            return (
              <button
                key={lobeKey}
                className={`lobe-item ${isTabActive ? "lobe-item--tab-active" : ""} ${
                  isLobeSelected ? "lobe-item--selected" : ""
                } ${isLobeHovered ? "lobe-item--hovered" : ""}`}
                style={{ "--lobe-color": lobe.color, "--lobe-glow": lobe.glowColor }}
                onClick={() => handleLobeClick(lobeKey)}
                onMouseEnter={() => onHoverLobe && onHoverLobe(lobeKey)}
                onMouseLeave={() => onHoverLobe && onHoverLobe(null)}
              >
                <span className="lobe-item__dot" />
                <span className="lobe-item__name">{lobe.name_ar}</span>
                <span className="lobe-item__count">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* شريط المناطق التابعة للفص النشط */}
      {activeLobeTab && (
        <div className="lobe-subregions-tray">
          <div className="lobe-subregions-tray__header">
            <div className="lobe-subregions-tray__title">
              <span
                className="lobe-subregions-tray__dot"
                style={{ backgroundColor: LOBES[activeLobeTab].color }}
              />
              <span>{LOBES[activeLobeTab].name_ar}</span>
              <span className="lobe-subregions-tray__desc">
                - {LOBES[activeLobeTab].description}
              </span>
            </div>
            <button
              className="lobe-subregions-tray__close"
              onClick={() => setActiveLobeTab(null)}
            >
              ✕
            </button>
          </div>

          <div className="lobe-subregions-tray__chips">
            {regionsByLobe[activeLobeTab]?.map((region) => {
              const isSelected = selectedRegion?.id === region.id;
              return (
                <button
                  key={region.id}
                  className={`subregion-chip ${isSelected ? "subregion-chip--selected" : ""}`}
                  onClick={() => onSelectRegion(region, null)}
                  onMouseEnter={() => onHoverRegion && onHoverRegion(region)}
                  onMouseLeave={() => onHoverRegion && onHoverRegion(null)}
                >
                  <span className="subregion-chip__name">{region.name_ar}</span>
                  <span className="subregion-chip__en">{region.name_en}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* القائمة الشاملة لجميع المناطق */}
      {showAllDrawer && (
        <div className="all-regions-modal">
          <div className="all-regions-modal__header">
            <h3>أقسام وتلافيف المخ القابلة للتفاعل</h3>
            <button
              className="all-regions-modal__close"
              onClick={() => setShowAllDrawer(false)}
            >
              ✕
            </button>
          </div>

          <div className="all-regions-modal__grid">
            {Object.entries(LOBES).map(([lobeKey, lobe]) => (
              <div key={lobeKey} className="all-regions-lobe-group">
                <div
                  className="all-regions-lobe-group__title"
                  style={{ color: lobe.color, borderColor: lobe.color }}
                >
                  <span
                    className="all-regions-dot"
                    style={{ backgroundColor: lobe.color }}
                  />
                  <strong>{lobe.name_ar}</strong>
                  <span className="all-regions-count">
                    ({regionsByLobe[lobeKey]?.length} مناطق)
                  </span>
                </div>
                <div className="all-regions-list">
                  {regionsByLobe[lobeKey]?.map((region) => (
                    <button
                      key={region.id}
                      className={`all-regions-item ${
                        selectedRegion?.id === region.id ? "all-regions-item--active" : ""
                      }`}
                      onClick={() => {
                        onSelectRegion(region, null);
                        setShowAllDrawer(false);
                      }}
                      onMouseEnter={() => onHoverRegion && onHoverRegion(region)}
                      onMouseLeave={() => onHoverRegion && onHoverRegion(null)}
                    >
                      <span className="all-regions-item__ar">{region.name_ar}</span>
                      <span className="all-regions-item__en">{region.name_en}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
