/* Scene helpers shared by models: seeded randomness, bokeh lights, slot drawing, texture, light, bubbles.
   (Natal: sem photoPrint/leafPile/subwayTiles/shelf — nada de mockup de foto em moldura, cartão ou impressão.) */
(function () {
  const E = window.BannerEngine;

  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  /* warm out-of-focus lights; region in 0..1 canvas units */
  function bokeh(ctx, R, { n = 30, region = [0, 0, 1, 1], color, alpha = 0.35, seed = 7, min = 0.01, max = 0.05 }) {
    const { W, H } = R, r = rng(seed), c = color || [255, 190, 110];
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < n; i++) {
      const x = (region[0] + r() * (region[2] - region[0])) * W, y = (region[1] + r() * (region[3] - region[1])) * H;
      const rad = (min + r() * (max - min)) * Math.min(W, H) * 1.6, a = alpha * (0.35 + r() * 0.65);
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, E.rgba(c, a)); g.addColorStop(0.55, E.rgba(c, a * 0.55)); g.addColorStop(1, E.rgba(c, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  /* slots: offsets from an anchor point (or the canvas origin), drawn by depth */
  function drawSlots(ctx, R, els, { anchors = {}, top = false, flat = false, soft = 1 } = {}) {
    const { W, H } = R, dark = R.tone === 'dark';
    const order = { ground: 0, far: 1, mid: 2, near: 3 };
    const list = R.slots.filter(s => s.on && els[s.id] && (top ? s.top : !s.top)).sort((a, b) => (order[a.depth] || 1) - (order[b.depth] || 1));
    for (const s of list) {
      const a = s.anchor ? anchors[s.anchor] : [0, 0];
      const x = a[0] + s.x * W, y = a[1] + s.y * H, size = s.size * H;
      const ground = s.depth === 'ground';
      if ([].concat(s.kind).includes('bubble')) {
        ctx.save(); if (dark) ctx.globalCompositeOperation = 'screen';
        E.drawElement(ctx, els[s.id], { x, y, size, rot: s.rot, flip: !!s.flip });
        ctx.restore(); continue;
      }
      if (ground) {
        // grounding: a wide, soft occlusion pool where the object meets the surface, so nothing reads as pasted on
        const img = els[s.id], k = size / Math.max(img.width, img.height), w = img.width * k, h = img.height * k;
        ctx.save(); ctx.filter = `blur(${Math.max(6, h * 0.1)}px)`; ctx.globalAlpha = dark ? 0.55 : 0.32; ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.ellipse(x + w * 0.05, y - h * 0.03, w * 0.6, h * 0.17, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      const sh = ground ? { x: size * 0.06, y: -size * 0.015, blur: size * 0.09, alpha: dark ? 0.45 : 0.24 } : flat
        ? { x: size * 0.035, y: size * 0.06, blur: size * 0.05, alpha: dark ? 0.55 : 0.32 }
        : { x: size * 0.04, y: size * 0.08, blur: size * 0.06, alpha: (dark ? 0.45 : 0.25) * soft };
      E.drawElement(ctx, els[s.id], { x, y, size, rot: s.rot, blur: (s.blur || 0) * Math.min(W, H) / 800, flip: !!s.flip, shadow: sh,
        filter: dark ? 'brightness(0.94) saturate(1.04)' : 'saturate(1.02)', contact: ground ? (dark ? 0.55 : 0.35) : 0, anchor: ground ? 'bottom' : null });
    }
  }

  function texture(ctx, R, img, amt) {
    if (!img) return;
    const dark = R.tone === 'dark';
    ctx.save();
    // light tone: texture reads as relief, not as grime
    ctx.globalCompositeOperation = 'soft-light';
    ctx.globalAlpha = dark ? amt : amt * 0.75;
    E.drawCover(ctx, img, R.W, R.H, 0.5, 0.5, 1);
    ctx.restore();
  }

  function light(ctx, R, cx, cy, strength = 1) {
    const { W, H } = R, dark = R.tone === 'dark';
    const g = ctx.createRadialGradient(cx * W, cy * H, 0, cx * W, cy * H, Math.max(W, H) * 0.8);
    g.addColorStop(0, dark ? `rgba(255,236,210,${0.12 * strength})` : `rgba(255,255,255,${0.35 * strength})`);
    g.addColorStop(1, dark ? `rgba(0,0,0,${0.4 * strength})` : `rgba(60,40,20,${0.07 * strength})`);
    ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  }

  /* a soap bubble: clear body, iridescent thin-film rim, crescent highlight and a specular point */
  function bubble(ctx, x, y, r, { dark = true, seed = 1, alpha = 1 } = {}) {
    const rnd = rng(seed), turn = rnd() * Math.PI * 2;
    ctx.save();
    ctx.globalAlpha = alpha;
    // body: almost clear, slightly brighter toward the rim
    const body = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    body.addColorStop(0, 'rgba(255,255,255,0)');
    body.addColorStop(0.78, dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.18)');
    body.addColorStop(0.97, dark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.45)');
    body.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    // thin-film colors travel around the rim
    const cg = ctx.createConicGradient(turn, x, y);
    const film = ['rgba(255,80,190,A)', 'rgba(255,214,90,A)', 'rgba(90,240,200,A)', 'rgba(80,150,255,A)', 'rgba(190,90,255,A)', 'rgba(255,80,190,A)'];
    const fa = dark ? 0.55 : 0.5;
    film.forEach((c, i) => cg.addColorStop(i / (film.length - 1), c.replace('A', String(fa))));
    ctx.globalCompositeOperation = dark ? 'screen' : 'source-over';
    ctx.lineWidth = Math.max(1.2, r * 0.045);
    ctx.strokeStyle = cg; ctx.beginPath(); ctx.arc(x, y, r * 0.975, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = Math.max(0.8, r * 0.018);
    ctx.globalAlpha = alpha * 0.6; ctx.beginPath(); ctx.arc(x, y, r * 0.9, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = alpha;
    if (!dark) { ctx.globalCompositeOperation = 'source-over'; ctx.lineWidth = Math.max(0.8, r * 0.012); ctx.strokeStyle = 'rgba(40,50,70,0.12)'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); }
    // crescent window reflection, upper left
    ctx.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * 0.92, 0, Math.PI * 2); ctx.clip();
    const hx = x - r * 0.38, hy = y - r * 0.4;
    const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.42);
    hg.addColorStop(0, 'rgba(255,255,255,0.55)'); hg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(hx, hy, r * 0.34, r * 0.18, -Math.PI / 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(x + r * 0.42, y + r * 0.36, Math.max(1, r * 0.05), 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  /* a drift of bubbles inside a region, sizes in canvas-height units */
  function bubbles(ctx, R, { region, n = 8, min = 0.02, max = 0.08, seed = 9, alpha = 1 }) {
    const { W, H } = R, r = rng(seed), dark = R.tone === 'dark';
    for (let i = 0; i < n; i++) {
      const x = (region[0] + r() * (region[2] - region[0])) * W, y = (region[1] + r() * (region[3] - region[1])) * H;
      const rad = (min + Math.pow(r(), 2.2) * (max - min)) * H;
      bubble(ctx, x, y, rad, { dark, seed: seed * 13 + i, alpha: alpha * (0.75 + r() * 0.25) });
    }
  }
  window.BannerScenes = { rng, bokeh, drawSlots, texture, light, bubble, bubbles };
})();
