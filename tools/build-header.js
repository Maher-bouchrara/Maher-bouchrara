// Usage: node tools/build-header.js
// Builds assets/header.svg and assets/footer.svg for the profile README,
// using the portfolio palette (ink / bone / amber / cyan) and Sora.
const fs = require("fs");
const path = require("path");
const dir = __dirname;
const out = process.argv[2] || path.join(dir, "..", "assets");

const f300 = fs.readFileSync(path.join(dir, "fonts", "sora-300.woff2")).toString("base64");
const f600 = fs.readFileSync(path.join(dir, "fonts", "sora-600.woff2")).toString("base64");

const fonts = `
@font-face{font-family:'Sora';font-weight:300;src:url(data:font/woff2;base64,${f300}) format('woff2')}
@font-face{font-family:'Sora';font-weight:600;src:url(data:font/woff2;base64,${f600}) format('woff2')}`;

// deterministic pseudo-random so the file is stable between builds
let seed = 7;
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

function particles(n, w, h) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = (rnd() * w).toFixed(1), y = (rnd() * h * 0.92).toFixed(1);
    const r = (0.6 + rnd() * 1.6).toFixed(2);
    const c = rnd() < 0.8 ? "#f0c765" : "#6fd0e2";
    const d = (2.5 + rnd() * 4).toFixed(2), dl = (rnd() * 5).toFixed(2);
    s += `<circle class="p" cx="${x}" cy="${y}" r="${r}" fill="${c}" style="animation-duration:${d}s;animation-delay:-${dl}s"/>`;
  }
  return s;
}

function grid(w, h, vy) {
  // perspective rays from a vanishing point, like the portfolio's corridor
  const cx = w / 2;
  let rays = "";
  for (let i = -14; i <= 14; i++) {
    const x2 = cx + i * (w / 14);
    rays += `<line x1="${cx}" y1="${vy}" x2="${x2.toFixed(1)}" y2="${h}"/>`;
  }
  // horizontal lines that travel toward the viewer (looped)
  let rows = "";
  for (let i = 0; i < 7; i++) {
    rows += `<line class="row" x1="0" y1="${vy}" x2="${w}" y2="${vy}" style="animation-delay:-${(i * 6 / 7).toFixed(2)}s"/>`;
  }
  return `<g class="grid">${rays}</g><g class="rows">${rows}</g>`;
}

const W = 1280, H = 340, VY = 256;

const header = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Maher Bouchrara — Software Engineer, AI and ML, LLMs and Agents">
<defs>
  <style>${fonts}
    .eyebrow{font:300 15px 'Sora',sans-serif;letter-spacing:7px;fill:#9c9282}
    .name{font:600 66px 'Sora',sans-serif;letter-spacing:12px}
    .role{font:300 19px 'Sora',sans-serif;letter-spacing:5px;fill:#f0c765}
    .in{animation:rise 1.4s cubic-bezier(.16,1,.3,1) both}
    .d1{animation-delay:.15s}.d2{animation-delay:.45s}.d3{animation-delay:.8s}
    @keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    .p{animation:tw ease-in-out infinite}
    @keyframes tw{0%,100%{opacity:.08}50%{opacity:.85}}
    .grid line{stroke:#f0c765;stroke-opacity:.07;stroke-width:1}
    .rows line{stroke:#f0c765;stroke-opacity:0;stroke-width:1;animation:fly 6s linear infinite}
    @keyframes fly{
      0%{transform:translateY(0);stroke-opacity:0}
      15%{stroke-opacity:.10}
      100%{transform:translateY(${H - VY}px);stroke-opacity:.22}}
    .bloom{animation:drift 14s ease-in-out infinite alternate}
    @keyframes drift{from{transform:translate(-90px,8px) scale(1)}to{transform:translate(110px,-10px) scale(1.12)}}
    .cool{animation:drift2 18s ease-in-out infinite alternate}
    @keyframes drift2{from{transform:translate(60px,0)}to{transform:translate(-80px,12px)}}
    .sweep{animation:sweep 7s ease-in-out infinite}
    @keyframes sweep{0%{transform:translateX(-900px)}60%,100%{transform:translateX(900px)}}
    .scan{animation:scan 5s ease-in-out infinite alternate}
    @keyframes scan{from{opacity:.25}to{opacity:.9}}
  </style>
  <radialGradient id="amber" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#f0c765" stop-opacity=".30"/>
    <stop offset=".45" stop-color="#c9922f" stop-opacity=".10"/>
    <stop offset="1" stop-color="#c9922f" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="cyan" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#6fd0e2" stop-opacity=".16"/>
    <stop offset="1" stop-color="#2b6b78" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0b0c10" stop-opacity="0"/>
    <stop offset="1" stop-color="#0b0c10" stop-opacity=".9"/>
  </linearGradient>
  <linearGradient id="nameFill" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#f4f1ea"/>
    <stop offset=".5" stop-color="#fbe3a6"/>
    <stop offset="1" stop-color="#f4f1ea"/>
  </linearGradient>
  <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".5" stop-color="#fff" stop-opacity=".55"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#f0c765" stop-opacity="0"/>
    <stop offset=".5" stop-color="#f0c765"/>
    <stop offset="1" stop-color="#f0c765" stop-opacity="0"/>
  </linearGradient>
  <clipPath id="clip"><rect width="${W}" height="${H}" rx="18"/></clipPath>
  <mask id="nameMask"><text x="${W / 2}" y="160" text-anchor="middle" class="name" fill="#fff">MAHER BOUCHRARA</text></mask>
</defs>
<g clip-path="url(#clip)">
  <rect width="${W}" height="${H}" fill="#0b0c10"/>
  <ellipse class="bloom" cx="${W / 2}" cy="150" rx="520" ry="230" fill="url(#amber)"/>
  <ellipse class="cool" cx="${W * 0.82}" cy="70" rx="300" ry="160" fill="url(#cyan)"/>
  ${grid(W, H, VY)}
  <rect y="${VY - 40}" width="${W}" height="${H - VY + 40}" fill="url(#fade)" opacity=".55"/>
  ${particles(46, W, H)}
  <text class="eyebrow in d1" x="${W / 2}" y="92" text-anchor="middle">TUNISIA · ISI ARIANA</text>
  <g class="in d2">
    <text x="${W / 2}" y="160" text-anchor="middle" class="name" fill="url(#nameFill)">MAHER BOUCHRARA</text>
    <g mask="url(#nameMask)"><rect class="sweep" x="${W / 2 - 160}" y="100" width="320" height="80" fill="url(#shine)"/></g>
  </g>
  <text class="role in d3" x="${W / 2}" y="210" text-anchor="middle">SOFTWARE ENGINEER · AI &amp; ML · LLMs &amp; AGENTS</text>
  <rect class="scan in d3" x="${W / 2 - 260}" y="236" width="520" height="1.5" fill="url(#line)"/>
  <rect width="${W}" height="${H}" rx="18" fill="none" stroke="#2a2f38"/>
</g>
</svg>`;

const FW = 1280, FH = 150;
const footer = `<svg xmlns="http://www.w3.org/2000/svg" width="${FW}" height="${FH}" viewBox="0 0 ${FW} ${FH}" role="img" aria-label="Thanks for visiting">
<defs>
  <style>${fonts}
    .t{font:300 14px 'Sora',sans-serif;letter-spacing:8px;fill:#9c9282}
    .u{font:600 16px 'Sora',sans-serif;letter-spacing:3px;fill:#f0c765}
    .p{animation:tw ease-in-out infinite}
    @keyframes tw{0%,100%{opacity:.08}50%{opacity:.8}}
    .bloom{animation:drift 12s ease-in-out infinite alternate}
    @keyframes drift{from{transform:translateX(-120px)}to{transform:translateX(120px)}}
    .scan{animation:scan 4s ease-in-out infinite alternate}
    @keyframes scan{from{opacity:.3}to{opacity:1}}
  </style>
  <radialGradient id="a" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#f0c765" stop-opacity=".22"/>
    <stop offset="1" stop-color="#c9922f" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="l" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#f0c765" stop-opacity="0"/>
    <stop offset=".5" stop-color="#f0c765"/>
    <stop offset="1" stop-color="#f0c765" stop-opacity="0"/>
  </linearGradient>
  <clipPath id="c"><rect width="${FW}" height="${FH}" rx="18"/></clipPath>
</defs>
<g clip-path="url(#c)">
  <rect width="${FW}" height="${FH}" fill="#0b0c10"/>
  <ellipse class="bloom" cx="${FW / 2}" cy="${FH}" rx="460" ry="120" fill="url(#a)"/>
  ${particles(24, FW, FH)}
  <rect class="scan" x="${FW / 2 - 220}" y="44" width="440" height="1.5" fill="url(#l)"/>
  <text class="t" x="${FW / 2}" y="82" text-anchor="middle">THANKS FOR VISITING</text>
  <text class="u" x="${FW / 2}" y="112" text-anchor="middle">maher-bouchrara.vercel.app</text>
  <rect width="${FW}" height="${FH}" rx="18" fill="none" stroke="#2a2f38"/>
</g>
</svg>`;

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "header.svg"), header);
fs.writeFileSync(path.join(out, "footer.svg"), footer);
console.log("header", header.length, "footer", footer.length);
