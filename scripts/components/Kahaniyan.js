/* 004 — KAHANIYAN. An index, not a card grid. */

import { qs, el, pad } from "../lib/dom.js";
import { stories } from "../../data/stories.js";
import { open as openStory } from "./StoryOverlay.js";
import * as sound from "../lib/sound.js";

export function initKahaniyan() {
  const list = qs("#kahaniList");
  if (!list) return;

  stories.forEach((s, i) => {
    const btn = el("button", { type: "button", class: "kahani" }, [
      el("span", { class: "kahani__num meta", lang: "en", text: pad(i + 1, 3) }),
      el("span", { class: "kahani__title" }, [
        el("span", { class: "kahani__name", text: s.name }),
        el("span", { class: "kahani__en meta", lang: "en", text: s.en })
      ]),
      el("span", { class: "kahani__hint", text: s.hint })
    ]);

    btn.addEventListener("click", () => {
      /* stories you have watched keep a mark in the index */
      btn.classList.add("is-seen");
      sound.tick();
      openStory({
        eyebrow: `कहानी / ${pad(i + 1, 3)}`,
        title: s.name,
        scenes: s.scenes
      });
    });

    list.append(el("li", {}, btn));
  });

  /* an index reads top to bottom: arrows move through it, Home / End jump */
  list.addEventListener("keydown", (e) => {
    const items = [...list.querySelectorAll(".kahani")];
    const at = items.indexOf(document.activeElement);
    const to = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: items.length - 1 }[e.key];
    if (at < 0 || to == null) return;
    e.preventDefault();
    items[Math.max(0, Math.min(items.length - 1, to))].focus();
  });
}
