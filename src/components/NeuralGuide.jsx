import structures from "../data/neuralStructures.json";
import "./NeuralGuide.css";

export default function NeuralGuide({ mode, selectedId, onModeChange, onSelect, onClose, onInferiorView }) {
  const entries = mode === "cranial" ? structures.cranialNerves : structures.tracts;
  const selected = entries.find((entry) => entry.id === selectedId);
  return (
    <section className="neural-guide" aria-label="دليل الألياف والأعصاب" dir="rtl">
      <div className="neural-guide-heading">
        <strong>دليل الألياف والأعصاب</strong>
        <button aria-label="إغلاق دليل الأعصاب" onClick={onClose}>×</button>
      </div>
      <div className="neural-guide-tabs" role="group" aria-label="نوع التركيب">
        <button aria-pressed={mode === "tracts"} onClick={() => onModeChange("tracts")}>حزم الألياف · 5</button>
        <button aria-pressed={mode === "cranial"} onClick={() => onModeChange("cranial")}>الأعصاب القحفية · 12</button>
      </div>
      {mode === "cranial" && <button className="neural-view-button" onClick={onInferiorView}>منظر سفلي لإظهار منشأ الأعصاب ↗</button>}
      <p className="neural-hint">اختر اسمًا أو انقر على المسار في المجسم لإبراز الجانبين وقراءة الوظيفة.</p>
      <div className={`neural-entries ${mode === "cranial" ? "cranial-entries" : ""}`}>
        {entries.map((entry) => (
          <button key={entry.id} data-structure-id={entry.id} aria-pressed={selectedId === entry.id} onClick={() => onSelect(entry.id)}>
            {entry.roman ? <span className="nerve-number" dir="ltr">{entry.roman}</span> : <span className="tract-swatch" style={{ background: entry.color }} />}
            <span>{entry.name}</span>
          </button>
        ))}
      </div>
      <div className="neural-explanation" aria-live="polite">
        {selected ? <>
          <h3>{selected.roman && `${selected.roman} · `}{selected.name}</h3>
          <div className="neural-english"><bdi lang="en">{selected.english}</bdi>{selected.type && <><span aria-hidden="true"> · </span><bdi>{selected.type}</bdi></>}</div>
          <p><strong>الوظيفة: </strong>{selected.function}</p>
          <p><strong>المسار: </strong>{selected.course}</p>
          <a href={selected.source} target="_blank" rel="noreferrer">قراءة المرجع العلمي ↗</a>
        </> : <p>اختر تركيبًا من القائمة لعرض الشرح.</p>}
      </div>
      <p className="neural-disclaimer">المسارات وجذع الدماغ إضافات تعليمية تقريبية. الأطوال والسماكات ليست قياسات طبية، ولا تظهر الفروع الطرفية كاملة.</p>
    </section>
  );
}
