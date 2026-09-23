/* KARM ambience. Synthesised, so nothing is downloaded and nothing autoplays.
   Off by default; the context is only created on a real user gesture. */

import { rand } from "./motion.js";

const LEVEL = 0.15;
/* some rooms ask for quiet: the mirror, and the end */
const ROOMS = { aaina: 0.55, antim: 0.25 };

let ctx = null;
let master = null;
let grit = null;
let hiss = null;
let timer = null;
let on = false;
let room = "";

const level = () => LEVEL * (ROOMS[room] ?? 1);

/* brown-ish noise: a leaky integral of white, all weight and no hiss */
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

function whiteBuffer(seconds) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/* Short sounds share one bed of noise, each starting somewhere else in it,
   instead of building a fresh buffer every time. */
function burst(t, dur, buf = grit) {
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.start(t, rand(0, Math.max(0, buf.duration - dur - 0.05)));
  src.stop(t + dur);
  return src;
}

function build() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;

  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  grit = noiseBuffer(2.5);
  hiss = whiteBuffer(2.5);

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

/* a knock, far away */
function knock(t) {
  const src = burst(t, 0.7);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = rand(180, 420);
  bp.Q.value = 2.2;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(rand(0.05, 0.12), t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + rand(0.25, 0.6));
  src.connect(bp).connect(g).connect(master);
}

/* a low tone, like a distant temple bell through walls */
function bell(t) {
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

/* a shutter rolled down two lanes over: slats rattling, then it lands */
function shutter(t) {
  const dur = rand(1.1, 1.7);
  const src = burst(t, dur, hiss);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(rand(640, 820), t);
  bp.frequency.linearRampToValueAtTime(rand(420, 520), t + dur);
  bp.Q.value = 2.6;
  /* the rattle: a square wave chopping the level ~20 times a second */
  const slats = ctx.createGain();
  slats.gain.value = 0.5;
  const chop = ctx.createOscillator();
  chop.type = "square";
  chop.frequency.value = rand(15, 22);
  const depth = ctx.createGain();
  depth.gain.value = 0.5;
  chop.connect(depth).connect(slats.gain);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.03, t + 0.1);
  g.gain.setValueAtTime(0.03, t + dur - 0.3);
  g.gain.linearRampToValueAtTime(0, t + dur);
  src.connect(bp).connect(slats).connect(g).connect(master);
  chop.start(t);
  chop.stop(t + dur);
  knock(t + dur - 0.04);
}

function event() {
  if (!ctx || !on) return;
  /* the last room keeps its silence */
  if (room !== "antim") {
    const t = ctx.currentTime;
    const kind = Math.random();
    if (kind < 0.45) knock(t);
    else if (kind < 0.8) bell(t);
    else shutter(t);
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

  const src = burst(t, 0.5);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = rand(150, 260);
  bp.Q.value = 1.4;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.2 * strength, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  src.connect(bp).connect(g).connect(master);

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

/* clay dragged against mortar: a brick drawn out of its course */
export function scrape(strength = 1) {
  if (!ctx || !on) return;
  const t = ctx.currentTime;
  const dur = rand(0.26, 0.34);
  const src = burst(t, dur, hiss);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(rand(1500, 1900), t);
  bp.frequency.exponentialRampToValueAtTime(rand(480, 620), t + dur);
  bp.Q.value = 1.1;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.045 * strength, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(master);
}

/* a soft grain of dust for UI moments */
export function tick() {
  if (!ctx || !on) return;
  const t = ctx.currentTime;
  const src = burst(t, 0.2);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 900;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.05, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  src.connect(hp).connect(g).connect(master);
}

/* the page tells the sound which room it is in */
export function setRoom(name = "") {
  room = name;
  if (!ctx || !on) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(level(), ctx.currentTime, 1.2);
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
    master.gain.setTargetAtTime(level(), ctx.currentTime, 1.4);
    schedule();
  }
  return on;
}
