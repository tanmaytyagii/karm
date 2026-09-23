/* Tiny DOM helpers. */

export function el(tag, props = {}, kids = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === "class") n.className = v;
    else if (k === "text") n.textContent = v;
    else if (k === "style") Object.assign(n.style, v);
    else if (k === "vars") for (const [p, val] of Object.entries(v)) n.style.setProperty(p, val);
    else if (k.startsWith("on")) n.addEventListener(k.slice(2).toLowerCase(), v);
    else n.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of [].concat(kids)) if (kid) n.append(kid);
  return n;
}

export const qs = (sel, root = document) => root.querySelector(sel);

export const pad = (n, w = 2) => String(n).padStart(w, "0");
