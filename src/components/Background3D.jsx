// src/components/Background3D.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

const COUNT = 160;

// إنشاء مواقع ثابتة للجسيمات لتجنب إعادة التوليد أثناء التصيير
const PARTICLE_POSITIONS = [];
for (let i = 0; i < COUNT; i++) {
  // توزيع متجانس شبه عشوائي حتمي
  const t = i * 0.381966;
  const x = Math.sin(t * 12.3) * 8;
  const y = Math.cos(t * 7.7) * 5;
  const z = (Math.sin(t * 4.9) - 0.5) * 6 - 1;
  PARTICLE_POSITIONS.push([x, y, z]);
}

/**
 * خلفية فضاء أحادية اللون (Monochrome) فائقة النقاء:
 * 1. نجوم بيضاء باردة دون أي تلوين أصفر أو ذهبي (saturation=0)
 * 2. جزيئات فكرية عصبية فضية/بيضاء خافتة
 */
export default function Background3D() {
  return (
    <>
      <Stars
        radius={25}
        depth={35}
        count={6000}
        factor={7}
        saturation={0} // إزالة أي تشبع لوني لجعل النجوم بيضاء نقية
        fade
        speed={0.8}
      />
      <NeuronParticles />
    </>
  );
}

function NeuronParticles() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.04;
      meshRef.current.rotation.x += delta * 0.015;

      PARTICLE_POSITIONS.forEach((pos, i) => {
        dummy.position.set(pos[0], pos[1], pos[2]);
        const scale = 0.5 + Math.sin(state.clock.elapsedTime * 1.8 + i) * 0.2;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
    </instancedMesh>
  );
}
