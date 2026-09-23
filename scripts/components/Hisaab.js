/* 002 — EENT KA HISAAB. Ten bricks. Behind each, an account that closed itself. */

import { qs, el } from "../lib/dom.js";
import { layout, place, brick, slot, spread } from "../lib/wall.js";
import { debounce } from "../lib/motion.js";
import { actions } from "../../data/actions.js";
import * as sound from "../lib/sound.js";

const rows = () => (window.innerWidth < 900 ? 8 : 9);

export function initHisaab() {
  const wallEl = qs("#hisaabWall");
  const panel = qs("#hisaabPanel");
  if (!wallEl || !panel) return;

  let openHolder = null;

  function hint() {
    panel.textContent = "";
    panel.append(
      el("p", {
        class: "hint",
        text: "एक ईंट चुनो। जो पीछे है, वही हिसाब है।"
      })
    );
  }

  function show(a) {
    panel.textContent = "";

    const rowsOut = [
      { label: "ईंट", text: a.word, big: true },
      { label: "कर्म", text: a.action },
      { label: "नतीजा", text: a.consequence },
      { label: "वापसी", text: a.ret, ret: true }
    ].map((r, i) =>
      el(
        "div",
        {
          class: `trio__step${r.big ? " trio__head" : ""}${r.ret ? " trio__step--return" : ""}`,
          vars: { "--d": String(i * 240) }
        },
        [
          el("p", { class: "meta", text: r.label }),
          el("p", { class: r.big ? "trio__word" : "trio__text", text: r.text })
        ]
      )
    );

    panel.append(el("div", { class: "trio" }, rowsOut));
    requestAnimationFrame(() => rowsOut.forEach((n) => n.classList.add("is-in")));
  }

  function close() {
    if (!openHolder) return;
    openHolder.classList.remove("is-open");
    openHolder.querySelector(".brick").setAttribute("aria-expanded", "false");
    openHolder = null;
    hint();
  }

  function build() {
    const geo = layout(wallEl, {
      rows: rows(),
      target: Math.max(92, Math.min(140, wallEl.clientWidth / 6)),
      ratio: 0.44,
      gap: 3,
      minCols: 3
    });
    if (!geo) return;

    wallEl.textContent = "";
    openHolder = null;

    /* a word never lands on a course-end brick that the wall clips */
    const W = wallEl.clientWidth;
    const whole = [];
    geo.cells.forEach((c, i) => {
      if (c.left >= -0.5 && c.left + c.w <= W + 0.5) whole.push(i);
    });

    const chosen = spread(whole.length, Math.min(actions.length, whole.length));
    const byCell = new Map(chosen.map((k, n) => [whole[k], actions[n]]));

    geo.cells.forEach((cell, i) => {
      const a = byCell.get(i);
      if (!a) {
        wallEl.append(place(brick(), cell));
        return;
      }

      const { holder, btn } = slot(cell, a.word, `ईंट: ${a.word}`);
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", () => {
        if (openHolder === holder) return close();
        if (openHolder) {
          openHolder.classList.remove("is-open");
          openHolder.querySelector(".brick").setAttribute("aria-expanded", "false");
        }
        holder.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        openHolder = holder;
        sound.thud(0.55);
        show(a);
      });
      wallEl.append(holder);
    });

    hint();
  }

  build();
  window.addEventListener("resize", debounce(build, 260));
  wallEl.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && openHolder) {
      const btn = openHolder.querySelector(".brick");
      close();
      btn.focus();
    }
  });
}
