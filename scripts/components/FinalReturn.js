/* 007 — THE RETURN. The room goes dark and the lines arrive one at a time. */

import { qs } from "../lib/dom.js";
import { onScene } from "../lib/motion.js";

export function initFinalReturn() {
  const antim = qs("#antim");
  const host = qs("#antimLines");
  if (!antim || !host) return;

  const lines = [...host.children];
  const n = lines.length;

  onScene(antim, (p) => {
    const idx = Math.min(n - 1, Math.floor(p * n));
    lines.forEach((l, i) => l.classList.toggle("is-on", i === idx));
  });
}
