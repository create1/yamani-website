/**
 * Apotheos — Low Poly Background Animation
 * Interactive triangulated mesh that responds to mouse movement and scrolling
 */

(function () {
  'use strict';

  // ─── Brand Palette (dark → light) ────────────────────────────────────────────
  const PALETTE = [
    [28,  45,  58],   // near-black
    [36,  58,  72],   // deep charcoal
    [44,  72,  85],   // dark slate
    [55,  90, 105],   // mid slate
    [80, 128, 142],   // primary slate
    [90, 140, 154],   // lighter slate
    [105, 162, 151],  // eucalyptus
    [118, 172, 160],  // light eucalyptus
    [132, 181, 159],  // sage
  ];

  // ─── Config ───────────────────────────────────────────────────────────────────
  const CFG = {
    cellSize:      130,    // approx triangle size (px)
    jitter:        0.45,   // random offset as fraction of cellSize
    floatAmp:      7,      // floating animation amplitude (px)
    floatSpeed:    0.006,  // time step per frame
    mouseRadius:   200,    // repulsion radius around cursor (px)
    mouseStrength: 1.4,    // repulsion force
    returnForce:   0.028,  // spring return toward base position
    friction:      0.86,   // velocity damping
    edgeAlpha:     0.07,   // triangle edge line opacity (0 = off)
    scrollWave:    0.004,  // how much scroll creates a wave
    canvasAlpha:   1.0,    // overall canvas opacity
  };

  // ─── State ────────────────────────────────────────────────────────────────────
  let canvas, ctx;
  let W, H;
  let cols, rows;
  let points = [];
  let triIdx = [];    // triangle connectivity: array of [i0, i1, i2]
  let triColor = [];  // pre-computed color per triangle [r,g,b]
  let mouse = { x: -9999, y: -9999 };
  let scrollY = 0;
  let time = 0;
  let raf;

  // ─── Initialise ───────────────────────────────────────────────────────────────
  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'lowpoly-bg';
    canvas.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:100%',
      'height:100%',
      'z-index:0',
      'pointer-events:none',
      `opacity:${CFG.canvasAlpha}`,
      'will-change:transform',
    ].join(';');
    document.body.prepend(canvas);

    ctx = canvas.getContext('2d');
    rebuild();
    bindEvents();
    if (raf) cancelAnimationFrame(raf);
    tick();
  }

  // ─── Build mesh ───────────────────────────────────────────────────────────────
  function rebuild() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;

    const cell   = Math.max(80, Math.min(160, W / 10));
    const jitter = cell * CFG.jitter;

    cols = Math.ceil(W / cell) + 2;
    rows = Math.ceil(H / cell) + 2;

    points   = [];
    triIdx   = [];
    triColor = [];

    // Jittered grid points
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const bx = (c - 0.5) * cell;
        const by = (r - 0.5) * cell;
        points.push({
          x:  bx + rand(-jitter, jitter),
          y:  by + rand(-jitter, jitter),
          bx, by,
          vx: 0, vy: 0,
          phase: Math.random() * Math.PI * 2,
          freq:  0.55 + Math.random() * 0.6,
        });
      }
    }

    // Build triangle index list (two triangles per quad cell)
    const W_ = cols + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tl = r * W_ + c,
              tr = tl + 1,
              bl = tl + W_,
              br = bl + 1;
        if (!points[br]) continue;

        if ((r + c) % 2 === 0) {
          triIdx.push([tl, tr, bl]);
          triIdx.push([tr, br, bl]);
        } else {
          triIdx.push([tl, tr, br]);
          triIdx.push([tl, br, bl]);
        }
      }
    }

    // Pre-assign a colour to each triangle based on centroid depth
    triColor = triIdx.map(([i0, i1, i2]) => {
      const cx = (points[i0].bx + points[i1].bx + points[i2].bx) / 3;
      const cy = (points[i0].by + points[i1].by + points[i2].by) / 3;
      return sampleColor(cx, cy);
    });
  }

  // ─── Color logic ──────────────────────────────────────────────────────────────
  function sampleColor(cx, cy) {
    // Depth = blend of vertical + slight horizontal bias + noise
    const depth = clamp(
      (cy / H) * 0.65 + (cx / W) * 0.2 + rand(-0.12, 0.12),
      0, 1
    );
    const scaled = depth * (PALETTE.length - 1);
    const lo  = Math.floor(scaled);
    const hi  = Math.min(lo + 1, PALETTE.length - 1);
    const t   = scaled - lo;
    const c1  = PALETTE[lo];
    const c2  = PALETTE[hi];
    const noise = rand(-10, 10);
    return [
      clamp(Math.round(lerp(c1[0], c2[0], t) + noise), 0, 255),
      clamp(Math.round(lerp(c1[1], c2[1], t) + noise), 0, 255),
      clamp(Math.round(lerp(c1[2], c2[2], t) + noise), 0, 255),
    ];
  }

  // ─── Physics update ───────────────────────────────────────────────────────────
  function update() {
    time += CFG.floatSpeed;
    const mx = mouse.x;
    const my = mouse.y + scrollY; // map to page space
    const R  = CFG.mouseRadius;
    const R2 = R * R;

    points.forEach((p, idx) => {
      const row = Math.floor(idx / (cols + 1));

      // Ambient floating
      const fx = Math.sin(time * p.freq       + p.phase) * CFG.floatAmp;
      const fy = Math.cos(time * p.freq * 0.7 + p.phase) * CFG.floatAmp;

      // Scroll wave: rows offset by a sine wave that travels with scrollY
      const wave = Math.sin(row * 0.25 + scrollY * CFG.scrollWave) * 10;

      // Spring toward (base + float + wave)
      const tx = p.bx + fx;
      const ty = p.by + fy + wave;
      p.vx += (tx - p.x) * CFG.returnForce;
      p.vy += (ty - p.y) * CFG.returnForce;

      // Mouse repulsion
      const dx = p.x - mx;
      const dy = p.y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < R2 && d2 > 0) {
        const d     = Math.sqrt(d2);
        const force = (1 - d / R) * CFG.mouseStrength;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      }

      p.vx *= CFG.friction;
      p.vy *= CFG.friction;
      p.x  += p.vx;
      p.y  += p.vy;
    });
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < triIdx.length; i++) {
      const [i0, i1, i2] = triIdx[i];
      const p0 = points[i0];
      const p1 = points[i1];
      const p2 = points[i2];
      const [r, g, b] = triColor[i];

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.closePath();

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fill();

      if (CFG.edgeAlpha > 0) {
        ctx.strokeStyle = `rgba(255,255,255,${CFG.edgeAlpha})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }
    }
  }

  // ─── Mouse glow overlay near cursor ──────────────────────────────────────────
  function drawGlow() {
    if (mouse.x < 0) return;
    const grd = ctx.createRadialGradient(
      mouse.x, mouse.y, 0,
      mouse.x, mouse.y, CFG.mouseRadius * 1.2
    );
    grd.addColorStop(0,   'rgba(132,181,159,0.12)');
    grd.addColorStop(0.5, 'rgba(105,162,151,0.05)');
    grd.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
  }

  // ─── Animation loop ───────────────────────────────────────────────────────────
  function tick() {
    update();
    draw();
    drawGlow();
    raf = requestAnimationFrame(tick);
  }

  // ─── Events ───────────────────────────────────────────────────────────────────
  function bindEvents() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(rebuild, 150);
    });

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    window.addEventListener('touchmove', e => {
      if (e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    }, { passive: true });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  function rand(lo, hi)      { return lo + Math.random() * (hi - lo); }
  function lerp(a, b, t)     { return a + (b - a) * t; }
  function clamp(v, lo, hi)  { return Math.max(lo, Math.min(hi, v)); }

  // ─── Boot ─────────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
