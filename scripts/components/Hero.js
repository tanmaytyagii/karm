/* 000 — THE RETURN. One brick, then another, then a wall you fall through. */

import { qs, el } from "../lib/dom.js";
import { onScene, reduced, rand, debounce } from "../lib/motion.js";
import { layout, place, brick } from "../lib/wall.js";
import * as sound from "../lib/sound.js";

const ROWS = 6;
const MOTES = 14;

const target = () =>
  Math.max(46, Math.min(96, window.innerWidth * 0.068));

export function initHero() {
  const hero = qs("#hero");
  const wall = qs("#heroWall");
  const whisper = qs("#heroWhisper");
  const dustHost = qs("#heroDust");
  if (!hero || !wall) return;

  let played = false;
  let lastWidth = 0;
  let timers = [];

  function lay(animate) {
    const geo = layout(wall, {
      rows: ROWS,
      target: target(),
      ratio: 0.42,
      gap: 3,
      minCols: 6
    });
    if (!geo) return null;

    wall.textContent = "";
    lastWidth = window.innerWidth;
    hero.style.setProperty("--wall-h", `${geo.height}px`);

    geo.cells.forEach((cell, i) => {
      const b = place(brick(), cell);
      b.append(el("span", { class: "dust" }));

      if (animate) {
        /* the first three land alone, so you hear each one */
        const delay = i < 3 ? 700 + i * 1150 : 4150 + (i - 3) * 34 + rand(-14, 14);
        const dur = i < 3 ? 1050 : 800;
        b.style.setProperty("--delay", `${Math.round(delay)}ms`);
        b.style.setProperty("--dur", `${dur}ms`);
        b.style.setProperty("--rot", `${rand(-4, 4).toFixed(1)}deg`);
        b.classList.add("is-falling");
        if (i < 3) {
          timers.push(
            setTimeout(() => sound.thud(i === 0 ? 1 : 0.78), delay + dur * 0.66)
          );
        }
      } else {
        b.classList.add("is-set");
      }

      wall.append(b);
    });

    return geo;
  }

  /* ---------- the two lines the wall brings with it ---------- */
  function whispers() {
    if (!whisper) return;
    const [one, two] = whisper.children;

    if (reduced()) {
      whisper.classList.add("is-static");
      return;
    }

    timers.push(setTimeout(() => one.classList.add("is-on"), 4400));
    timers.push(setTimeout(() => {
      one.classList.remove("is-on");
      one.classList.add("is-off");
    }, 7600));
    timers.push(setTimeout(() => two.classList.add("is-on"), 8050));
  }

  /* ---------- dust in the lamp light ---------- */
  function motes() {
    if (!dustHost || reduced()) return;
    for (let i = 0; i < MOTES; i++) {
      dustHost.append(
        el("i", {
          style: {
            left: `${rand(6, 94).toFixed(1)}%`,
            bottom: `${rand(-4, 26).toFixed(1)}%`
          },
          vars: {
            "--t": `${rand(18, 34).toFixed(1)}s`,
            "--md": `${rand(0, 22).toFixed(1)}s`,
            "--dx": `${rand(-40, 40).toFixed(0)}px`
          }
        })
      );
    }
  }

  function start() {
    if (played) return;
    if (!wall.clientWidth) {
      requestAnimationFrame(start);
      return;
    }
    played = true;
    const animate = !reduced();
    lay(animate);
    whispers();
    motes();
  }

  start();

  /* a width change relays the wall in its finished state */
  window.addEventListener(
    "resize",
    debounce(() => {
      if (Math.abs(window.innerWidth - lastWidth) < 44) return;
      timers.forEach(clearTimeout);
      timers = [];
      lay(false);
      if (whisper && !reduced()) {
        whisper.children[1].classList.add("is-on");
        whisper.children[0].classList.remove("is-on");
      }
    }, 240)
  );

  /* ---------- the camera ---------- */
  onScene(hero, (p) => hero.style.setProperty("--p", p.toFixed(4)));
}
