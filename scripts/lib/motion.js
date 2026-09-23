/* Scroll progress, reveals, and a single shared rAF loop. */

const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
export const reduced = () => mq.matches;

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const rand = (a, b) => a + Math.random() * (b - a);

/* ---------- scroll-linked scenes ---------- */
const scenes = [];
let queued = false;

function tick() {
  queued = false;
  const vh = window.innerHeight;
  /* measure every scene before writing any, so a write never forces a second layout */
  const due = [];
  for (const s of scenes) {
    const r = s.el.getBoundingClientRect();
    if (r.bottom < -vh * 0.4 || r.top > vh * 1.4) continue;
    const span = r.height - vh;
    const p = span > 8
      ? clamp(-r.top / span)
      : clamp((vh * 0.8 - r.top) / (vh * 0.8));
    if (Math.abs(p - s.last) > 0.0004) due.push([s, p]);
  }
  for (const [s, p] of due) {
    s.last = p;
    s.cb(p);
  }
}

function request() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(tick);
  }
}

export function onScene(el, cb) {
  scenes.push({ el, cb, last: -1 });
  request();
}

window.addEventListener("scroll", request, { passive: true });
window.addEventListener("resize", request);
window.addEventListener("load", request);

/* ---------- reveal on entry ---------- */
export function watchReveals(root = document) {
  const items = [...root.querySelectorAll(".reveal")];
  const show = (n) => n.classList.add("is-in");

  if (!("IntersectionObserver" in window)) {
    items.forEach(show);
    return;
  }

  /* anything already on screen is shown now, not on a callback */
  const pending = items.filter((n) => {
    const r = n.getBoundingClientRect();
    if (r.top < window.innerHeight * 1.05) {
      show(n);
      return false;
    }
    return true;
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        show(e.target);
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
  );
  pending.forEach((n) => io.observe(n));

  /* last resort: no section stays invisible because an observer never fired */
  setTimeout(() => {
    if (!document.querySelector(".reveal:not(.is-in)")) return;
    document.querySelectorAll(".reveal:not(.is-in)").forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.4) show(n);
    });
  }, 2600);
}

/* ---------- scroll direction ---------- */
export function onScrollDir(cb) {
  let last = window.scrollY;
  let dir = "up";
  let raf = false;
  const run = () => {
    raf = false;
    const y = window.scrollY;
    const dy = y - last;
    if (Math.abs(dy) > 4) {
      dir = dy > 0 ? "down" : "up";
      last = y;
    }
    cb(dir, y);
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!raf) {
        raf = true;
        requestAnimationFrame(run);
      }
    },
    { passive: true }
  );
  run();
}

/* ---------- misc ---------- */
export function debounce(fn, ms = 200) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}
