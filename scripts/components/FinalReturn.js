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
    const x = p * n;
    const idx = Math.min(n - 1, Math.floor(x));
    const within = x - idx;
    /* a held breath of black between lines; the couplet, once said, stays */
    const said = within > 0.14 && (within < 0.86 || idx === n - 1);
    lines.forEach((l, i) => l.classList.toggle("is-on", said && i === idx));
  });
}
