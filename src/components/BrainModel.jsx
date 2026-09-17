// src/components/BrainModel.jsx
import { useRef, useEffect, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import regions from "../data/regions";
import { neuroDatabase } from "../data/neuroDatabase";
import { MeshoptDecoder } from "meshoptimizer/decoder";
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
  if (obj.userData?.anatomyRole) return null;
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

const BRAIN_MODEL_URL = `${import.meta.env.BASE_URL}brain-optimized.glb`;
const skipRaycast = () => {};

const NATURAL_CORTEX_COLOR = "#d5c7b8";
const NATURAL_CEREBELLUM_COLOR = "#c7b8a7";
const NATURAL_STEM_COLOR = "#ddd4c8";

function getNaturalColor(lobeKey) {
  if (lobeKey === "cerebellum") return NATURAL_CEREBELLUM_COLOR;
  if (lobeKey === "brainstem" || lobeKey === "subcortical") return NATURAL_STEM_COLOR;
  return NATURAL_CORTEX_COLOR;
}

export default function BrainModel({
  onReady,
  onSelectRegion,
  onHoverRegion,
  selectedLobeKey,
  selectedRegion,
  hoveredRegion,
  cortexOpacity = 1.0,
  showTracts = false,
  isIsolatingTracts = false,
  neuralMode = null,
  selectedStructureId = null,
  onSelectStructure,
}) {
  const { scene } = useGLTF(BRAIN_MODEL_URL, false, false, (loader) => loader.setMeshoptDecoder(MeshoptDecoder));
  const meshMaterials = useRef(new Map());
  const meshColors = useRef(new Map());
  const originalMaterials = useRef(new Map());

  // تهيئة المواد لجميع الأجزاء بحالة النسيج العصبي الطبيعي السليم
  useEffect(() => {
    meshMaterials.current.clear();
    meshColors.current.clear();

    scene.traverse((child) => {
      if (!child.isMesh) return;
      originalMaterials.current.set(child.uuid, child.material);
      if (child.userData.anatomyRole) {
        child.material = child.material.clone();
        meshMaterials.current.set(child.uuid, child.material);
        child.renderOrder = 0;
        return;
      }

      const region = getRegionData(child);
      const lobeKey = region?.lobe || "subcortical";
      const lobeData = neuroDatabase[lobeKey] || neuroDatabase.subcortical;

      const baseColor = lobeData.color;
      const highlightColor = lobeData.highlightColor;
      const naturalColor = getNaturalColor(lobeKey);

      meshColors.current.set(child.uuid, {
        baseColor,
        highlightColor,
        naturalColor,
        lobeKey,
      });

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(naturalColor),
        roughness: 0.7,
        metalness: 0,
      });

      meshMaterials.current.set(child.uuid, mat);
      child.material = mat;
      child.renderOrder = 1;
    });
    const materials = meshMaterials.current;
    const originals = originalMaterials.current;
    return () => {
      scene.traverse((child) => {
        if (originals.has(child.uuid)) child.material = originals.get(child.uuid);
      });
      materials.forEach((material) => material.dispose());
      materials.clear();
      originals.clear();
    };
  }, [scene]);

  useEffect(() => { onReady?.(true); }, [scene, onReady]);

  // تحديث حالات التحديد والتحويم والحالة الطبيعية
  useEffect(() => {
    const isLobeSelected = Boolean(selectedLobeKey && selectedLobeKey !== "whole");

    scene.traverse((child) => {
      if (!child.isMesh) return;
      if (child.userData.anatomyRole) {
        const mat = meshMaterials.current.get(child.uuid);
        if (!mat) return;
        const selected = child.userData.structureId === selectedStructureId;
        mat.color.copy(originalMaterials.current.get(child.uuid).color);
        if (selectedStructureId && child.userData.structureId && !selected) mat.color.multiplyScalar(0.5);
        mat.emissive.set(selected ? "#ffbe55" : "#000000");
        mat.emissiveIntensity = selected ? 0.65 : 0;
        if (child.userData.anatomyRole !== "illustrative_tract") {
          child.visible = neuralMode !== "tracts";
          child.raycast = child.visible ? THREE.Mesh.prototype.raycast : skipRaycast;
          return;
        }
      }
      if (child.userData.anatomyRole === "illustrative_tract") {
        const label = child.userData.label || "";
        const lobes = label.startsWith("Arcuate") ? ["frontal", "temporal", "parietal"]
          : label.startsWith("Cingulum") ? ["limbic", "frontal", "parietal"]
          : label.startsWith("Inferior") ? ["temporal", "occipital"]
          : label.startsWith("Uncinate") ? ["frontal", "temporal"]
          : ["subcortical", "frontal", "parietal"];
        child.visible = neuralMode !== "cranial" && (showTracts || cortexOpacity < 0.99 || isIsolatingTracts)
          && (!isIsolatingTracts || !isLobeSelected || lobes.includes(selectedLobeKey));
        child.raycast = child.visible ? THREE.Mesh.prototype.raycast : skipRaycast;
        return;
      }
      const mat = meshMaterials.current.get(child.uuid);
      const colorData = meshColors.current.get(child.uuid);
      if (!mat || !colorData) return;

      const region = getRegionData(child);
      const isLobeActive = isLobeSelected && colorData.lobeKey === selectedLobeKey;
      const isRegionActive = selectedRegion && region?.id === selectedRegion.id;
      const isHovered = hoveredRegion && region?.id === hoveredRegion.id;

      const transparent = cortexOpacity < 0.99;
      if (mat.transparent !== transparent) {
        mat.transparent = transparent;
        mat.needsUpdate = true;
      }
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
        // الفص النشط حالياً عند الاختيار السريري
        mat.color.set(colorData.highlightColor);
        mat.emissive.set("#172554");
        mat.emissiveIntensity = 0.35;
        mat.roughness = 0.55;
      } else if (isLobeSelected) {
        // فصوص أخرى عند تحديد فص معين (تعتيم خفيف لتسليط الضوء على الفص المختار)
        mat.color.set(colorData.baseColor);
        mat.emissive.set("#000000");
        mat.emissiveIntensity = 0;
        mat.roughness = 0.65;
      } else {
        // ─── الحالة الطبيعية المبدئية للمجسم (Natural Baseline Anatomical State) ───
        // الدماغ كامل بحالته الطبيعية السليمة دون تلوين تشخيصي مسبق
        mat.color.set(colorData.naturalColor);
        mat.emissive.set("#000000");
        mat.emissiveIntensity = 0;
        mat.roughness = 0.7;
      }
    });
  }, [selectedLobeKey, selectedRegion, hoveredRegion, cortexOpacity, scene, showTracts, isIsolatingTracts, neuralMode, selectedStructureId]);

  const handlePointerOver = useCallback(
    (e) => {
      if (e.object.userData.structureId) {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        return;
      }
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
      if (e.object.userData.structureId) {
        document.body.style.cursor = "auto";
        return;
      }
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
      // Prefer a neural hit behind the transparent cortex over its front surface.
      const neuralHit = e.intersections.find((hit) => hit.object.userData.structureId);
      const id = e.object.userData.structureId || (cortexOpacity < 0.99 && neuralHit?.object.userData.structureId);
      if (id) {
        e.stopPropagation();
        onSelectStructure?.(id);
        return;
      }
      const region = getRegionData(e.object);
      if (!region) return;
      e.stopPropagation();
      onSelectRegion(region, e.point.clone());
    },
    [onSelectRegion, onSelectStructure, cortexOpacity]
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

