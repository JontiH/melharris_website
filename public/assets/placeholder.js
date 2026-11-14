// Cartoon house drawn in place of a missing photo. `scene` picks the sky so a gallery of stand-ins isn't identical.
const SCENES = [
  { sky: "#cfe4f0", sun: "#ffe9a8", ground: "#a9cc8f" },
  { sky: "#f6dcc4", sun: "#ffd27a", ground: "#b5c98a" },
  { sky: "#e6d9ec", sun: "#fff1c9", ground: "#9fc497" },
  { sky: "#2f3e5c", sun: "#f4f1de", ground: "#5d7a5a", night: true },
];

function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * (1 + amount)))));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

// `shift` widens the canvas on the left and crops it just right of the house, which then sits at the right edge
// on wide screens (room for overlaid text) and stays whole on phones.
export function houseSvg(color = "#c9b8a3", scene = 0, shift = 0) {
  const s = SCENES[scene % SCENES.length];
  const roof = shade(color, -0.35);
  const glass = s.night ? "#ffd86b" : "#fdf8e4";
  const line = "#2a2622";
  return `<svg viewBox="${-shift} 0 ${(shift ? 420 : 600) + shift} 400" preserveAspectRatio="${shift ? "xMaxYMax" : "xMidYMid"} slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="${-shift}" width="${600 + shift}" height="400" fill="${s.sky}"/>
  <circle cx="${470 - scene * 40}" cy="${80 + (scene % 2) * 20}" r="30" fill="${s.sun}"/>
  ${s.night ? "" : `<g fill="#fff" opacity="0.9"><ellipse cx="140" cy="90" rx="44" ry="16"/><ellipse cx="170" cy="78" rx="30" ry="16"/><ellipse cx="380" cy="60" rx="34" ry="12"/></g>`}
  <rect x="${-shift}" y="318" width="${600 + shift}" height="82" fill="${s.ground}"/>
  <path d="M286 330 L314 330 L340 400 L260 400 Z" fill="#e8dcc6"/>
  <g stroke="${line}" stroke-width="4" stroke-linejoin="round">
    <rect x="352" y="132" width="24" height="50" fill="${roof}"/>
    <rect x="215" y="200" width="170" height="130" rx="4" fill="${color}"/>
    <path d="M195 208 L300 125 L405 208 Z" fill="${roof}"/>
    <rect x="282" y="262" width="36" height="68" rx="16" fill="${roof}"/>
    <rect x="234" y="226" width="36" height="34" rx="3" fill="${glass}"/>
    <rect x="330" y="226" width="36" height="34" rx="3" fill="${glass}"/>
    <path d="M252 226 V260 M234 243 H270 M348 226 V260 M330 243 H366" fill="none" stroke-width="3"/>
    <circle cx="300" cy="172" r="13" fill="${glass}"/>
    <rect x="114" y="262" width="14" height="60" fill="#8a6a52"/>
    <circle cx="121" cy="240" r="40" fill="${shade(s.ground, -0.2)}"/>
    <circle cx="486" cy="296" r="24" fill="${shade(s.ground, -0.12)}"/>
  </g>
  <circle cx="310" cy="298" r="3" fill="${line}"/>
</svg>`;
}
