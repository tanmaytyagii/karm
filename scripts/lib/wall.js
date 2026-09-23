/* Brick geometry, shared by every wall in KARM. Running bond. */

import { el } from "./dom.js";
import { rand } from "./motion.js";

const BASES = [
  [110, 64, 48],
  [138, 85, 64],
  [166, 107, 77]
];

/* One brightness factor per brick, applied to every channel, so the clay
   keeps its hue instead of drifting pink or olive. Lit bricks are the
   exception, not the rule: a wall at night is mostly shadow. */
export function tone(lo = 0.5, hi = 0.84) {
  const b = BASES[(Math.random() * BASES.length) | 0];
  const k = rand(lo, hi);
  const c = (v, m = 1) => Math.round(Math.max(5, Math.min(252, v * k * m)));
  return {
    "--b1": `rgb(${c(b[0])},${c(b[1])},${c(b[2])})`,
    "--b2": `rgb(${c(b[0], 0.64)},${c(b[1], 0.64)},${c(b[2], 0.64)})`
  };
}

/* Lay out a running-bond grid inside host. Row 0 is the bottom course. */
export function layout(host, { rows, target, ratio = 0.42, gap = 3, minCols = 3 }) {
  const W = host.clientWidth;
  if (!W) return null;

  const cols = Math.max(minCols, Math.round(W / target));
  const bw = W / cols;
  const bh = Math.max(13, Math.round(bw * ratio));
  const cells = [];

  for (let r = 0; r < rows; r++) {
    const odd = r % 2 === 1;
    const shift = odd ? -bw / 2 : 0;
    const n = odd ? cols + 1 : cols;
    for (let c = 0; c < n; c++) {
      cells.push({
        row: r,
        col: c,
        left: c * bw + shift,
        bottom: r * bh,
        w: bw - gap,
        h: bh - gap
      });
    }
  }

  const height = rows * bh;
  host.style.height = `${height}px`;
  return { cells, cols, bw, bh, height };
}

export function place(node, cell) {
  node.style.left = `${cell.left.toFixed(2)}px`;
  node.style.bottom = `${cell.bottom.toFixed(2)}px`;
  node.style.width = `${cell.w.toFixed(2)}px`;
  node.style.height = `${cell.h.toFixed(2)}px`;
  return node;
}

/* A plain brick face. */
export function brick(extra = "") {
  const b = el("span", { class: `brick ${extra}`.trim(), vars: tone() });
  if (Math.random() < 0.06) {
    b.classList.add("is-cracked");
    b.style.setProperty("--crack", `${rand(-7, 7).toFixed(1)}deg`);
  }
  return b;
}

/* An interactive brick: a slot (the hole) wrapping a button (the brick). */
export function slot(cell, word, label) {
  const holder = place(el("div", { class: "slot" }), cell);
  const btn = el(
    "button",
    {
      type: "button",
      class: "brick",
      "aria-label": label,
      vars: tone(0.64, 0.96)
    },
    [el("span", { class: "brick__word", lang: "hi", text: word })]
  );
  if (Math.random() < 0.08) {
    btn.classList.add("is-cracked");
    btn.style.setProperty("--crack", `${rand(-7, 7).toFixed(1)}deg`);
  }
  holder.append(btn);
  return { holder, btn };
}

/* Spread n words across m cells as evenly as the grid allows. */
export function spread(total, count) {
  const step = total / count;
  const out = [];
  for (let i = 0; i < count; i++) {
    const base = Math.floor(i * step + step / 2);
    let idx = base + Math.round(rand(-step / 3, step / 3));
    idx = Math.max(0, Math.min(total - 1, idx));
    while (out.includes(idx)) idx = (idx + 1) % total;
    out.push(idx);
  }
  return out;
}
