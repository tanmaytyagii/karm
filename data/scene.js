/* Skylines. x / w / h are percentages of their container.
   roof: what stands on top — a water tank, an antenna, rebar for the next floor. */

export const farSkyline = [
  { x: -3, w: 15, h: 42 }, { x: 10, w: 11, h: 52 }, { x: 19, w: 13, h: 37 },
  { x: 30, w: 10, h: 58, roof: "tank" }, { x: 39, w: 15, h: 45 }, { x: 52, w: 12, h: 63, roof: "antenna" },
  { x: 63, w: 14, h: 49 }, { x: 76, w: 11, h: 57 }, { x: 85, w: 18, h: 41 }
];

export const midSkyline = [
  { x: -5, w: 19, h: 61, cols: 3, wins: 10, lit: [1, 5, 6], balc: [46], door: true, roof: "tank" },
  { x: 13, w: 14, h: 51, cols: 2, wins: 8,  lit: [0, 3, 5], balc: [54] },
  { x: 26, w: 16, h: 71, cols: 3, wins: 14, lit: [2, 4, 7, 11], balc: [40, 63], door: true, open: true, roof: "tank" },
  { x: 41, w: 9,  h: 43, cols: 2, wins: 6,  lit: [1, 4] },
  { x: 58, w: 13, h: 57, cols: 2, wins: 8,  lit: [0, 2, 5], balc: [48], roof: "antenna" },
  { x: 70, w: 15, h: 67, cols: 3, wins: 14, lit: [1, 3, 8, 12], balc: [38, 59], door: true, roof: "tank" },
  { x: 84, w: 21, h: 53, cols: 3, wins: 11, lit: [0, 4, 9] }
];

export const goldSkyline = [
  { x: -7, w: 23, h: 53, cols: 3, wins: 11, lit: [0, 1, 2, 4, 5, 7, 8] },
  { x: 14, w: 18, h: 71, cols: 3, wins: 14, lit: [0, 2, 3, 5, 6, 9, 11, 13], roof: "tank" },
  { x: 33, w: 20, h: 59, cols: 3, wins: 11, lit: [1, 2, 4, 6, 7, 10] },
  { x: 54, w: 24, h: 81, cols: 4, wins: 19, lit: [0, 1, 3, 5, 6, 8, 9, 12, 15, 17], roof: "rebar" },
  { x: 77, w: 27, h: 63, cols: 4, wins: 15, lit: [0, 2, 3, 5, 8, 11, 13] }
];

export const ashSkyline = [
  { x: -9, w: 25, h: 43, cols: 3, wins: 8,  lit: [4] },
  { x: 12, w: 20, h: 56, cols: 3, wins: 11, lit: [2, 7], roof: "antenna" },
  { x: 30, w: 22, h: 39, cols: 3, wins: 8,  lit: [] },
  { x: 50, w: 26, h: 51, cols: 4, wins: 15, lit: [5], roof: "tank" },
  { x: 74, w: 29, h: 35, cols: 4, wins: 7,  lit: [3] }
];
