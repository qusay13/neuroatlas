// src/components/InfoPanel.jsx
import { LOBES } from "../data/lobes";

export default function InfoPanel({
  region,
  onClose,
  onSelectRegion,
  allRegions = [],
}) {
  if (!region) return null;

  const lobe = LOBES[region.lobe] || {
    name_ar: "غير مصنف",
    name_en: "Unclassified",
    color: "#c49a82",
    glowColor: "#ffc24b",
    icon: "🧠",
  };

  // المناطق الأخرى التابعة لنفس الفص لتمكين التنقل السريع
  const siblingRegions = allRegions.filter(
    (r) => r.lobe === region.lobe && r.id !== region.id
  );

  return (
    <aside className="info-panel-drawer" aria-label="تفاصيل المنطقة المحددة">
      {/* رأس اللوحة */}
      <div className="info-panel-drawer__header">
        <div className="info-panel-drawer__lobe-badge" style={{ "--badge-color": lobe.color }}>
          <span className="lobe-badge__dot" />
          <span className="lobe-badge__text">
            {lobe.name_ar} • {lobe.name_en}
          </span>
        </div>

        <button
          className="info-panel-drawer__close"
          onClick={onClose}
          aria-label="إغلاق اللوحة"
          title="إغلاق اللوحة"
        >
          ✕
        </button>
      </div>

      <div className="info-panel-drawer__titles">
        <h2 className="info-panel-drawer__title-ar">{region.name_ar}</h2>
        <span className="info-panel-drawer__title-en">{region.name_en}</span>
      </div>

      <div className="info-panel-drawer__divider" style={{ "--divider-color": lobe.color }} />

      {/* محتوى التفاصيل مع التمرير السلس */}
      <div className="info-panel-drawer__content">
        {/* قسم الوظيفة التشريحية */}
        <div className="info-card info-card--function">
          <div className="info-card__header">
            <span className="info-card__icon">🧠</span>
            <h3 className="info-card__title">الوظيفة الحيوية والتشريحية</h3>
          </div>
          <p className="info-card__body">{region.function}</p>
        </div>

        {/* قسم التأثير النفسي والسلوكي */}
        {region.psychological_impact && (
          <div className="info-card info-card--psychology">
            <div className="info-card__header">
              <span className="info-card__icon">💫</span>
              <h3 className="info-card__title">التأثير والارتباط النفسي</h3>
            </div>
            <p className="info-card__body">{region.psychological_impact}</p>
          </div>
        )}

        {/* مناطق إضافية في نفس الفص */}
        {siblingRegions.length > 0 && (
          <div className="info-siblings-section">
            <h4 className="info-siblings-section__title">
              مناطق أخرى تابعة لـ {lobe.name_ar}:
            </h4>
            <div className="info-siblings-chips">
              {siblingRegions.map((sib) => (
                <button
                  key={sib.id}
                  className="sibling-chip"
                  onClick={() => onSelectRegion && onSelectRegion(sib, null)}
                  title={`عرض ${sib.name_ar}`}
                >
                  <span>{sib.name_ar}</span>
                  <span className="sibling-chip__arrow">←</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* أسفل اللوحة */}
      <div className="info-panel-drawer__footer">
        <button className="info-panel-drawer__action-btn" onClick={onClose}>
          إلغاء التحديد وعودة للمجسم
        </button>
      </div>
    </aside>
  );
}
