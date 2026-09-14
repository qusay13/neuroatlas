// src/components/views/ResearchGuideView.jsx
// دليل الأطباء والباحثين في العلوم العصبية والتصوير المتقدم
export default function ResearchGuideView() {
  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-y-auto space-y-6 animate-fadeIn">
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-2xl">school</span>
            <h1 className="text-xl md:text-2xl font-headline-sm text-on-surface font-bold">
              دليل الأطباء والباحثين في العلوم العصبية
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface-container-high text-secondary">
              Academic Reference & Protocols
            </span>
          </div>
          <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">
            المرجع الأكاديمي الشامل لمعايير الإحداثيات الفراغية الاستريوتاكتية، فيزياء تصوير مصفوفة
            الانتشار (DTI)، ونماذج الاقتران الوعائي العصبي في الرنين الوظيفي (fMRI).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* المبحث الأول: أنظمة الإحداثيات الاستريوتاكتية */}
        <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-md">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-xl">grid_4x4</span>
            <h2 className="text-base font-bold text-on-surface font-headline-sm">
              1. أنظمة الإحداثيات الفراغية: MNI152 مقابل Talairach
            </h2>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            لكي يتمكن جراحو الأعصاب والباحثون من مقارنة أدمغة المرضى المختلفة، تُطابق صور الرنين
            المغناطيسي إلى فضاء إحداثي قياسي موحد:
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
              <span className="text-xs font-bold text-secondary font-mono">
                فضاء MNI-152 (Montreal Neurological Institute):
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                النموذج القياسي المعتمد في الأبحاث العصبية الحديثة. بُني بدمج ومحاذاة 152 مسح رنين
                مغناطيسي ثلاثي الأبعاد (T1-weighted) عالي الدقة، ونقطة الصفر (0, 0, 0) تقع عند ملتقى
                الصوار الأمامي (Anterior Commissure - AC).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
              <span className="text-xs font-bold text-primary font-mono">
                أطلس تالايراك (Talairach-Tournoux Space):
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                الأطلس التاريخي الكلاسيكي المعتمد في الجراحة العصبية التجسيمية. يعتمد خط AC-PC كمرجع
                أفقي رئيسي، وهو أصغر حجماً بنسبة ~20% مقارنة بفضاء MNI. يتم التحويل بينهما باستخدام
                معادلات لانكستر التحويلية (Lancaster Transform).
              </p>
            </div>
          </div>
        </div>

        {/* المبحث الثاني: فيزياء تتبع المسارات العصبية DTI */}
        <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-md">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-xl">polyline</span>
            <h2 className="text-base font-bold text-on-surface font-headline-sm">
              2. فيزياء تتبع المسارات العصبية (DTI Fiber Tractography)
            </h2>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            تعتمد تقنية تصوير مصفوفة الانتشار على قياس اتجاهية الحركة البراونية لجزيئات الماء داخل
            محاور الألياف العصبية الميالينية:
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
              <span className="text-xs font-bold text-secondary font-mono">
                التباين الجزئي (Fractional Anisotropy - FA):
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                قيمة لا بعدية تتراوح بين 0 (انتشار عشوائي كروي تماماً كما في السائل الدماغي الشوكي)
                و 1 (انتشار خطي موجه بالكامل على طول المحوار العصبي). هبوط قيمة FA يعكس تلفاً نسيجياً
                أو إزالة للميالين (Demyelination).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
              <span className="text-xs font-bold text-on-surface font-mono">
                الترميز اللوني الاتجاهي القياسي للألياف:
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                <div className="p-1.5 rounded bg-error/15 text-error font-bold">
                  أحمر: مستعرض (أيسر-أيمن)
                </div>
                <div className="p-1.5 rounded bg-secondary/15 text-secondary font-bold">
                  أخضر: أمامي-خلفي
                </div>
                <div className="p-1.5 rounded bg-primary/15 text-primary font-bold">
                  أزرق: شاقولي (صاعد-هابط)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* المبحث الثالث: الاستجابة الديناميكية الدموية fMRI BOLD */}
        <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-md">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-xl">biotech</span>
            <h2 className="text-base font-bold text-on-surface font-headline-sm">
              3. الاقتران الوعائي العصبي وإشارة BOLD في الرنين الوظيفي
            </h2>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            يقيس الـ fMRI التغير في نسبة الهيموغلوبين المؤكسج (Oxy-Hb الدايامغناطيسي) إلى غير المؤكسج
            (Deoxy-Hb البارامغناطيسي). عند تنشيط مجموعة عصبية، يحدث تدفق دموي موضعي فائض (Functional
            Hyperemia) يزيح الديوكسي-هيموغلوبين، مما يرفع إشارة الرنين بعد تأخير زمني من 4 إلى 6 ثوانٍ
            (دالة الاستجابة الديناميكية الدموية HRF).
          </p>
        </div>

        {/* المبحث الرابع: المراجع والمعايير الدولية المعتمدة */}
        <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-md">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-xl">verified</span>
            <h2 className="text-base font-bold text-on-surface font-headline-sm">
              4. المراجع الأكاديمية والتوثيق المرجعي الدولي
            </h2>
          </div>

          <ul className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
            <li className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/20">
              <strong className="text-on-surface block mb-0.5">
                FIPAT Terminologia Neuroanatomica (TNA):
              </strong>
              اللجنة الدولية المعنية بالمصطلحات التشريحية العصبية للاتحاد الدولي لرابطات علماء التشريح (IFAA).
            </li>
            <li className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/20">
              <strong className="text-on-surface block mb-0.5">
                ICBM-152 Nonlinear Asymmetric Template:
              </strong>
              اتحاد خرائط الدماغ الدولي (International Consortium for Brain Mapping).
            </li>
            <li className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/20">
              <strong className="text-on-surface block mb-0.5">
                Clinical Neuroanatomy Reference Standard:
              </strong>
              مراجع نتر للتشريح العصبي، أطلس كاندرل وشوارتز للعلوم العصبية، ومعايير الجمعية الأمريكية لطب الأعصاب (AAN).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
