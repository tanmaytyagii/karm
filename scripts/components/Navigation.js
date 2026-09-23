/* Floating navigation. Steps aside while you read, returns when you look up. */

import { qs } from "../lib/dom.js";
import { onScrollDir, reduced } from "../lib/motion.js";
import * as sound from "../lib/sound.js";

export function initNavigation() {
  const nav = qs("#nav");
  const menu = qs("#navmenu");
  const burger = qs("#burger");
  const soundBtn = qs("#sound");
  const links = [...nav.querySelectorAll(".nav__links a")];

  /* ---------- hide / show ---------- */
  onScrollDir((dir, y) => {
    nav.classList.toggle("is-lifted", y > 40);
    if (menu.classList.contains("is-open")) return;
    nav.classList.toggle("is-hidden", dir === "down" && y > 220);
  });

  /* ---------- go dark for the final section ---------- */
  /* antim is several screens tall, so its own intersection ratio never gets
     high; watch a band across the middle of the viewport instead */
  const antim = qs("#antim");
  if (antim && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([e]) => nav.classList.toggle("is-gone", e.isIntersecting),
      { rootMargin: "-45% 0px -45% 0px" }
    ).observe(antim);
  }

  /* ---------- current section ---------- */
  const targets = links
    .map((a) => ({ a, sec: qs(a.getAttribute("href")) }))
    .filter((t) => t.sec);

  if ("IntersectionObserver" in window) {
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target, e.intersectionRatio);
        let best = null;
        let ratio = 0;
        for (const [sec, r] of seen) {
          if (r > ratio) { ratio = r; best = sec; }
        }
        targets.forEach(({ a, sec }) =>
          a.classList.toggle("is-current", ratio > 0.08 && sec === best)
        );
      },
      { threshold: [0, 0.1, 0.3, 0.5, 0.75] }
    );
    targets.forEach(({ sec }) => io.observe(sec));
  }

  /* ---------- mobile menu ---------- */
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.textContent = open ? "बंद" : "मेन्यू";
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add("is-open"));
      nav.classList.remove("is-hidden");
    } else {
      menu.classList.remove("is-open");
      const hide = () => (menu.hidden = true);
      reduced() ? hide() : setTimeout(hide, 480);
    }
  };

  burger.addEventListener("click", () => {
    setMenu(burger.getAttribute("aria-expanded") !== "true");
    sound.tick();
  });

  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      burger.focus();
    }
  });

  /* ---------- sound ---------- */
  soundBtn.addEventListener("click", async () => {
    const on = await sound.toggle();
    soundBtn.setAttribute("aria-pressed", String(on));
    soundBtn.querySelector(".sound__label").textContent = on
      ? "आवाज़ चालू"
      : "आवाज़";
  });
}
