import { neuroDatabase } from '../data/neuroDatabase';
import NeuralGuide from './NeuralGuide';
import ClinicalDetailsPanel from './ClinicalDetailsPanel';

export default function MobileExplorer(props) {
  const { currentLobe, selectedRegion, selectedLobeKey, onSelectLobe, panel, setPanel,
    neuralMode, selectedStructureId, openNeuralGuide, selectNeuralStructure,
    closeNeuralGuide, inferiorView, showPlanes, setShowPlanes, isTranslucent,
    setIsTranslucent, resetCamera, activeTab, setActiveTab, isIsolatingTracts, onToggleIsolate } = props;
  const toggle = (name) => setPanel(panel === name ? null : name);
  const chooseMode = (mode) => {
    if (panel === 'neural' && neuralMode === mode) setPanel(null);
    else openNeuralGuide(mode);
  };
  return <div className="mobile-explorer-controls">
    <label className="mobile-lobe-select">المنطقة
      <select aria-label="اختر منطقة الدماغ" value={selectedLobeKey || ''} onChange={event => onSelectLobe(event.target.value || null)}>
        <option value="">كامل الدماغ</option>
        {Object.entries(neuroDatabase).map(([key, data]) => <option key={key} value={key}>{data.title}</option>)}
      </select>
    </label>
    <div className="mobile-selection" aria-live="polite">
      <span>{selectedRegion?.name_ar || currentLobe.title}</span>
      <button aria-expanded={panel === 'info'} aria-controls="mobile-explorer-panel" onClick={() => toggle('info')}>{panel === 'info' ? 'طي المعلومات' : 'اقرأ المعلومات'} <span aria-hidden="true">⌄</span></button>
    </div>
    <div className="mobile-tool-tabs" aria-label="أدوات استكشاف الدماغ">
      <button aria-expanded={panel === 'neural' && neuralMode === 'tracts'} onClick={() => chooseMode('tracts')}>الألياف</button>
      <button aria-expanded={panel === 'neural' && neuralMode === 'cranial'} onClick={() => chooseMode('cranial')}>الأعصاب</button>
      <button aria-expanded={panel === 'tools'} onClick={() => toggle('tools')}>العرض</button>
      <button onClick={resetCamera} aria-label="إعادة ضبط العرض">إعادة ضبط</button>
    </div>
    <div id="mobile-explorer-panel">
      {panel === 'tools' && <section className="mobile-view-options" aria-label="خيارات العرض">
        <button aria-pressed={isTranslucent} onClick={() => setIsTranslucent(!isTranslucent)}>الشفافية <span>{isTranslucent ? 'مفعّلة' : 'متوقفة'}</span></button>
        <button aria-pressed={showPlanes} onClick={() => setShowPlanes(!showPlanes)}>الشبكة المرجعية <span>{showPlanes ? 'ظاهرة' : 'مخفية'}</span></button>
        {neuralMode && <button onClick={() => { closeNeuralGuide(); resetCamera(); }}>العودة إلى سطح الدماغ</button>}
      </section>}
      {panel === 'neural' && neuralMode && <NeuralGuide mode={neuralMode} selectedId={selectedStructureId}
        onModeChange={openNeuralGuide} onSelect={selectNeuralStructure} onClose={() => setPanel(null)} onInferiorView={inferiorView} />}
      {panel === 'info' && <ClinicalDetailsPanel currentLobe={currentLobe} selectedRegion={selectedRegion}
        activeTab={activeTab} setActiveTab={setActiveTab} isIsolatingTracts={isIsolatingTracts}
        onToggleIsolate={onToggleIsolate} isInlineMobile />}
    </div>
    <details className="mobile-model-notes"><summary>عن النموذج ومصادره</summary>
      <p>الألياف والأعصاب وجذع الدماغ تقريبية تعليمية؛ النصف المقابل مستكمل بالانعكاس. النموذج غير مخصص للتشخيص أو القياسات الطبية. تجد مراجع التراكيب داخل دليل الأعصاب والألياف.</p>
      <p>شارك ببناء الموقع المختص عمر فهد الشمري.</p>
    </details>
  </div>;
}
