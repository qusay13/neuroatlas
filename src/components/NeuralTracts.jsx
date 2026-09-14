// src/components/NeuralTracts.jsx
// مجسم المسارات العصبية الحقيقية (DTI Tractography 3D Fiber System in World Space)
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// تعريف المسارات العصبية الستة الرئيسية مع إحداثياتها المكانية الدقيقة المتطابقة مع المجسم
const TRACT_DEFINITIONS = [
  {
    id: "corticospinal",
    lobe: "frontal",
    name_ar: "المسار القشري الشوكي (Corticospinal Tract)",
    name_en: "Corticospinal Tract",
    color: "#38bdf8", // أزرق سماوي ناصع (مسار شاقولي هابط من القشرة الحركية إلى النخاع)
    count: 14,
    radius: 0.014,
    basePoints: [
      [0.85, 0.82, -0.42],  // القشرة الحركية (Precentral Gyrus)
      [0.88, 0.44, -0.22],  // التاج المشع (Corona Radiata)
      [0.92, 0.08, 0.02],   // المحفظة الداخلية (Internal Capsule)
      [0.96, -0.38, 0.18],  // السويقة المخية (Cerebral Peduncle)
      [1.00, -0.78, 0.28],  // الجسر (Pons)
      [1.04, -1.22, 0.38],  // أهرام النخاع المستطيل (Medullary Pyramids)
    ],
  },
  {
    id: "arcuate_fasciculus",
    lobe: "temporal",
    name_ar: "الحزمة المقوسة (Arcuate Fasciculus)",
    name_en: "Arcuate Fasciculus",
    color: "#2dd4bf", // تركواز مائي مشع (مسار الربط اللغوي بين بروكا وفيرنيكه)
    count: 14,
    radius: 0.013,
    basePoints: [
      [0.45, -0.02, -0.88], // باحة بروكا (Broca's Area)
      [0.36, 0.30, -0.38],  // التقوس فوق التلم الوحشي
      [0.42, 0.34, 0.35],   // الالتفاف الجداري (Supramarginal Gyrus)
      [0.48, -0.15, 0.68],  // باحة فيرنيكه في الفص الصدغي (Wernicke)
      [0.55, -0.68, 0.28],  // التلفيف الصدغي السفلي
    ],
  },
  {
    id: "corpus_callosum",
    lobe: "subcortical",
    name_ar: "إشعاعات الجسم الثفني (Corpus Callosum Radiations)",
    name_en: "Corpus Callosum Radiations",
    color: "#f43f5e", // وردي/أحمر ناصع (مسار موصل مستعرض بين النصفين)
    count: 16,
    radius: 0.015,
    basePoints: [
      [0.52, 0.42, -0.12],  // القشرة الوحشية العميقة
      [0.82, 0.38, -0.02],  // المرور بالتاج المشع
      [1.15, 0.32, 0.08],   // التفرع فوق البطينات
      [1.44, 0.22, 0.12],   // الخط الناصف الإنسي للجسم الثفني
    ],
  },
  {
    id: "optic_radiation",
    lobe: "occipital",
    name_ar: "الإشعاع البصري (Optic Radiation / Meyer's Loop)",
    name_en: "Optic Radiation",
    color: "#a78bfa", // بنفسجي ناصع (مسار بصري خلفي نحو القشرة البصرية)
    count: 14,
    radius: 0.013,
    basePoints: [
      [0.96, -0.22, 0.24],  // النواة الركبية الوحشية (LGN)
      [0.58, -0.42, 0.48],  // حلقة ماير الملتفة أماماً في الصدغ (Meyer's Loop)
      [0.78, -0.38, 0.98],  // المادة البيضاء القذالية العميقة
      [1.10, -0.52, 1.68],  // القشرة البصرية الأولية (Calcarine Cortex)
    ],
  },
  {
    id: "cingulum",
    lobe: "limbic",
    name_ar: "الحزمة الحوفية (Cingulum Bundle)",
    name_en: "Cingulum Bundle",
    color: "#34d399", // أخضر زمردي مشع (مسار دائري حول الجهاز الحوفي)
    count: 14,
    radius: 0.012,
    basePoints: [
      [1.24, -0.12, -0.78], // التلفيف الحزامي الأمامي (Anterior Cingulate)
      [1.28, 0.28, -0.48],  // ركبة الحزامي (Genu)
      [1.30, 0.45, 0.12],   // جسم الحزامي (Body)
      [1.27, 0.08, 0.72],   // شريطة الحزامي (Splenium)
      [1.18, -0.62, 0.42],  // التلفيف المجاور للحصين (Parahippocampal)
    ],
  },
  {
    id: "thalamocortical",
    lobe: "parietal",
    name_ar: "الإشعاعات المهادية الحسية (Thalamocortical)",
    name_en: "Sensory Thalamocortical Radiation",
    color: "#fbbf24", // عنبري ذهبي مشع (إشارات حسية صاعدة نحو القشرة الجدارية)
    count: 14,
    radius: 0.013,
    basePoints: [
      [0.94, -0.12, 0.22],  // نواة المهاد الحسي (VPL Thalamus)
      [0.88, 0.12, 0.26],   // المحفظة الداخلية الحسية
      [0.82, 0.42, 0.36],   // التاج المشع الصاعد
      [0.74, 0.76, 0.46],   // القشرة الحسية الأولية (Postcentral Gyrus)
    ],
  },
];

export default function NeuralTracts({
  visible = true,
  selectedLobeKey = "frontal",
  isIsolating = false,
}) {
  const signalParticlesRef = useRef();

  // توليد خطوط التدفق الليفية الحقيقية (DTI Fiber Streamlines)
  const tractBundles = useMemo(() => {
    return TRACT_DEFINITIONS.map((tract) => {
      const fibers = [];

      for (let f = 0; f < tract.count; f++) {
        // توزيع أسطواني طبيعي مع تباعد شجري عند نهايات القشرة وضيق عند المضايق التشريحية
        const angle = (f / tract.count) * Math.PI * 2;
        const radialSpread = 0.024 + (f % 4) * 0.012;
        const jitterX = Math.cos(angle) * radialSpread;
        const jitterY = Math.sin(angle) * radialSpread;
        const jitterZ = (Math.sin(f * 2.7) - 0.5) * 0.028;

        const points = tract.basePoints.map((pt, i) => {
          // توسع طبيعي في أطراف القشرة وتكثف في الحزم العميقة
          const isEndpoint = i === 0 || i === tract.basePoints.length - 1;
          const spreadFactor = isEndpoint ? 1.6 : (i === 1 || i === tract.basePoints.length - 2 ? 0.9 : 0.45);

          return new THREE.Vector3(
            pt[0] + jitterX * spreadFactor,
            pt[1] + jitterY * spreadFactor,
            pt[2] + jitterZ * spreadFactor
          );
        });

        const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.4);
        const geometry = new THREE.TubeGeometry(curve, 42, tract.radius, 8, false);

        fibers.push({
          curve,
          geometry,
        });
      }

      return {
        ...tract,
        fibers,
      };
    });
  }, []);

  const SIGNAL_COUNT = 48;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // ومضات السيالة العصبية الحية المتحركة على طول الألياف
  useFrame((state) => {
    if (!visible || !signalParticlesRef.current) return;

    const time = state.clock.elapsedTime * 0.85;

    let particleIdx = 0;
    tractBundles.forEach((tract) => {
      const isLobeActive = tract.lobe === selectedLobeKey;
      const speedMultiplier = isLobeActive ? 1.5 : 1.0;

      // اختيار ألياف ممثلة لكل مسار لإرسال ومضات الإشارات الكهربائية
      tract.fibers.slice(0, 5).forEach((fiber, fi) => {
        if (particleIdx >= SIGNAL_COUNT) return;

        const t = (time * 0.32 * speedMultiplier + fi * 0.2) % 1;
        const pos = fiber.curve.getPointAt(t);

        dummy.position.copy(pos);
        const scale = isLobeActive ? 1.3 : 0.8;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();

        signalParticlesRef.current.setMatrixAt(particleIdx, dummy.matrix);
        particleIdx++;
      });
    });

    // إخفاء أي جزيئات فائضة لمنع ظهورها عند الإحداثي (0, 0, 0)
    for (let i = particleIdx; i < SIGNAL_COUNT; i++) {
      dummy.position.set(999, 999, 999);
      dummy.scale.set(0, 0, 0);
      dummy.updateMatrix();
      signalParticlesRef.current.setMatrixAt(i, dummy.matrix);
    }

    signalParticlesRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <group name="NeuralTractography" renderOrder={2}>
      {tractBundles.map((tract) => {
        const isLobeActive = tract.lobe === selectedLobeKey;
        const shouldHighlight = isLobeActive;
        const shouldDim = isIsolating && !isLobeActive;

        const emissiveIntensity = shouldHighlight ? (isIsolating ? 3.4 : 2.6) : 1.5;
        const opacity = shouldDim ? 0.08 : (isIsolating ? 0.98 : 0.88);

        return (
          <group key={tract.id} name={`Tract-${tract.id}`}>
            {tract.fibers.map((fiber, fi) => (
              <mesh key={fi} geometry={fiber.geometry}>
                <meshStandardMaterial
                  color={tract.color}
                  emissive={tract.color}
                  emissiveIntensity={emissiveIntensity}
                  roughness={0.2}
                  metalness={0.15}
                  transparent
                  opacity={opacity}
                  depthTest={true}
                  depthWrite={true}
                />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* كرات السيالة العصبية المشعة (Action Potentials) */}
      <instancedMesh
        ref={signalParticlesRef}
        args={[null, null, SIGNAL_COUNT]}
      >
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>
    </group>
  );
}
