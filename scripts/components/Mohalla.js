/* 001 — MOHALLA. A lane at three in the morning. Six places, six accounts. */

import { qs, el, pad } from "../lib/dom.js";
import { onScene, rand } from "../lib/motion.js";
import { tone } from "../lib/wall.js";
import { places } from "../../data/places.js";
import { farSkyline, midSkyline } from "../../data/scene.js";
import { open as openStory } from "./StoryOverlay.js";
import * as sound from "../lib/sound.js";

/* Build one row of buildings into a host. Shared with DO MOHALLE. */
export function skyline(host, list, { far = false, flicker = true } = {}) {
  if (!host) return;
  host.textContent = "";

  list.forEach((b) => {
    const node = el("div", {
      class: `bldg${far ? " bldg--far" : ""}`,
      vars: { "--x": String(b.x), "--w": String(b.w), "--h": String(b.h), ...tone() }
    });

    if (b.wins) {
      const wins = el("div", { class: "bldg__wins", vars: { "--cols": String(b.cols || 3) } });
      const lit = new Set(b.lit || []);
      for (let i = 0; i < b.wins; i++) {
        const cls = ["win"];
        if (lit.has(i)) {
          cls.push("win--lit");
          if (Math.random() < 0.34) cls.push("win--warm");
          if (Math.random() < 0.3) cls.push("win--shadow");
          if (flicker && Math.random() < 0.18) cls.push("win--flicker");
        }
        wins.append(el("span", { class: cls.join(" ") }));
      }
      node.append(wins);
    }

    (b.balc || []).forEach((bottom) =>
      node.append(el("span", { class: "bldg__balc", style: { bottom: `${bottom}%` } }))
    );

    if (b.door) {
      node.append(el("span", { class: `bldg__door${b.open ? " bldg__door--open" : ""}` }));
    }

    host.append(node);
  });
}

function enter(p, i) {
  sound.thud(0.5);
  openStory({
    eyebrow: `मोहल्ला / ${pad(i + 1, 3)}`,
    title: p.name,
    scenes: p.scenes
  });
}

export function initMohalla() {
  const scene = qs("#scene");
  if (!scene) return;

  skyline(qs("#sceneFar"), farSkyline, { far: true, flicker: false });
  skyline(qs("#sceneMid"), midSkyline);

  /* ---------- hotspots, for pointers and keyboards ---------- */
  const hotHost = qs("#hotspots");
  places.forEach((p, i) => {
    const btn = el(
      "button",
      {
        type: "button",
        class: `hot${p.flip ? " hot--flip" : ""}`,
        "aria-label": `${p.name} — इस जगह का हिसाब खोलो`,
        vars: {
          "--x": String(p.x),
          "--y": String(p.y),
          "--hd": `${rand(0, 3.4).toFixed(2)}s`
        }
      },
      [
        el("span", { class: "hot__glow" }),
        el("span", { class: "hot__ring" }),
        el("span", { class: "hot__label", text: p.name })
      ]
    );
    btn.addEventListener("click", () => enter(p, i));
    hotHost.append(btn);
  });

  /* ---------- the same six as a vertical index on small screens ---------- */
  const list = qs("#places");
  places.forEach((p, i) => {
    const btn = el("button", { type: "button", class: "place" }, [
      el("span", { class: "place__name", text: p.name }),
      el("span", { class: "place__code meta", lang: "en", text: pad(i + 1, 3) })
    ]);
    btn.addEventListener("click", () => enter(p, i));
    list.append(el("li", {}, btn));
  });

  /* ---------- breath ---------- */
  onScene(scene, (p) => scene.style.setProperty("--sp", (p * 2 - 1).toFixed(3)));
}
