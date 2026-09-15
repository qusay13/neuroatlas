// src/data/neuroDatabase.js
// بيانات التشريح العصبي السريري والأكاديمي للفصوص الستة الرئيسية للدماغ والحالة الطبيعية الكاملة

export const wholeBrainData = {
  id: "whole",
  title: "كامل الدماغ البشري",
  latin: "Encephalon Humanum · ICBM-152 Stereotaxic Space",
  volume: "100% (~1,400 cm³)",
  tag: "ANATOMICAL STANDARD: ICBM-152 3D ATLAS",
  coords: "[±00, ±00, ±00]",
  density: "100% Baseline Integrity",
  barWidth: "100%",
  color: "#d6cbbe",
  highlightColor: "#e5dcce",
  overview:
    "المجسم التشريحي الطبيعي المتكامل للدماغ البشري بهياكله القشرية وتحت القشرية، متضمناً نصفي الكرة المخية، التلافيف والأخاديد، والمخيخ وجذع الدماغ في حالته الطبيعية السليمة دون أي آفات. يمكنك النقر على أي فص أو باحة لتشريحها وفحص مساراتها العصبية سريرياً.",
  fn1Label: "القشرة المخية (Cerebral Cortex)",
  fn1Desc: "المعالجة العصبية العليا، الإدراك، الوعي، والتفكير التجريدي المتقدم",
  fn2Label: "التكامل العصبي الشامل",
  fn2Desc: "التنسيق الوظيفي بين الشبكات القشرية والمراكز تحت القشرية الحيوية",
  pathologies: [
    {
      icon: "health_and_safety",
      title: "التشريح الطبيعي السليم (Physiological Baseline)",
      desc: "لا توجد آفات بؤرية، احتشاءات، أو ضمور قشري، والتروية الدماغية متوازنة في كافة الفصوص.",
    },
    {
      icon: "neurology",
      title: "التكامل الحركي والمعرفي الشامل",
      desc: "ترابط مثالي بين الفصوص الجبهية والجدارية والصدغية والقذالية عبر المسارات الترابطية والإسقاطية.",
    },
  ],
  diagnostics: [
    {
      title: "التصوير بالرنين المغناطيسي التشريحي (Structural MRI T1/T2)",
      tag: "Morphometry Baseline",
      desc: "تحديد معالم المادة الرمادية والبيضاء وفق المقاييس المجسمة المرجعية المعتمدة دولياً.",
    },
    {
      title: "الرنين المغناطيسي ثلاثي الأبعاد (3D High-Res MPRAGE)",
      tag: "Isotropic 1mm³",
      desc: "بناء النماذج التشريحية السريرية ثلاثية الأبعاد بدقة تحت المليمتر.",
    },
  ],
};

export const neuroDatabase = {
  frontal: {
    id: "frontal",
    title: "الفص الجبهي",
    latin: "Lobus Frontalis · Anterior Cranial Fossa",
    volume: "41.2%",
    tag: "BRODMANN AREAS: 4, 6, 8, 9, 10, 11, 44, 45",
    coords: "[+02, +38, +22]",
    density: "94.8% Integrity",
    barWidth: "95%",
    color: "#64748b",       // Slate Grey / Steel
    highlightColor: "#94a3b8",
    fn1Label: "القشرة الحركية الأولية (M1)",
    fn1Desc: "تخطيط وبدء الحركات الإرادية الدقيقة",
    fn2Label: "باحة بروكا (BA 44/45)",
    fn2Desc: "الإنتاج الحركي للغة والتعبير الصوتي",
    overview:
      "يُمثل الفص الجبهي أكبر فصوص الدماغ البشري، ويشغل الحفرة القحفية الأمامية بالكامل ممتداً حتى التلم المركزي (Sulcus Centralis). يُعد المركز السيادي الأعلى للتحكم المعرفي والتنفيذي (Executive Function)، التخطيط المستقبلي، وضبط السلوك الاجتماعي والعاطفي.",
    pathologies: [
      {
        icon: "report_problem",
        title: "تغيرات جذرية في الشخصية والسلوك (Frontal Disinhibition)",
        desc: "فقدان الكبح الاجتماعي، الاندفاعية، واللامبالاة العاطفية نتيجة تلف القشرة الجبهية الحجاجية (OFC).",
      },
      {
        icon: "voice_over_off",
        title: "حبسة بروكا الحركية (Broca's Expressive Aphasia)",
        desc: "عجز تام أو حاد عن إنتاج الكلام المنطوق بسلاسة مع احتفاظ نسبي بالقدرة على فهم واستيعاب اللغة الموجهة.",
      },
      {
        icon: "accessible_forward",
        title: "شلل نصفي أو خزل تشنجي (Contralateral Hemiparesis)",
        desc: "فقدان السيطرة الحركية الإرادية في النصف المقابل للجسم عند إصابة التلفيف أمام المركزي.",
      },
      {
        icon: "psychology_alt",
        title: "متلازمة الخلل التنفيذي (Dysexecutive Syndrome)",
        desc: "عجز حاد في ترتيب الأولويات، حل المشكلات المعقدة، التفكير التجريدي والتحكم في الانتباه المستمر.",
      },
    ],
    diagnostics: [
      {
        title: "اختبار ويسكونسن لفرز البطاقات (WCST)",
        tag: "Cognitive Shift",
        desc: "تقييم مرونة التفكير وتبديل المفاهيم الذهنية المعرفية.",
      },
      {
        title: "تخطيط كهربية الدماغ الكمي (QEEG)",
        tag: "Frontal Delta/Theta",
        desc: "رصد التباطؤ البؤري لتحديد بؤر الصرع الجبهي أو نقص التروية.",
      },
      {
        title: "التصوير بالرنين المغناطيسي الوظيفي (fMRI)",
        tag: "Language Paradigm",
        desc: "رسم خرائط ما قبل الجراحة لحماية تلفيف بروكا من الإصابة الإشعاعية.",
      },
    ],
  },
  parietal: {
    id: "parietal",
    title: "الفص الجداري",
    latin: "Lobus Parietalis · Post-Central Sector",
    volume: "23.6%",
    tag: "BRODMANN AREAS: 1, 2, 3, 5, 7, 39, 40",
    coords: "[+18, -42, +52]",
    density: "89.2% Integrity",
    barWidth: "89%",
    color: "#78716c",       // Stone Warm Grey
    highlightColor: "#a8a29e",
    fn1Label: "القشرة الحسية الأولية (S1)",
    fn1Desc: "استقبال ومعالجة الإحساس الجسدي والحرارة والألم",
    fn2Label: "التلفيف الزاوي (Angular Gyrus)",
    fn2Desc: "معالجة اللغة المكتوبة، القراءة، والعمليات الحسابية",
    overview:
      "يقع الفص الجداري خلف التلم المركزي وفوق التلم الجانبي. يشكل المركز الرئيسي لمعالجة ودمج المعلومات الحسية الجسدية ثنائية الجانب، والإدراك المكاني ثلاثي الأبعاد، والتنسيق بين النظر وحركة اليدين والأطراف في الفضاء المحيط.",
    pathologies: [
      {
        icon: "accessibility_new",
        title: "إهمال الحيز المكاني النصفي (Hemispatial Neglect)",
        desc: "تجاهل كامل للمحيط الحسي في الجانب المعاكس (غالباً الأيسر نتيجة إصابة نصف الكرة المخية الأيمن).",
      },
      {
        icon: "calculate",
        title: "متلازمة غيرستمان (Gerstmann's Syndrome)",
        desc: "تعذر الحساب (Acalculia)، تعذر الكتابة (Agraphia)، عدم التمييز بين أصابع اليد، والخلط بين اليمين واليسار.",
      },
      {
        icon: "touch_app",
        title: "عمه حسي جسدي (Astereognosis)",
        desc: "عدم القدرة على تمييز شكل وملمس المجسمات باللمس المجرد دون استخدام حاسة البصر.",
      },
      {
        icon: "pan_tool",
        title: "لاأدائية حركية تركيبية (Constructive Apraxia)",
        desc: "صعوبة رسم الأشكال الهندسية أو ترتيب الأشياء ضمن فضاء متناسق.",
      },
    ],
    diagnostics: [
      {
        title: "اختبار شطب الخطوط لتقييم الإهمال (Line Bisection)",
        tag: "Spatial Neglect",
        desc: "كشف العجز الإدراكي للمجال البصري المقابل لنصف الدماغ المصاب.",
      },
      {
        title: "الجهود المحرضة الحسية الجسدية (SSEP)",
        tag: "Sensory Conduction",
        desc: "قياس زمن التوصيل العصبي من المحيط إلى باحات القشرة الجدارية.",
      },
      {
        title: "اختبار التعرف اللمسي (Two-Point Discrimination)",
        tag: "Tactile Threshold",
        desc: "قياس المسافة الدنيا لتفريق نقطتين متلامستين على راحة اليد.",
      },
    ],
  },
  temporal: {
    id: "temporal",
    title: "الفص الصدغي",
    latin: "Lobus Temporalis · Middle Cranial Fossa",
    volume: "18.4%",
    tag: "BRODMANN AREAS: 20, 21, 22, 38, 41, 42",
    coords: "[+48, -12, -24]",
    density: "91.5% Integrity",
    barWidth: "91%",
    color: "#607274",       // Muted Sage Slate
    highlightColor: "#8fa3a5",
    fn1Label: "القشرة السمعية الأولية (A1)",
    fn1Desc: "إدراك الأصوات والتحليل الطيفي للنغمات والترددات",
    fn2Label: "تلفيف الحصين (Hippocampus)",
    fn2Desc: "ترسيخ الذاكرة الصريحة ونقلها للذاكرة طويلة الأمد",
    overview:
      "يمتد الفص الصدغي أسفل الشق السيلفي، ويحتضن التراكيب الأكثر حيوية للذاكرة العرضية (الحصين)، والاستجابات الانفعالية (اللوزة الدماغية)، فضلاً عن استيعاب وفهم الرموز اللغوية المسموعة في باحة فيرنيكه (Wernicke).",
    pathologies: [
      {
        icon: "hearing_disabled",
        title: "حبسة فيرنيكه الحسية (Wernicke's Receptive Aphasia)",
        desc: "كلام طليق دون معنى وفقدان شبه تام لاستيعاب اللغة المنطوقة أو قراءتها مع خلو المريض من الوعي بخلله.",
      },
      {
        icon: "history",
        title: "فقدان الذاكرة التقدمي (Anterograde Amnesia)",
        desc: "عجز تام عن تكوين ذكريات جديدة بعد حدوث الأذية في الحصين الثنائي أو التلفيف الصدغي الأنسي.",
      },
      {
        icon: "face_retouching_off",
        title: "عمه تعرف الوجوه (Prosopagnosia)",
        desc: "عدم القدرة على تمييز وتحديد وجوه الأشخاص المألوفين عند تضرر التلفيف المغزلي (Fusiform Gyrus).",
      },
      {
        icon: "bolt",
        title: "صرع الفص الصدغي الأنسي (Mesial Temporal Epilepsy)",
        desc: "نوبات مصحوبة بهالات شمية أو إحساس غير مألوف بالألفة التامة (Déjà vu) واضطراب الوعي.",
      },
    ],
    diagnostics: [
      {
        title: "اختبار راي للتعلم السمعي اللفظي (RAVLT)",
        tag: "Verbal Memory",
        desc: "قياس سعة استرجاع وتخزين المعلومات المسموعة.",
      },
      {
        title: "تصوير الرنين البروتوني الحجمي للحصين",
        tag: "Hippocampal Volumetry",
        desc: "كشف علامات التصلب الصدغي الأنسي وضمور الحصين المبكر.",
      },
      {
        title: "فحص تخطيط الدماغ المطول أثناء النوم (Video-EEG)",
        tag: "Spike-Wave Discharge",
        desc: "تسجيل التفريغات الصرعية الصدغية البؤرية.",
      },
    ],
  },
  occipital: {
    id: "occipital",
    title: "الفص القذالي",
    latin: "Lobus Occipitalis · Posterior Cranial Fossa Boundary",
    volume: "10.8%",
    tag: "BRODMANN AREAS: 17 (V1), 18 (V2), 19 (V3-V5)",
    coords: "[+12, -88, +08]",
    density: "96.4% Integrity",
    barWidth: "96%",
    color: "#57534e",       // Deep Muted Earth
    highlightColor: "#8a817c",
    fn1Label: "القشرة البصرية الأولية (V1/Striate)",
    fn1Desc: "استقبال الإشارات الشبكية الأولية للتباين والاتجاه",
    fn2Label: "الباحات الترابطية (V2 - V5)",
    fn2Desc: "معالجة الألوان، العمق، وتتبع الأجسام المتحركة",
    overview:
      "يحتل الفص القذالي القطب الخلفي للجمجمة، ويمثل المركز التشريحي المتخصص حصراً في المعالجة البصرية الأولية والثانوية عبر الشق المهمازي (Calcarine Sulcus)، متصلاً بالمسار الظهري (أين) والبطني (ماذا).",
    pathologies: [
      {
        icon: "visibility_off",
        title: "العمى القشري (Cortical Blindness)",
        desc: "فقدان الرؤية الواعية نتيجة احتشاء ثنائي للشريان المخي الخلفي، مع بقاء المنعكسات الحدقية سليمة.",
      },
      {
        icon: "contrast",
        title: "عمه عمى الألوان القشري (Cerebral Achromatopsia)",
        desc: "فقدان القدرة على تمييز الألوان ورؤية العالم بتدرجات الرمادي بسبب إصابة باحة V4 القذالية البطنية.",
      },
      {
        icon: "crop_free",
        title: "متلازمة أنطون-بابينسكي (Anton's Syndrome)",
        desc: "إنكار المريض لعمى البصر القشري وادعاء القدرة على الرؤية مع تقديم أوصاف خيالية لما يحيط به.",
      },
      {
        icon: "motion_photos_off",
        title: "عمه الحركة البصرية (Akinetopsia)",
        desc: "عجز عن إدراك حركة الأجسام في الزمن المستمر ورؤيتها كلقطات ثابتة متقطعة ناتج عن تلف باحة V5/MT.",
      },
    ],
    diagnostics: [
      {
        title: "تخطيط الساحة البصرية الحاسوبي (Humphrey Visual Field)",
        tag: "Hemianopia Grid",
        desc: "تحديد الفقد النصفي أو الربعي المتجانس في المجال البصري.",
      },
      {
        title: "الجهود البصرية المحرضة بالنمط (Pattern VEP)",
        tag: "P100 Latency",
        desc: "قياس سرعة انتقال السيالات الضوئية عبر المسار البصري الخلفي.",
      },
      {
        title: "التصوير المقطعي البصري القشري (OCT + MRI)",
        tag: "Retrograde Degeneration",
        desc: "فحص تكامل العصبونات الشبكية المتصلة بالقشرة القذالية.",
      },
    ],
  },
  limbic: {
    id: "limbic",
    title: "الجهاز الحوفي",
    latin: "Systema Limbicum · Emotional & Autonomic Cortex",
    volume: "10.0%",
    tag: "LIMBIC STRUCTURES: Cingulate, Parahippocampal, Amygdala",
    coords: "[+04, -18, +26]",
    density: "93.0% Integrity",
    barWidth: "93%",
    color: "#475569",       // Darker Slate
    highlightColor: "#6b7280",
    fn1Label: "التلفيف الحزامي (Cingulate)",
    fn1Desc: "ربط النتائج السلوكية بالدوافع ومعالجة الألم العاطفي",
    fn2Label: "اللوزة الدماغية (Amygdala)",
    fn2Desc: "معالجة الخوف، تقييم التهديدات، وتكييف الاستجابة الانفعالية",
    overview:
      "يُطوّق الجهاز الحوفي جذع الدماغ، وهو الشبكة العصبية المعقدة المسؤولة عن الانفعالات، التعلم، الذاكرة العاطفية، وتنظيم الغدد الصماء والمناعة عبر اتصاله الوثيق بالوطاء (Hypothalamus).",
    pathologies: [
      {
        icon: "psychology",
        title: "الوسواس القهري والقلق المعمم (OCD / Generalized Anxiety)",
        desc: "فرط نشاط الدائرة الحوفية الجبهية يؤدي لحبس الأفكار المتطفلة وتكرار السلوكيات القهرية.",
      },
      {
        icon: "heart_broken",
        title: "متلازمة كلوفر-بوسي (Klüver-Bucy Syndrome)",
        desc: "فقدان تام للخوف الطبيعي، فرط الرغبة في التذوق الفموي، وعدم الاستقرار الانفعالي نتيجة تلف اللوزتين.",
      },
      {
        icon: "sentiment_dissatisfied",
        title: "الاكتئاب السريري وانعدام التلذذ (Anhedonia)",
        desc: "تراجع استجابة مسارات المكافأة الدوبامينية في الجهاز الحوفي مما يسبب فقدان الشغف والاهتمام.",
      },
    ],
    diagnostics: [
      {
        title: "التصوير المقطعي بالإصدار البوزيتروني (FDG-PET)",
        tag: "Glucose Metabolism",
        desc: "قياس الاستقلاب السكري في التلفيف الحزامي لدراسة بؤر الاكتئاب والوسواس.",
      },
      {
        title: "مقياس ييل-براون للوسواس القهري (Y-BOCS)",
        tag: "Clinical Rating",
        desc: "تحديد شدة الأعراض وتأثيرها على الأداء اليومي.",
      },
    ],
  },
  subcortical: {
    id: "subcortical",
    title: "تحت القشرة والجسم الثفني",
    latin: "Subcortical Nuclei & Corpus Callosum",
    volume: "2.6%",
    tag: "DEEP STRUCTURES: Basal Ganglia, Thalamus, Callosum",
    coords: "[+00, -22, -18]",
    density: "99.4% Criticality",
    barWidth: "99%",
    color: "#52525b",       // Neutral Steel
    highlightColor: "#71717a",
    fn1Label: "الجسم الثفني (Corpus Callosum)",
    fn1Desc: "جسر الألياف الرئيسي للتنسيق بين نصفي الدماغ",
    fn2Label: "المهاد والنوى القاعدية",
    fn2Desc: "محطة ترحيل الإشارات الحسية وضبط سلاسة الحركة",
    overview:
      "تضم المناطق تحت القشرية المهاد والنوى القاعدية والجسم الثفني. تعمل كمركز التنسيق والتبديل المركزي لكافة الإشارات العصبية الوافدة والصادرة بين القشرة الدماغية والمراكز الحيوية السفلية.",
    pathologies: [
      {
        icon: "vibration",
        title: "داء باركنسون واضطرابات الحركة (Parkinsonism)",
        desc: "تراجع إفراز الدوبامين في المادة السوداء مسبباً بطء الحركة، الصمل العضلي، ورعاش الراحة.",
      },
      {
        icon: "call_split",
        title: "متلازمة انشطار الدماغ (Split-Brain Syndrome)",
        desc: "انقطاع التواصل المعرفي بين النصف الأيمن والأيسر للدماغ عند قطع الجسم الثفني.",
      },
      {
        icon: "sentiment_neutral",
        title: "اليكسيثيميا وصعوبة التعبير العاطفي (Alexithymia)",
        desc: "صعوبة إدراك ووصف المشاعر بسبب ضعف الاتصال بين النصف التحليلي والانفعالي.",
      },
    ],
    diagnostics: [
      {
        title: "تصوير ناقلات الدوبامين (DaTscan)",
        tag: "Striatal Binding",
        desc: "تقييم سلامة العصبونات الدوبامينية في المخطط لتشخيص الباركنسونية المبكرة.",
      },
      {
        title: "تصوير انتشار الموتر عالي الدقة (High-Res DTI)",
        tag: "Callosal Tractography",
        desc: "تقييم سلامة حزم الألياف الرابطة عبر الجسم الثفني.",
      },
    ],
  },
};

export default neuroDatabase;
