// src/data/lobes.js
// تعريف الفصوص والتقسيمات التشريحية للدماغ بثيم أبيض وأسود وتيتانيوم راقٍ

export const LOBES = {
  frontal: {
    id: "frontal",
    name_ar: "الفص الجبهي",
    name_en: "Frontal Lobe",
    color: "#e2e8f0",      // بلاتيني مشرق
    glowColor: "#ffffff",
    icon: "🧠",
    description: "التفكير العالي، التخطيط، اتخاذ القرارات، والتحكم في المشاعر والسلوك.",
  },
  parietal: {
    id: "parietal",
    name_ar: "الفص الجداري",
    name_en: "Parietal Lobe",
    color: "#cbd5e1",      // فضي ناصع
    glowColor: "#ffffff",
    icon: "✋",
    description: "معالجة الإحساس الجسدي، اللمس، إدراك موضع الجسم في الفضاء، وصورة الجسد.",
  },
  temporal: {
    id: "temporal",
    name_ar: "الفص الصدغي",
    name_en: "Temporal Lobe",
    color: "#94a3b8",      // تيتانيوم صقيل
    glowColor: "#e2e8f0",
    icon: "👂",
    description: "القشرة السمعية، الذاكرة الدلالية، التعرف على الوجوه، واستيعاب اللغة.",
  },
  occipital: {
    id: "occipital",
    name_ar: "الفص القذالي",
    name_en: "Occipital Lobe",
    color: "#64748b",      // جرافيت معدني
    glowColor: "#cbd5e1",
    icon: "👁️",
    description: "مركز المعالجة البصرية، تفسير الأشكال، الإشارات، والحركة البصرية.",
  },
  limbic: {
    id: "limbic",
    name_ar: "الجهاز الحوفي",
    name_en: "Limbic System",
    color: "#f1f5f9",      // لؤلؤي ناصع
    glowColor: "#ffffff",
    icon: "🫀",
    description: "تنظيم المشاعر العميقة، الذاكرة العاطفية، الاستجابة للقلق والوسواس.",
  },
  subcortical: {
    id: "subcortical",
    name_ar: "تحت القشرة والجسم الثفني",
    name_en: "Subcortical & Corpus Callosum",
    color: "#475569",      // فحم تيتانيوم
    glowColor: "#94a3b8",
    icon: "⚡",
    description: "نواقل الإشارات الحركية، مركز استجابة الخوف والهلع، والجسر الرابط بين نصفي الدماغ.",
  },
};

export default LOBES;
