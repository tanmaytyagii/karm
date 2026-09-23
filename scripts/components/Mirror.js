/* 005 — AAINA. Four questions. Nothing is scored, nothing is saved. */

import { qs, el, pad } from "../lib/dom.js";
import { reduced } from "../lib/motion.js";
import { questions, choices } from "../../data/questions.js";
import * as sound from "../lib/sound.js";

export function initMirror() {
  const mirror = qs("#mirror");
  const body = qs("#mirrorBody");
  if (!mirror || !body) return;

  let i = 0;
  let timers = [];

  function mount(nodes) {
    timers.forEach(clearTimeout);
    timers = [];
    body.textContent = "";
    const frag = [].concat(nodes);
    frag.forEach((n) => body.append(n));
    const steps = [...body.querySelectorAll(".fade-step:not(.is-held)")];
    requestAnimationFrame(() => steps.forEach((s) => s.classList.add("is-in")));
  }

  function question() {
    const q = questions[i];

    const btns = choices.map((c) => {
      const b = el("button", { type: "button", class: "choice", text: c.label });
      b.addEventListener("click", () => {
        sound.tick();
        echo(q.echo[c.key]);
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
        el("div", { class: "q__choices fade-step", vars: { "--d": "330" } }, btns)
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
      sound.tick();
      if (last) return closing();
      i += 1;
      question();
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
    const two = el("p", { class: "fade-step is-held", text: "तुम्हारा है।", vars: { "--d": "0" } });

    const again = el("button", {
      type: "button",
      class: "btn fade-step is-held",
      text: "फिर से",
      vars: { "--d": "0" }
    });
    again.addEventListener("click", () => {
      i = 0;
      question();
    });

    mount(el("div", { class: "aaina__close" }, [one, two, again]));

    /* the pause is the point */
    const beat = reduced() ? 0 : 1500;
    timers.push(setTimeout(() => two.classList.add("is-in"), beat + 40));
    timers.push(setTimeout(() => again.classList.add("is-in"), beat * 2 + 80));
  }

  /* ---------- the sheen follows you, barely ---------- */
  if (!reduced() && window.matchMedia("(hover: hover)").matches) {
    mirror.addEventListener(
      "pointermove",
      (e) => {
        const r = mirror.getBoundingClientRect();
        mirror.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        mirror.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      },
      { passive: true }
    );
  }

  question();
}
