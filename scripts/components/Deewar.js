/* 006 — DEEWAR. You built it. Taking it apart is also yours. */

import { qs, el, pad } from "../lib/dom.js";
import { layout, place, brick, slot, spread } from "../lib/wall.js";
import { debounce, rand, reduced } from "../lib/motion.js";
import { words, fragments, marks } from "../../data/fragments.js";
import * as sound from "../lib/sound.js";

const KEEP = 6; /* how many fragments stay on screen */
const COURSE = 120; /* ms between courses when the wall goes back up */
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
  let rebuilt = null;

  const setCount = () => {
    countEl.textContent = `ईंट हटाई ${pad(removed)} / ${pad(total)}`;
    wrap.style.setProperty("--lit", (Math.min(1, removed / Math.max(1, total)) * 0.92).toFixed(3));
    wrap.classList.toggle("is-clear", total > 0 && removed === total);
    resetBtn.classList.toggle("is-invite", total > 0 && removed === total);
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
    const hit = [...marks].reverse().find((m) => removed >= Math.min(m.at, total));
    if (!hit || markEl.dataset.at === String(hit.at)) return;
    markEl.dataset.at = String(hit.at);
    markEl.classList.remove("is-in");
    setTimeout(() => {
      markEl.textContent = hit.text;
      markEl.classList.add("is-in");
    }, reduced() ? 0 : 420);
  }

  /* the next brick still in the wall, so the keyboard never lands on nothing */
  function nextBrick(from) {
    const all = [...wallEl.querySelectorAll(".slot .brick")];
    const at = all.indexOf(from);
    const standing = (b) => !b.parentElement.classList.contains("is-gone");
    return all.slice(at + 1).find(standing) || all.slice(0, at).reverse().find(standing);
  }

  function build(rising = false) {
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
      /* going back up, course by course from the ground */
      const settle = `${Math.round(cell.row * COURSE + (cell.left / W) * 90 + rand(0, 40))}ms`;

      if (!byCell.has(i)) {
        const b = place(brick(), cell);
        b.style.setProperty("--rd", settle);
        wallEl.append(b);
        return;
      }

      const n = byCell.get(i);
      const word = words[n];
      const { holder, btn } = slot(cell, word, `ईंट हटाओ: ${word}`);
      btn.style.setProperty("--rd", settle);
      holder.style.setProperty("--ox", `${rand(-9, 9).toFixed(0)}px`);
      holder.style.setProperty("--orot", `${rand(-9, 9).toFixed(1)}deg`);

      btn.addEventListener("click", (e) => {
        if (holder.classList.contains("is-gone")) return;
        /* keyboard and assistive tech click with detail 0; a mouse never moves focus */
        const keyed = e.detail === 0;
        holder.classList.add("is-gone");
        btn.tabIndex = -1;
        btn.setAttribute("aria-hidden", "true");
        removed += 1;
        /* drawn out toward you, then it drops somewhere below */
        sound.scrape(0.8);
        setTimeout(() => sound.thud(0.4), reduced() ? 0 : 640);
        addFragment(fragments[n % fragments.length]);
        setCount();
        setMark();
        resetBtn.hidden = false;
        if (keyed) (nextBrick(btn) || resetBtn).focus();
      });

      wallEl.append(holder);
    });

    clearTimeout(rebuilt);
    wallEl.classList.toggle("is-rebuilding", rising && !reduced());
    if (rising && !reduced()) {
      rebuilt = setTimeout(() => wallEl.classList.remove("is-rebuilding"), geo.cells.at(-1).row * COURSE + 900);
      for (let c = 0; c < 4; c++) setTimeout(() => sound.thud(0.26), 320 + c * 260);
    }

    setCount();
  }

  resetBtn.addEventListener("click", (e) => {
    const keyed = e.detail === 0;
    build(true);
    if (keyed) qs(".slot .brick", wallEl)?.focus();
  });

  build();
  window.addEventListener("resize", debounce(() => build(), 280));
}
