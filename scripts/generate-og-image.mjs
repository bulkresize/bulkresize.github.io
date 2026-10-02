import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4C4541" />
      <stop offset="50%" stop-color="#3a3431" />
      <stop offset="100%" stop-color="#24201e" />
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F2C46A" />
      <stop offset="100%" stop-color="#AEAC78" />
    </linearGradient>
    <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F2C46A" />
      <stop offset="100%" stop-color="#e5ab3f" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="70" result="blur" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Ambient light glow in user palette colors -->
  <circle cx="220" cy="160" r="260" fill="#F2C46A" opacity="0.18" filter="url(#glow)" />
  <circle cx="1040" cy="460" r="280" fill="#AEAC78" opacity="0.22" filter="url(#glow)" />

  <!-- Grid lines subtle pattern -->
  <g stroke="#FCF0DA" stroke-opacity="0.06" stroke-width="1">
    <line x1="0" y1="100" x2="1200" y2="100" />
    <line x1="0" y1="200" x2="1200" y2="200" />
    <line x1="0" y1="300" x2="1200" y2="300" />
    <line x1="0" y1="400" x2="1200" y2="400" />
    <line x1="0" y1="500" x2="1200" y2="500" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
  </g>

  <!-- Top Logo & Brand -->
  <g transform="translate(100, 90)">
    <!-- Icon Box -->
    <rect width="64" height="64" rx="16" fill="url(#boxGrad)" />
    <circle cx="32" cy="28" r="8" fill="#4C4541" />
    <polygon points="18,52 32,36 44,48 50,42 56,52" fill="#4C4541" />

    <!-- Brand Name -->
    <text x="84" y="44" font-family="Inter, -apple-system, sans-serif" font-size="38" font-weight="900" fill="#FCF0DA">
      Bulk<tspan fill="#F2C46A">Resize</tspan>
    </text>

    <!-- Badge -->
    <rect x="300" y="16" width="180" height="32" rx="16" fill="#AEAC78" fill-opacity="0.25" stroke="#AEAC78" stroke-opacity="0.6" />
    <text x="390" y="38" font-family="Inter, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#FCF0DA" text-anchor="middle">
      100% CLIENT-SIDE
    </text>
  </g>

  <!-- Main Headline -->
  <text x="100" y="240" font-family="Inter, -apple-system, sans-serif" font-size="54" font-weight="900" fill="#FCF0DA" letter-spacing="-1">
    Free Bulk Image Resizer
  </text>
  <text x="100" y="305" font-family="Inter, -apple-system, sans-serif" font-size="54" font-weight="900" fill="url(#textGrad)" letter-spacing="-1">
    &amp; Batch Compressor
  </text>

  <!-- Description in Warm Cream -->
  <text x="100" y="375" font-family="Inter, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#FCF0DA" opacity="0.85">
    Resize, compress, and convert hundreds of images directly in browser RAM.
  </text>
  <text x="100" y="410" font-family="Inter, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#FCF0DA" opacity="0.85">
    Zero server uploads, zero file limits, and instant 1-click ZIP export.
  </text>

  <!-- Feature Pills -->
  <g transform="translate(100, 480)">
    <!-- Pill 1 -->
    <rect x="0" y="0" width="220" height="46" rx="12" fill="#38312e" stroke="#AEAC78" stroke-width="1.5" />
    <text x="110" y="28" font-family="Inter, -apple-system, sans-serif" font-size="15" font-weight="700" fill="#FCF0DA" text-anchor="middle">
      🛡️ Zero Cloud Uploads
    </text>

    <!-- Pill 2 -->
    <rect x="240" y="0" width="220" height="46" rx="12" fill="#38312e" stroke="#F2C46A" stroke-width="1.5" />
    <text x="350" y="28" font-family="Inter, -apple-system, sans-serif" font-size="15" font-weight="700" fill="#FCF0DA" text-anchor="middle">
      ⚡ Multi-Threaded Engine
    </text>

    <!-- Pill 3 -->
    <rect x="480" y="0" width="210" height="46" rx="12" fill="#38312e" stroke="#AEAC78" stroke-width="1.5" />
    <text x="585" y="28" font-family="Inter, -apple-system, sans-serif" font-size="15" font-weight="700" fill="#FCF0DA" text-anchor="middle">
      📦 Instant ZIP Bundle
    </text>

    <!-- Pill 4 -->
    <rect x="710" y="0" width="220" height="46" rx="12" fill="#38312e" stroke="#F2C46A" stroke-width="1.5" />
    <text x="820" y="28" font-family="Inter, -apple-system, sans-serif" font-size="15" font-weight="700" fill="#FCF0DA" text-anchor="middle">
      ✨ WebP, JPEG &amp; PNG
    </text>
  </g>

  <!-- Domain Tag bottom right -->
  <text x="1100" y="580" font-family="Inter, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#AEAC78" text-anchor="end">
    https://bulkresize.github.io
  </text>
</svg>
`;

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const svgBuffer = Buffer.from(svg);
  await sharp(svgBuffer)
    .resize(1200, 630)
    .png({ quality: 90 })
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('Successfully regenerated public/og-image.png with new color palette');
}

main().catch(console.error);
