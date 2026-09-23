/* Rooms. Some movements change the whole page around them: the mirror asks
   for quiet, and the end takes everything else away. */

import * as sound from "../lib/sound.js";

export function initAtmosphere() {
  const rooms = [...document.querySelectorAll("[data-room]")];
  if (!rooms.length || !("IntersectionObserver" in window)) return;

  const root = document.documentElement;
  const inside = new Set();

  /* a room is entered when it crosses the middle of the screen; the final
     section is several screens tall, so its own ratio would never tell us */
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inside.add(e.target);
        else inside.delete(e.target);
      }
      const room = inside.size ? [...inside].pop().dataset.room : "";
      if (room) root.dataset.room = room;
      else delete root.dataset.room;
      sound.setRoom(room);
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  rooms.forEach((r) => io.observe(r));
}
