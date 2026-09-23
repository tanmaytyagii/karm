/* 005 — AAINA. Four questions. Nothing is scored, nothing is saved. */

import { qs, el, pad } from "../lib/dom.js";
import { reduced } from "../lib/motion.js";
import { questions, choices } from "../../data/questions.js";
import * as sound from "../lib/sound.js";

const LEAVE = 700; /* the old words go before the new ones come */
const HUSH = 550; /* and for a moment nothing is said */

export function initMirror() {
  const mirror = qs("#mirror");
  const body = qs("#mirrorBody");
  if (!mirror || !body) return;

  let i = 0;
  let timers = [];
  let turning = false;

  const later = (fn, ms) => timers.push(setTimeout(fn, reduced() ? 0 : ms));

  function mount(nodes) {
    timers.forEach(clearTimeout);
    timers = [];
    /* the button you used is about to go; keep the keyboard in the mirror */
    const held = body.contains(document.activeElement);
    body.textContent = "";
    [].concat(nodes).forEach((n) => body.append(n));
    const steps = [...body.querySelectorAll(".fade-step:not(.is-held)")];
    requestAnimationFrame(() => steps.forEach((s) => s.classList.add("is-in")));
    if (held) body.focus({ preventScroll: true });
    turning = false;
  }

  /* let the current words leave, hold a breath, then show what comes next */
  function turn(next) {
    if (turning) return;
    turning = true;
    const current = body.firstElementChild;
    if (!current || reduced()) return next();
    current.classList.add("is-leaving");
    timers.push(setTimeout(next, LEAVE + HUSH));
  }

  function question() {
    const q = questions[i];

    const btns = choices.map((c) => {
      const b = el("button", { type: "button", class: "choice", text: c.label });
      b.addEventListener("click", () => {
        if (turning) return;
        sound.tick();
        turn(() => echo(q.echo[c.key]));
      });
      return b;
    });

    mount(
      el("div", { class: "q" }, [
        el("p", {
          class: "meta fade-step",
          text: `${pad(i + 1)} / ${pad(questions.length)}`,
          lang: "en",
          vars: { "--d": "0" }
        }),
        el("p", { class: "q__text fade-step", text: q.q, vars: { "--d": "160" } }),
        el("div", { class: "q__choices fade-step", vars: { "--d": "420" } }, btns)
      ])
    );
  }

  function echo(line) {
    const last = i === questions.length - 1;
    const next = el("button", {
      type: "button",
      class: "btn",
      text: last ? "हिसाब देखो" : "आगे"
    });

    next.addEventListener("click", () => {
      if (turning) return;
      sound.tick();
      turn(() => {
        if (last) return closing();
        i += 1;
        question();
      });
    });

    mount(
      el("div", { class: "q" }, [
        el("p", {
          class: "meta fade-step",
          text: `${pad(i + 1)} / ${pad(questions.length)}`,
          lang: "en",
          vars: { "--d": "0" }
        }),
        el("div", { class: "q__echo fade-step", vars: { "--d": "220" } }, [
          el("p", { text: line }),
          next
        ])
      ])
    );
  }

  function closing() {
    const one = el("p", { class: "fade-step", text: "हिसाब किसी और का नहीं।", vars: { "--d": "0" } });
    const two = el("p", { class: "aaina__yours fade-step is-held", text: "तुम्हारा है।", vars: { "--d": "0" } });

    const again = el("button", {
      type: "button",
      class: "btn btn--ghost fade-step is-held",
      text: "फिर से",
      vars: { "--d": "0" }
    });
    again.addEventListener("click", () => {
      turn(() => {
        i = 0;
        mirror.classList.remove("is-still");
        question();
      });
    });

    mount(el("div", { class: "aaina__close" }, [one, two, again]));

    /* the pause is the point: the answer arrives alone, into stillness,
       and the way back only much later */
    later(() => {
      one.classList.add("is-past");
      two.classList.add("is-in");
      mirror.classList.add("is-still");
    }, 2400);
    later(() => again.classList.add("is-in"), 6800);
  }

  /* ---------- the reflection follows you, a little behind, as light does ---------- */
  if (!reduced() && window.matchMedia("(hover: hover)").matches) {
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const step = () => {
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      mirror.style.setProperty("--gx", `${x.toFixed(1)}px`);
      mirror.style.setProperty("--gy", `${y.toFixed(1)}px`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(step) : 0;
    };
    mirror.addEventListener(
      "pointermove",
      (e) => {
        const r = mirror.getBoundingClientRect();
        tx = e.clientX - (r.left + r.width / 2);
        ty = e.clientY - (r.top + r.height / 2);
        if (!raf) raf = requestAnimationFrame(step);
      },
      { passive: true }
    );
  }

  question();
}
