(() => {
  "use strict";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const angleLabel = document.getElementById("hero-angle");

  const model = { A: 30 * DEG, L: 1.2, g: 9.8 };
  const omega = Math.sqrt(model.g / model.L);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0, height = 0, dpr = 1;
  let background = null;
  let start = performance.now();
  let lastLabel = 0;

  function buildBackground() {
    const bg = document.createElement("canvas");
    bg.width = Math.round(width * dpr);
    bg.height = Math.round(height * dpr);
    const b = bg.getContext("2d");
    b.setTransform(dpr, 0, 0, dpr, 0, 0);

    const grad = b.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#fcf9f2");
    grad.addColorStop(0.58, "#faf6ed");
    grad.addColorStop(1, "#f4eee2");
    b.fillStyle = grad;
    b.fillRect(0, 0, width, height);

    const glow = b.createRadialGradient(width * 0.5, height * 0.3, 8, width * 0.5, height * 0.3, Math.max(width, height) * 0.62);
    glow.addColorStop(0, "rgba(201,68,47,.05)");
    glow.addColorStop(0.6, "rgba(201,68,47,.012)");
    glow.addColorStop(1, "rgba(201,68,47,0)");
    b.fillStyle = glow;
    b.fillRect(0, 0, width, height);

    const step = width < 520 ? 22 : 28;
    b.fillStyle = "rgba(53,43,29,.10)";
    for (let y = step * 0.7; y < height; y += step) {
      for (let x = step * 0.6; x < width; x += step) {
        b.beginPath();
        b.arc(x, y, 0.8, 0, TAU);
        b.fill();
      }
    }

    const vignette = b.createRadialGradient(width * 0.5, height * 0.48, Math.min(width, height) * 0.32, width * 0.5, height * 0.48, Math.max(width, height) * 0.8);
    vignette.addColorStop(0, "rgba(70,52,30,0)");
    vignette.addColorStop(1, "rgba(70,52,30,.05)");
    b.fillStyle = vignette;
    b.fillRect(0, 0, width, height);
    background = bg;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildBackground();
    draw(performance.now());
  }

  function haloText(text, x, y, color, font, align = "center") {
    ctx.save();
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(250,247,239,.95)";
    ctx.lineWidth = 4.5;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function draw(now) {
    if (!background) return;
    const t = reduceMotion ? 0 : Math.max(0, (now - start) / 1000);
    const theta = model.A * Math.cos(omega * t);
    const px = width * 0.5;
    const py = height * 0.18;
    const len = Math.min(height * 0.56, width * 0.66);
    const bobR = clamp(len * 0.073, 11, 25);
    const unit = clamp(Math.min(width, height) / 600, 0.84, 1.15);
    const bx = px + Math.sin(theta) * len;
    const by = py + Math.cos(theta) * len;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(background, 0, 0, width, height);

    // dashed vertical reference
    ctx.save();
    ctx.strokeStyle = "rgba(36,35,31,.28)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 7]);
    ctx.beginPath();
    ctx.moveTo(px, py - 34);
    ctx.lineTo(px, height * 0.95);
    ctx.stroke();
    ctx.restore();

    // swing arc
    ctx.beginPath();
    ctx.arc(px, py, len, Math.PI / 2 - model.A, Math.PI / 2 + model.A, false);
    ctx.strokeStyle = "rgba(183,131,16,.18)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 7]);
    ctx.stroke();
    ctx.setLineDash([]);

    // ceiling
    const half = width * 0.39;
    ctx.save();
    ctx.strokeStyle = "rgba(36,35,31,.76)";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(px - half, py);
    ctx.lineTo(px + half, py);
    ctx.stroke();
    ctx.strokeStyle = "rgba(36,35,31,.52)";
    ctx.lineWidth = 1.1;
    for (let x = px - half + 8; x < px + half - 4; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x - 7, py - 2.5);
      ctx.lineTo(x + 3, py - 13);
      ctx.stroke();
    }
    ctx.restore();

    // pivot
    ctx.beginPath();
    ctx.arc(px, py, 6.5, 0, TAU);
    ctx.fillStyle = "rgba(250,247,239,.92)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, TAU);
    ctx.fillStyle = "#24231f";
    ctx.fill();

    // ghost trail
    for (let i = 8; i >= 1; i--) {
      const ga = model.A * Math.cos(omega * (t - i * 0.16));
      const gx = px + Math.sin(ga) * len;
      const gy = py + Math.cos(ga) * len;
      const alpha = 0.23 * (1 - i / 9);
      ctx.beginPath();
      ctx.arc(gx, gy, bobR * 0.52, 0, TAU);
      ctx.strokeStyle = `rgba(201,68,47,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // angle arc
    const arcR = clamp(len * 0.34, 28, 96);
    if (Math.abs(theta) > 0.02) {
      ctx.beginPath();
      ctx.arc(px, py, arcR, Math.PI / 2, Math.PI / 2 - theta, theta > 0);
      ctx.strokeStyle = "rgba(201,68,47,.72)";
      ctx.lineWidth = 1.3;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    const mid = Math.PI / 2 - theta / 2;
    const tx = px + Math.cos(mid) * (arcR + 20);
    const ty = py + Math.sin(mid) * (arcR + 21);
    haloText("θ", tx, ty, "#c9442f", `italic 500 ${21 * unit}px "Cambria Math","Noto Serif SC",Georgia,serif`);

    // length label
    const mx = px + Math.sin(theta) * len * 0.61;
    const my = py + Math.cos(theta) * len * 0.61;
    haloText("L", mx - Math.cos(theta) * 16, my + Math.sin(theta) * 16,
      "#93670a", `italic 500 ${16 * unit}px "Cambria Math","Noto Serif SC",Georgia,serif`);

    // rope
    ctx.save();
    const rope = ctx.createLinearGradient(px, py, bx, by);
    rope.addColorStop(0, "#c99a2e");
    rope.addColorStop(0.55, "#b78310");
    rope.addColorStop(1, "#93670a");
    ctx.strokeStyle = rope;
    ctx.lineWidth = 2.3;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(74,52,9,.24)";
    ctx.shadowBlur = 7;
    ctx.shadowOffsetY = 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.restore();

    // bob
    ctx.save();
    ctx.shadowColor = "rgba(74,31,20,.26)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 3;
    const bob = ctx.createRadialGradient(bx - bobR * 0.34, by - bobR * 0.42, bobR * 0.1, bx, by, bobR);
    bob.addColorStop(0, "#eb7a61");
    bob.addColorStop(0.52, "#d24e36");
    bob.addColorStop(1, "#a82e1c");
    ctx.beginPath();
    ctx.arc(bx, by, bobR, 0, TAU);
    ctx.fillStyle = bob;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "#2b1d18";
    ctx.lineWidth = 1.7;
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(bx - bobR * 0.28, by - bobR * 0.32, bobR * 0.18, 0, TAU);
    ctx.fillStyle = "rgba(255,245,232,.46)";
    ctx.fill();

    if (angleLabel && now - lastLabel > 90) {
      lastLabel = now;
      const deg = theta / DEG;
      const sign = Math.abs(deg) < 0.05 ? "" : deg > 0 ? "+" : "−";
      angleLabel.textContent = `θ ${sign}${Math.abs(deg).toFixed(1)}°`;
    }
  }

  function frame(now) {
    draw(now);
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  window.addEventListener("resize", resize);
  resize();
  if (!reduceMotion) requestAnimationFrame(frame);
})();
