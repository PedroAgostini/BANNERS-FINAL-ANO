/* Shared element library (Natal): real photographic cutouts, keyed to transparent PNG and audited on dark,
   mid and light grounds (no straight cut edges, no baked shadows, no backdrop remnants).
   Starts EMPTY: nothing from the Thanksgiving set (leaves, pumpkins, acorns, pine cones, berries, wheat, garlands)
   was carried over. Add Christmas cutouts here as they are made and approved.
   kind: how a slot uses the element, e.g. branch = enters from a corner · ground = rests on a surface ·
   flat = seen from above · hang = hangs from the top · float = drifts in the air (snow, sparkles) · bubble.
   rot: base rotation that points a branch's stem toward the top-right corner.
   src: Pexels photo id (or 'ref' / 'proc') for the credit line.
   assets/el/ also keeps the neutral trade props from the previous project (paintbrush, paint strokes, tools,
   ladder, drywall knives, floor samples, bubbles); models load those directly via model.assets(). */
(function () {
  const G = (id, name, src) => ({ id, name, kind: 'ground', src });
  window.BannerElements = [
    // e.g. { id: 'fir-branch-1', name: 'Galho de pinheiro', kind: 'branch', rot: -135, src: 0000000 },
    // e.g. G('ornament-red', 'Bola vermelha', 0000000),
  ];
  // extra kinds an element can fill: e.kinds = ['ground', 'flat', 'cluster']
  // real-world relative sizes, so swapping elements in the same slot keeps a believable scale
  const SCALE = {};
  window.BannerElements.forEach(e => { e.scale = SCALE[e.id] || 1; });
  window.BannerElementsById = Object.fromEntries(window.BannerElements.map(e => [e.id, e]));
})();
