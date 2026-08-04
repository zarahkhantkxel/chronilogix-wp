"use client";

import { useEffect, useRef } from "react";

type Stop = { color: string; pos: number };

export type DitheredPatternConfig = {
  stops: Stop[];
  direction?:
    | "vertical"
    | "horizontal"
    | "diagonal"
    | "diagonal2"
    | "radial"
    | "conic";
  curve?: "linear" | "easeIn" | "easeOut" | "easeInOut" | "quad" | "cubic";
  reverse?: boolean;
  cell?: number;
  gap?: number;
  shape?: "square" | "rounded" | "circle" | "diamond";
  bg?: string;
  dither?: "bayer8" | "bayer4" | "bayer2" | "bluenoise" | "random" | "none";
  levels?: number;
  strength?: number;
  tileScale?: number;
};

const BAYER2 = [
  [0.125, 0.625],
  [0.875, 0.375],
];
const BAYER4 = [
  [0.0312, 0.5312, 0.1562, 0.6562],
  [0.7812, 0.2812, 0.9062, 0.4062],
  [0.2188, 0.7188, 0.0938, 0.5938],
  [0.9688, 0.4688, 0.8438, 0.3438],
];
const BAYER8 = (() => {
  const m = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
  ];
  return m.map((r) => r.map((v) => (v + 0.5) / 64));
})();
const BN_SIZE = 64;
const BN = (() => {
  const arr = new Float32Array(BN_SIZE * BN_SIZE);
  const g = 1.32471795724474602596;
  const a1 = 1 / g;
  const a2 = 1 / (g * g);
  for (let i = 0; i < arr.length; i++) {
    const x = (0.5 + a1 * i) % 1;
    const y = (0.5 + a2 * i) % 1;
    const idx =
      (Math.floor(y * BN_SIZE) * BN_SIZE + Math.floor(x * BN_SIZE)) %
      arr.length;
    arr[idx] = (i + 0.5) / arr.length;
  }
  for (let i = 0; i < arr.length; i++)
    if (arr[i] === 0) arr[i] = (i * 0.6180339887) % 1;
  return arr;
})();

const CURVES = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - (1 - t) * (1 - t),
  easeInOut: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  quad: (t: number) => t * t,
  cubic: (t: number) => t * t * t,
};

function hexToRgb(h: string): [number, number, number] {
  h = h.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function lerpRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}
function sampleGradient(
  stops: { pos: number; rgb: [number, number, number] }[],
  t: number,
): [number, number, number] {
  if (t <= stops[0].pos) return stops[0].rgb;
  if (t >= stops[stops.length - 1].pos) return stops[stops.length - 1].rgb;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (t >= a.pos && t <= b.pos) {
      const u = (t - a.pos) / Math.max(1e-9, b.pos - a.pos);
      return lerpRgb(a.rgb, b.rgb, u);
    }
  }
  return stops[stops.length - 1].rgb;
}

function render(canvas: HTMLCanvasElement, cfg: Required<DitheredPatternConfig>) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = (canvas.width = Math.floor(canvas.clientWidth * dpr));
  const H = (canvas.height = Math.floor(canvas.clientHeight * dpr));
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = cfg.bg;
  ctx.fillRect(0, 0, W, H);

  const cellPx = Math.max(1, Math.round(cfg.cell * dpr));
  const gapPx = Math.max(0, Math.round(cfg.gap * dpr));
  const step = cellPx + gapPx;
  const cols = Math.ceil(W / step) + 1;
  const rows = Math.ceil(H / step) + 1;

  const stopsSorted = [...cfg.stops]
    .map((s) => ({ pos: s.pos, rgb: hexToRgb(s.color) }))
    .sort((a, b) => a.pos - b.pos);
  const levels = Math.max(2, cfg.levels | 0);
  const palette: [number, number, number][] = [];
  for (let i = 0; i < levels; i++)
    palette.push(
      sampleGradient(stopsSorted, levels === 1 ? 0.5 : i / (levels - 1)),
    );
  const curve = CURVES[cfg.curve] || CURVES.linear;
  const tileS = Math.max(1, cfg.tileScale | 0);

  function pos(x: number, y: number) {
    switch (cfg.direction) {
      case "horizontal":
        return cols > 1 ? x / (cols - 1) : 0;
      case "diagonal":
        return (x + y) / Math.max(1, cols + rows - 2);
      case "diagonal2":
        return (cols - 1 - x + y) / Math.max(1, cols + rows - 2);
      case "radial": {
        const cx = (cols - 1) / 2;
        const cy = (rows - 1) / 2;
        const dx = x - cx;
        const dy = y - cy;
        return Math.min(
          1,
          Math.hypot(dx, dy) / Math.max(1e-9, Math.hypot(cx, cy)),
        );
      }
      case "conic": {
        const cx = (cols - 1) / 2;
        const cy = (rows - 1) / 2;
        return (Math.atan2(y - cy, x - cx) + Math.PI) / (Math.PI * 2);
      }
      default:
        return rows > 1 ? y / (rows - 1) : 0;
    }
  }
  function thr(x: number, y: number) {
    const xs = Math.floor(x / tileS);
    const ys = Math.floor(y / tileS);
    switch (cfg.dither) {
      case "bayer2":
        return BAYER2[ys & 1][xs & 1];
      case "bayer4":
        return BAYER4[ys & 3][xs & 3];
      case "bluenoise":
        return BN[(ys & 63) * 64 + (xs & 63)];
      case "random":
        return Math.random();
      case "none":
        return 0.5;
      default:
        return BAYER8[ys & 7][xs & 7];
    }
  }
  function paint(px: number, py: number, c: [number, number, number]) {
    ctx!.fillStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
    const s = cellPx;
    if (cfg.shape === "circle") {
      const r = s / 2;
      ctx!.beginPath();
      ctx!.arc(px + r, py + r, r, 0, Math.PI * 2);
      ctx!.fill();
    } else if (cfg.shape === "rounded") {
      const r = Math.max(1, s * 0.25);
      ctx!.beginPath();
      ctx!.moveTo(px + r, py);
      ctx!.arcTo(px + s, py, px + s, py + s, r);
      ctx!.arcTo(px + s, py + s, px, py + s, r);
      ctx!.arcTo(px, py + s, px, py, r);
      ctx!.arcTo(px, py, px + s, py, r);
      ctx!.closePath();
      ctx!.fill();
    } else if (cfg.shape === "diamond") {
      const h = s / 2;
      ctx!.beginPath();
      ctx!.moveTo(px + h, py);
      ctx!.lineTo(px + s, py + h);
      ctx!.lineTo(px + h, py + s);
      ctx!.lineTo(px, py + h);
      ctx!.closePath();
      ctx!.fill();
    } else {
      ctx!.fillRect(px, py, s, s);
    }
  }
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let t = pos(x, y);
      if (cfg.reverse) t = 1 - t;
      t = curve(Math.max(0, Math.min(1, t)));
      const f = t * (levels - 1);
      const lo = Math.floor(f);
      const frac = f - lo;
      const adj = 0.5 + (thr(x, y) - 0.5) * cfg.strength;
      const idx = frac > adj ? Math.min(levels - 1, lo + 1) : lo;
      paint(x * step, y * step, palette[idx]);
    }
  }
}

const DEFAULTS: Required<Omit<DitheredPatternConfig, "stops">> = {
  direction: "vertical",
  curve: "linear",
  reverse: false,
  cell: 8,
  gap: 2,
  shape: "square",
  bg: "#0e0a07",
  dither: "bayer8",
  levels: 7,
  strength: 1,
  tileScale: 1,
};

export function DitheredPattern({
  config,
  className,
}: {
  config: DitheredPatternConfig;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const merged = { ...DEFAULTS, ...config } as Required<DitheredPatternConfig>;
    const draw = () => render(canvas, merged);
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    draw();
    return () => ro.disconnect();
  }, [config]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
