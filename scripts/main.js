/* KARM — Karm ek din laut ke aata hai. */

import { watchReveals } from "./lib/motion.js";
import { initNavigation } from "./components/Navigation.js";
import { initAtmosphere } from "./components/Atmosphere.js";
import { initOverlay } from "./components/StoryOverlay.js";
import { initHero } from "./components/Hero.js";
import { initMohalla } from "./components/Mohalla.js";
import { initHisaab } from "./components/Hisaab.js";
import { initTwin } from "./components/TwoMohallas.js";
import { initKahaniyan } from "./components/Kahaniyan.js";
import { initMirror } from "./components/Mirror.js";
import { initDeewar } from "./components/Deewar.js";
import { initFinalReturn } from "./components/FinalReturn.js";

const boot = [
  initOverlay,
  initNavigation,
  initAtmosphere,
  initHero,
  initMohalla,
  initHisaab,
  initTwin,
  initKahaniyan,
  initMirror,
  initDeewar,
  initFinalReturn
];

for (const step of boot) {
  try {
    step();
  } catch (err) {
    /* one broken section must not take the rest of the lane with it */
    console.error(`[karm] ${step.name}`, err);
  }
}

watchReveals();

/* walls are measured, so relay them once the serif has actually loaded */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => window.dispatchEvent(new Event("resize")));
}
