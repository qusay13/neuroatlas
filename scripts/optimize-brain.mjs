import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs/promises';

// Keep the authoring source untouched. No decimation, joining or removal of anatomical parts.
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder,
});
const document = await io.read('public/brain.glb');
await document.transform(meshopt({encoder: MeshoptEncoder, level: 'medium', quantizePosition: 16, quantizeNormal: 12}));
await io.write('public/brain-optimized.glb', document);
const original = (await fs.stat('public/brain.glb')).size;
const optimized = (await fs.stat('public/brain-optimized.glb')).size;
console.log(JSON.stringify({originalBytes: original, optimizedBytes: optimized, reductionPercent: +(100*(1-optimized/original)).toFixed(1)}, null, 2));
