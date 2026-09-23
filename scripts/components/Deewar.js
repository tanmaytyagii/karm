/* 006 — DEEWAR. You built it. Taking it apart is also yours. */

import { qs, el, pad } from "../lib/dom.js";
import { layout, place, brick, slot, spread } from "../lib/wall.js";
import { debounce, rand, reduced } from "../lib/motion.js";
import { words, fragments, marks } from "../../data/fragments.js";
import * as sound from "../lib/sound.js";

const KEEP = 6; /* how many fragments stay on screen */
const rowsFor = () => (window.innerWidth < 900 ? 8 : 7);

export function initDeewar() {
  const wallEl = qs("#deewarWall");
  const wrap = qs(".deewar__wallwrap");
  const countEl = qs("#deewarCount");
  const fragsEl = qs("#deewarFrags");
  const markEl = qs("#deewarMark");
  const resetBtn = qs("#deewarReset");
  if (!wallEl || !wrap) return;

  let total = 0;
  let removed = 0;
  let shown = new Set();

  const setCount = () => {
    countEl.textContent = `ईंट हटाई ${pad(removed)} / ${pad(total)}`;
    wrap.style.setProperty("--lit", (Math.min(1, removed / Math.max(1, total)) * 0.92).toFixed(3));
  };

  function addFragment(text) {
    const node = el("li", { class: "frag" }, el("span", { text }));
    fragsEl.append(node);
    requestAnimationFrame(() => node.classList.add("is-in"));

    const live = [...fragsEl.children].filter((n) => !n.classList.contains("is-out"));
    while (live.length > KEEP) {
      const old = live.shift();
      old.classList.add("is-out");
      if (reduced()) old.remove();
      else setTimeout(() => old.remove(), 900);
    }
  }

  function setMark() {
    const hit = [...marks].reverse().find((m) => removed >= m.at);
    if (!hit || markEl.dataset.at === String(hit.at)) return;
    markEl.dataset.at = String(hit.at);
    markEl.classList.remove("is-in");
    setTimeout(() => {
      markEl.textContent = hit.text;
      markEl.classList.add("is-in");
    }, reduced() ? 0 : 420);
  }

  function build() {
    const geo = layout(wallEl, {
      rows: rowsFor(),
      target: Math.max(78, Math.min(124, wallEl.clientWidth / 7)),
      ratio: 0.44,
      gap: 3,
      minCols: 3
    });
    if (!geo) return;

    wallEl.textContent = "";
    fragsEl.textContent = "";
    markEl.textContent = "";
    markEl.classList.remove("is-in");
    delete markEl.dataset.at;
    removed = 0;
    shown = new Set();
    resetBtn.hidden = true;

    const W = wallEl.clientWidth;
    const whole = [];
    geo.cells.forEach((c, i) => {
      if (c.left >= -0.5 && c.left + c.w <= W + 0.5) whole.push(i);
    });

    const count = Math.min(words.length, whole.length);
    total = count;
    const chosen = spread(whole.length, count);
    const byCell = new Map(chosen.map((k, n) => [whole[k], n]));

    geo.cells.forEach((cell, i) => {
      if (!byCell.has(i)) {
        wallEl.append(place(brick(), cell));
        return;
      }

      const n = byCell.get(i);
      const word = words[n];
      const { holder, btn } = slot(cell, word, `ईंट हटाओ: ${word}`);
      holder.style.setProperty("--ox", `${rand(-9, 9).toFixed(0)}px`);
      holder.style.setProperty("--orot", `${rand(-9, 9).toFixed(1)}deg`);

      btn.addEventListener("click", () => {
        if (holder.classList.contains("is-gone")) return;
        holder.classList.add("is-gone");
        btn.tabIndex = -1;
        btn.setAttribute("aria-hidden", "true");
        removed += 1;
        shown.add(n);
        sound.thud(0.7);
        addFragment(fragments[n % fragments.length]);
        setCount();
        setMark();
        resetBtn.hidden = false;
      });

      wallEl.append(holder);
    });

    setCount();
  }

  resetBtn.addEventListener("click", () => {
    sound.thud(0.9);
    build();
    resetBtn.hidden = true;
  });

  build();
  window.addEventListener("resize", debounce(build, 280));
}
