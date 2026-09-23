/* 003 — DO MOHALLE. Two lanes, one kiln. */

import { qs } from "../lib/dom.js";
import { onScene } from "../lib/motion.js";
import { skyline } from "./Mohalla.js";
import { goldSkyline, ashSkyline } from "../../data/scene.js";

export function initTwin() {
  const twin = qs("#twin");
  if (!twin) return;

  skyline(qs("#twinCityA"), goldSkyline);
  skyline(qs("#twinCityB"), ashSkyline, { flicker: false });

  /* when the brick lands, the other lane's few lights go out, one by one */
  const lit = [...twin.querySelectorAll("#twinCityB .win--lit")];
  lit.forEach((w, i) => w.style.setProperty("--off", (0.64 + (i / lit.length) * 0.1).toFixed(3)));

  onScene(twin, (p) => twin.style.setProperty("--tp", p.toFixed(4)));
}
