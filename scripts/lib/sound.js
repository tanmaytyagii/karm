/* KARM ambience. Synthesised, so nothing is downloaded and nothing autoplays.
   Off by default; the context is only created on a real user gesture. */

import { rand } from "./motion.js";

const LEVEL = 0.15;

let ctx = null;
let master = null;
let timer = null;
let on = false;

function noiseBuffer(seconds = 6) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.02 * w) / 1.02;
    d[i] = last * 3.1;
  }
  return buf;
}

function build() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;

  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  /* --- wind through the lane --- */
  const wind = ctx.createBufferSource();
  wind.buffer = noiseBuffer(8);
  wind.loop = true;

  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 55;

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 400;
  lp.Q.value = 0.5;

  const windGain = ctx.createGain();
  windGain.gain.value = 0.62;

  wind.connect(hp).connect(lp).connect(windGain).connect(master);
  wind.start();

  /* slow swell, so it never sits still */
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.045;
  const lfoAmt = ctx.createGain();
  lfoAmt.gain.value = 170;
  lfo.connect(lfoAmt);
  lfoAmt.connect(lp.frequency);
  lfo.start();

  /* --- distant city floor --- */
  const drone = ctx.createOscillator();
  drone.type = "sine";
  drone.frequency.value = 47;
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.1;
  drone.connect(droneGain).connect(master);
  drone.start();

  return true;
}

/* one distant event: a hammer somewhere, a shutter, a dog two lanes over */
function event() {
  if (!ctx || !on) return;
  const t = ctx.currentTime;
  const kind = Math.random();

  if (kind < 0.55) {
    /* a knock, far away */
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(0.5);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = rand(180, 420);
    bp.Q.value = 2.2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(rand(0.05, 0.12), t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + rand(0.25, 0.6));
    src.connect(bp).connect(g).connect(master);
    src.start(t);
    src.stop(t + 1);
  } else {
    /* a low tone, like a distant temple bell through walls */
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = rand(88, 148);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.055, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t + rand(2.2, 4));
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 5);
  }

  schedule();
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(event, rand(5200, 14000));
}

/* brick landing / brick pulled out */
export function thud(strength = 1) {
  if (!ctx || !on) return;
  const t = ctx.currentTime;

  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(0.4);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = rand(150, 260);
  bp.Q.value = 1.4;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.2 * strength, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  src.connect(bp).connect(g).connect(master);
  src.start(t);
  src.stop(t + 0.5);

  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(rand(72, 96), t);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
  const og = ctx.createGain();
  og.gain.setValueAtTime(0, t);
  og.gain.linearRampToValueAtTime(0.16 * strength, t + 0.008);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
  o.connect(og).connect(master);
  o.start(t);
  o.stop(t + 0.4);
}

/* a soft grain of dust for UI moments */
export function tick() {
  if (!ctx || !on) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(0.2);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 900;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.05, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  src.connect(hp).connect(g).connect(master);
  src.start(t);
  src.stop(t + 0.2);
}

export async function toggle() {
  if (!ctx && !build()) return false;

  if (on) {
    on = false;
    clearTimeout(timer);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
  } else {
    on = true;
    if (ctx.state === "suspended") await ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(LEVEL, ctx.currentTime, 1.4);
    schedule();
  }
  return on;
}
