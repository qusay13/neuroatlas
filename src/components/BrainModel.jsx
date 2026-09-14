// src/components/BrainModel.jsx
import { useRef, useEffect, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import regions from "../data/regions";
import { neuroDatabase } from "../data/neuroDatabase";
import * as THREE from "three";

const normalizeName = (str) => {
  if (!str) return "";
  return str.toLowerCase().replace(/[_-]/g, " ").replace(/\./g, "").replace(/\s+/g, " ").trim();
};

// خريطة من اسم المجسم إلى كائن المنطقة
const MESH_TO_REGION = new Map();
regions.forEach((region) =>
  region.meshNames.forEach((name) => MESH_TO_REGION.set(normalizeName(name), region))
);

function getRegionData(obj) {
  let cur = obj;
  while (cur) {
    if (MESH_TO_REGION.has(normalizeName(cur.name))) {
      return MESH_TO_REGION.get(normalizeName(cur.name));
    }
    cur = cur.parent;
  }
  const norm = normalizeName(obj.name);
  for (const [key, region] of MESH_TO_REGION) {
    if (norm.startsWith(key)) return region;
  }
  return null;
}

export default function BrainModel({
  onSelectRegion,
  onHoverRegion,
  selectedLobeKey,
  selectedRegion,
  hoveredRegion,
  cortexOpacity = 1.0,
}) {
  const { scene } = useGLTF("/brain.glb");
  const meshMaterials = useRef(new Map());
  const meshColors = useRef(new Map());

  // تهيئة المواد لجميع الأجزاء بالألوان السريرية الرصينة
  useEffect(() => {
    meshMaterials.current.clear();
    meshColors.current.clear();

    scene.traverse((child) => {
      if (!child.isMesh) return;

      const region = getRegionData(child);
      const lobeKey = region?.lobe || "subcortical";
      const lobeData = neuroDatabase[lobeKey] || neuroDatabase.subcortical;

      const baseColor = lobeData.color;
      const highlightColor = lobeData.highlightColor;

      meshColors.current.set(child.uuid, {
        baseColor,
        highlightColor,
        lobeKey,
      });

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(baseColor),
        roughness: 0.65,
        metalness: 0.08,
        bumpScale: 0.04,
        transparent: cortexOpacity < 0.99,
        opacity: cortexOpacity,
        depthWrite: cortexOpacity >= 0.99,
      });

      meshMaterials.current.set(child.uuid, mat);
      child.material = mat;
      child.renderOrder = 1;
    });
  }, [scene, cortexOpacity]);

  // تحديث حالات التحديد والتحويم
  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;
      const mat = meshMaterials.current.get(child.uuid);
      const colorData = meshColors.current.get(child.uuid);
      if (!mat || !colorData) return;

      const region = getRegionData(child);
      const isLobeActive = colorData.lobeKey === selectedLobeKey;
      const isRegionActive = selectedRegion && region?.id === selectedRegion.id;
      const isHovered = hoveredRegion && region?.id === hoveredRegion.id;

      mat.transparent = cortexOpacity < 0.99;
      mat.opacity = cortexOpacity;
      mat.depthWrite = cortexOpacity >= 0.99;

      if (isRegionActive) {
        // تحديد منطقة فرعية محددة (Gyrus)
        mat.color.set("#abcae8");
        mat.emissive.set("#1e3a5f");
        mat.emissiveIntensity = 0.85;
        mat.roughness = 0.35;
      } else if (isHovered) {
        // عند التحويم المباشر بالماوس
        mat.color.set(colorData.highlightColor);
        mat.emissive.set("#3e5c76");
        mat.emissiveIntensity = 0.6;
        mat.roughness = 0.45;
      } else if (isLobeActive) {
        // الفص النشط حالياً
        mat.color.set(colorData.highlightColor);
        mat.emissive.set("#172554");
        mat.emissiveIntensity = 0.35;
        mat.roughness = 0.55;
      } else {
        // الحالة الافتراضية
        mat.color.set(colorData.baseColor);
        mat.emissive.set("#000000");
        mat.emissiveIntensity = 0;
        mat.roughness = 0.65;
      }
    });
  }, [selectedLobeKey, selectedRegion, hoveredRegion, cortexOpacity, scene]);

  const handlePointerOver = useCallback(
    (e) => {
      const region = getRegionData(e.object);
      if (!region) return;
      e.stopPropagation();
      document.body.style.cursor = "pointer";
      if (onHoverRegion) {
        onHoverRegion(region, e.point.clone());
      }
    },
    [onHoverRegion]
  );

  const handlePointerOut = useCallback(
    (e) => {
      const region = getRegionData(e.object);
      if (!region) return;
      e.stopPropagation();
      document.body.style.cursor = "auto";
      if (onHoverRegion) {
        onHoverRegion(null, null);
      }
    },
    [onHoverRegion]
  );

  const handleClick = useCallback(
    (e) => {
      const region = getRegionData(e.object);
      if (!region) return;
      e.stopPropagation();
      onSelectRegion(region, e.point.clone());
    },
    [onSelectRegion]
  );

  return (
    <primitive
      object={scene}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
}

useGLTF.preload("/brain.glb");
