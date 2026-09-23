/* The sequence player. One action, one consequence, one return.
   Shared by MOHALLA and KAHANIYAN. */

import { qs, el } from "../lib/dom.js";
import { reduced } from "../lib/motion.js";
import * as sound from "../lib/sound.js";

let root, scene, eyebrowEl, titleEl, labelEl, textEl, ticksEl;
let prevBtn, nextBtn, closeBtn;
let seq = null;
let step = 0;
let lastFocus = null;
let swapTimer = null;

function outside() {
  return [...document.body.children].filter((n) => n !== root);
}

function render(animate = true) {
  const s = seq.scenes[step];
  const motion = animate && !reduced();

  const paint = () => {
    labelEl.textContent = s.label;
    textEl.textContent = s.text;
    root.dataset.beat = String(step);
    scene.classList.remove("is-swap");
    if (!motion) return;
    /* place the new beat on the far side without a transition, then let it arrive */
    scene.classList.add("is-enter");
    requestAnimationFrame(() => requestAnimationFrame(() => scene.classList.remove("is-enter")));
  };

  clearTimeout(swapTimer);
  if (motion) {
    scene.classList.add("is-swap");
    swapTimer = setTimeout(paint, 280);
  } else {
    paint();
  }

  [...ticksEl.children].forEach((t, i) => {
    t.classList.toggle("is-on", i === step);
    t.classList.toggle("is-past", i < step);
  });

  prevBtn.disabled = step === 0;
  const last = step === seq.scenes.length - 1;
  nextBtn.textContent = last ? "पूरा हुआ" : "आगे";
}

function go(dir) {
  const next = step + dir;
  if (next < 0) return;
  if (next >= seq.scenes.length) return close();
  step = next;
  scene.dataset.dir = dir > 0 ? "on" : "back";
  sound.tick();
  render();
}

export function open({ eyebrow, title, scenes }) {
  if (!root || !scenes || !scenes.length) return;

  seq = { scenes };
  step = 0;
  lastFocus = document.activeElement;

  eyebrowEl.textContent = eyebrow;
  titleEl.textContent = title;

  ticksEl.textContent = "";
  scenes.forEach(() => ticksEl.append(el("i")));

  root.hidden = false;
  outside().forEach((n) => (n.inert = true));
  document.documentElement.style.overflow = "hidden";

  render(false);
  requestAnimationFrame(() => {
    root.classList.add("is-open");
    closeBtn.focus();
  });
  sound.tick();
}

export function close() {
  if (!root || root.hidden) return;

  root.classList.remove("is-open");
  outside().forEach((n) => (n.inert = false));
  document.documentElement.style.overflow = "";

  const done = () => {
    root.hidden = true;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  };
  reduced() ? done() : setTimeout(done, 520);
}

export function initOverlay() {
  root = qs("#overlay");
  if (!root) return;

  scene = qs("#ovScene");
  eyebrowEl = qs("#ovEyebrow");
  titleEl = qs("#ovTitle");
  labelEl = qs("#ovLabel");
  textEl = qs("#ovText");
  ticksEl = qs("#ovTicks");
  prevBtn = qs("#ovPrev");
  nextBtn = qs("#ovNext");
  closeBtn = qs("#ovClose");

  closeBtn.addEventListener("click", close);
  qs(".overlay__scrim", root).addEventListener("click", close);
  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));

  document.addEventListener("keydown", (e) => {
    if (root.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  });

  /* keep tab focus inside the panel */
  root.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = [...root.querySelectorAll("button:not([disabled])")];
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}
