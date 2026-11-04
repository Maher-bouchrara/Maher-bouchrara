// Usage: node tools/build-projects.js
// Builds one animated card per project in tools/projects.json into
// assets/projects/<id>.svg, in the portfolio palette and Sora, and prints
// the README snippet that lays them out two per row.
const fs = require("fs");
const path = require("path");

const dir = __dirname;
const out = path.join(dir, "..", "assets", "projects");
const projects = JSON.parse(fs.readFileSync(path.join(dir, "projects.json"), "utf8"));
const font = (w) => fs.readFileSync(path.join(dir, "fonts", `sora-${w}.woff2`)).toString("base64");
const fonts = [300, 400, 600]
  .map((w) => `@font-face{font-family:'Sora';font-weight:${w};src:url(data:font/woff2;base64,${font(w)}) format('woff2')}`)
  .join("");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Greedy word wrap on an average glyph width (Sora is fairly regular).
function wrap(text, maxChars, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars) {
      lines.push(line.trim());
      line = w;
    } else line += " " + w;
  }
  if (line.trim()) lines.push(line.trim());
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].replace(/[\s,.;:]*\S*$/, "") + "…";
  }
  return lines;
}

const W = 480, H = 216, PAD = 24;

function card(p, i) {
  const desc = wrap(p.description, 60, 3);
  // label row: date, then tags as pills
  let x = PAD, pills = "";
  const dateW = p.date.length * 9.9;
  const label = `<text class="date" x="${x}" y="40">${esc(p.date.toUpperCase())}</text>`;
  x += dateW + 14;
  for (const t of p.tags) {
    const w = t.length * 6.3 + 18;
    pills += `<rect x="${x}" y="27" width="${w}" height="19" rx="9.5" class="tag"/><text class="tagt" x="${x + w / 2}" y="40.5" text-anchor="middle">${esc(t)}</text>`;
    x += w + 8;
  }
  // tech chips along the bottom
  let cx = PAD, chips = "";
  for (const t of p.tech) {
    const w = t.length * 6.4 + 20;
    if (cx + w > W - PAD) break;
    chips += `<rect x="${cx}" y="${H - 44}" width="${w}" height="22" rx="6" class="chip"/><text class="chipt" x="${cx + w / 2}" y="${H - 29}" text-anchor="middle">${esc(t)}</text>`;
    cx += w + 7;
  }
  const delay = (i * 0.55).toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(p.title)}">
<defs>
  <style>${fonts}
    .date{font:600 11.5px 'Sora',sans-serif;letter-spacing:2.4px;fill:#c9922f}
    .tag{fill:#171a20;stroke:#2a2f38}
    .tagt{font:400 10.5px 'Sora',sans-serif;fill:#bdb4a4}
    .title{font:600 19px 'Sora',sans-serif;fill:#f4f1ea}
    .desc{font:300 13px 'Sora',sans-serif;fill:#bdb4a4}
    .chip{fill:#111318;stroke:#2a2f38}
    .chipt{font:400 11px 'Sora',sans-serif;fill:#fbe3a6}
    .run{animation:run 6s cubic-bezier(.65,0,.35,1) infinite;animation-delay:${delay}s}
    @keyframes run{0%{transform:translateX(-200px)}55%,100%{transform:translateX(${W + 40}px)}}
    .dot{animation:pulse 2.4s ease-in-out infinite;animation-delay:${delay}s}
    @keyframes pulse{0%,100%{opacity:.35}50%{opacity:1}}
  </style>
  <linearGradient id="glow" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#f0c765" stop-opacity="0"/>
    <stop offset=".5" stop-color="#f0c765"/>
    <stop offset="1" stop-color="#f0c765" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="bloom" cx="100%" cy="0%" r="70%">
    <stop offset="0" stop-color="#f0c765" stop-opacity=".09"/>
    <stop offset="1" stop-color="#f0c765" stop-opacity="0"/>
  </radialGradient>
  <clipPath id="c"><rect width="${W}" height="${H}" rx="14"/></clipPath>
</defs>
<g clip-path="url(#c)">
  <rect width="${W}" height="${H}" fill="#0b0c10"/>
  <rect width="${W}" height="${H}" fill="url(#bloom)"/>
  <rect class="run" x="0" y="0" width="200" height="2" fill="url(#glow)"/>
  <circle class="dot" cx="${W - PAD - 2}" cy="36" r="3" fill="#f0c765"/>
  ${label}${pills}
  <text class="title" x="${PAD}" y="74">${esc(p.title)}</text>
  ${desc.map((l, k) => `<text class="desc" x="${PAD}" y="${102 + k * 19}">${esc(l)}</text>`).join("")}
  ${chips}
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="#2a2f38"/>
</svg>`;
}

fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) if (f.endsWith(".svg")) fs.unlinkSync(path.join(out, f));
projects.forEach((p, i) => fs.writeFileSync(path.join(out, `${p.id}.svg`), card(p, i)));

const snippet = projects
  .map((p) => `  <a href="${p.link}"><img src="assets/projects/${p.id}.svg" width="49%" alt="${esc(p.title)}"></a>`)
  .join("\n");
console.log(`<p align="center">\n${snippet}\n</p>`);
