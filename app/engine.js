/* Banner engine: every model draws into a 2D canvas so preview and export are pixel-identical. */
(function (global) {
  const FORMATS = {
    desktop: { w: 1920, h: 800 },
    mobile: { w: 1080, h: 1350 },
  };

  const imgCache = new Map();
  function loadImage(src) {
    if (!imgCache.has(src)) {
      imgCache.set(src, new Promise((res, rej) => {
        const im = new Image();
        im.crossOrigin = 'anonymous';
        im.decoding = 'async';
        im.onload = () => res(im);
        im.onerror = () => rej(new Error('Falha ao carregar ' + src));
        im.src = src;
      }));
    }
    return imgCache.get(src);
  }

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  function hex(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const mixRGB = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const luma = c => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;

  /* Draw an image to cover WxH, honoring a focal point (0..1) and zoom >= 1. Returns the source rect. */
  function drawCover(ctx, img, W, H, fx = 0.5, fy = 0.5, zoom = 1, flip = false) {
    const s = Math.max(W / img.width, H / img.height) * zoom;
    const sw = W / s, sh = H / s;
    // focal x is read in the mirrored frame when flipped, so "focus right" stays right on screen
    const fxs = flip ? 1 - fx : fx;
    const sx = clamp(fxs * img.width - sw / 2, 0, img.width - sw);
    const sy = clamp(fy * img.height - sh / 2, 0, img.height - sh);
    ctx.save();
    if (flip) { ctx.translate(W, 0); ctx.scale(-1, 1); }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
    ctx.restore();
    return { sx, sy, sw, sh, s };
  }

  /* A photographic cutout placed in the scene. size = longest side in px. */
  function drawElement(ctx, img, o) {
    const { x, size, rot = 0, blur = 0, flip = false, shadow, filter = '', contact, anchor } = o;
    const k = size / Math.max(img.width, img.height);
    const w = img.width * k, h = img.height * k;
    // anchor 'bottom': y is where the object rests, not its center
    const y = anchor === 'bottom' ? o.y - h / 2 : o.y;
    if (contact) {
      // soft ground shadow under a resting object, drawn in world space before the object
      ctx.save();
      ctx.filter = `blur(${Math.max(2, h * 0.06)}px)`;
      ctx.globalAlpha = contact;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(x, y + h * 0.46, w * 0.46, h * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot * Math.PI / 180);
    if (flip) ctx.scale(-1, 1);
    if (shadow) {
      ctx.save();
      // shadow offset must stay in world space, so counter-rotate it
      const r = -rot * Math.PI / 180;
      const sx = shadow.x * Math.cos(r) - shadow.y * Math.sin(r);
      const sy = shadow.x * Math.sin(r) + shadow.y * Math.cos(r);
      ctx.filter = `blur(${shadow.blur + blur}px) brightness(0)`;
      ctx.globalAlpha = shadow.alpha;
      ctx.drawImage(img, -w / 2 + sx * (flip ? -1 : 1), -h / 2 + sy, w, h);
      ctx.restore();
    }
    ctx.filter = [filter, blur ? `blur(${blur}px)` : ''].join(' ').trim() || 'none';
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  let grainTile = null;
  function grain(ctx, W, H, amount = 0.06) {
    if (!grainTile) {
      grainTile = document.createElement('canvas');
      grainTile.width = grainTile.height = 256;
      const g = grainTile.getContext('2d');
      const d = g.createImageData(256, 256);
      for (let i = 0; i < d.data.length; i += 4) {
        const v = 128 + (Math.random() + Math.random() + Math.random() - 1.5) * 90;
        d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255;
      }
      g.putImageData(d, 0, 0);
    }
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = amount;
    ctx.fillStyle = ctx.createPattern(grainTile, 'repeat');
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function offscreen(W, H) {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    return c;
  }

  /* Resolve the effective state for one model + format, merging defaults with user overrides. */
  function resolve(model, fmt, state = {}) {
    const F = model.formats[fmt];
    // background photo: an uploaded file wins; otherwise the chosen library photo with its tuned framing
    const lib = state.photoSrc ? null : ((model.photos || []).find(p => p.id === state.photoId) || (model.photos || []).find(p => p.id === model.defaultPhoto) || (model.photos || [])[0] || null);
    const libF = (lib && lib[fmt]) || {};
    const photo = Object.assign({ src: lib ? lib.src : model.photo }, F.photo, libF.photo || {}, (state.photo || {})[fmt] || {});
    if (state.photoSrc) photo.src = state.photoSrc;
    const cat = global.BannerElementsById || {};
    const slots = F.slots.map(s => {
      const o = ((state.slots || {})[fmt] || {})[s.id] || {};
      const el = o.el || s.el;
      return Object.assign({}, s, {
        on: o.on !== undefined ? o.on : s.on !== false,
        el, depth: o.depth || s.depth, flip: o.flip !== undefined ? o.flip : s.flip,
        x: s.x + (o.dx || 0), y: s.y + (o.dy || 0),
        size: s.size * (o.scale || 1) * (((cat[el] && cat[el].scale) || 1) / ((cat[s.el] && cat[s.el].scale) || 1)),
        rot: s.rot + (o.drot || 0) + ((cat[el] && cat[el].rot) || 0),
      });
    });
    const params = Object.assign({}, model.params || {}, F.params || {}, (lib && lib.params) || {}, libF.params || {}, ((state.params || {})[fmt]) || {});
    return {
      fmt, W: FORMATS[fmt].w, H: FORMATS[fmt].h,
      tone: state.tone || 'dark',
      primary: hex(state.primary || model.palettes[0].primary),
      secondary: hex(state.secondary || model.palettes[0].secondary),
      photo, slots, params, copy: F.copy,
    };
  }

  async function render(canvas, model, fmt, state = {}) {
    const R = resolve(model, fmt, state);
    canvas.width = R.W; canvas.height = R.H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const els = {};
    const need = [R.photo.src, ...R.slots.filter(s => s.on).map(s => model.elementPath(s.el))];
    const imgs = await Promise.all(need.map(src => src ? loadImage(src) : Promise.resolve(null)));
    const photo = imgs[0];
    R.slots.filter(s => s.on).forEach((s, i) => { els[s.id] = imgs[i + 1]; });
    // model-declared extra assets (textures, motif art): {name: src|null}
    const extra = {};
    const want = model.assets ? model.assets(R) : {};
    await Promise.all(Object.entries(want).map(async ([k, src]) => { extra[k] = src ? await loadImage(src) : null; }));
    await model.draw(ctx, R, Object.assign({ photo, els, api: API }, extra));
    return R;
  }

  const API = { FORMATS, loadImage, clamp, smooth, lerp, hex, mixRGB, rgba, luma, drawCover, drawElement, grain, offscreen, resolve, render };
  global.BannerEngine = API;
})(window);
