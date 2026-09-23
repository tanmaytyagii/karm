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

  onScene(twin, (p) => twin.style.setProperty("--tp", p.toFixed(4)));
}
