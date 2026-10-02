import fs from 'fs';
import path from 'path';

const distIndex = path.resolve('dist/index.html');
if (!fs.existsSync(distIndex)) {
  console.error('dist/index.html does not exist!');
  process.exit(1);
}

const html = fs.readFileSync(distIndex, 'utf8');

const checks = [
  { name: 'og:site_name === BulkResize', pass: html.includes('<meta property="og:site_name" content="BulkResize">') },
  { name: 'WebApplication Schema', pass: html.includes('"@type":"WebApplication"') },
  { name: 'SoftwareApplication Schema', pass: html.includes('"@type":"SoftwareApplication"') },
  { name: 'MultimediaApplication Category', pass: html.includes('"applicationCategory":"MultimediaApplication"') },
  { name: 'FAQPage Schema', pass: html.includes('"@type":"FAQPage"') },
  { name: 'Target keyword "bulk image resizer"', pass: html.includes('bulk image resizer') },
  { name: 'Target keyword "batch resize photos online"', pass: html.includes('batch resize photos online') },
  { name: 'Target keyword "private photo resizer"', pass: html.includes('private photo resizer') },
  { name: 'Hreflang es', pass: html.includes('hreflang="es"') },
  { name: 'Hreflang pt', pass: html.includes('hreflang="pt"') },
  { name: 'Hreflang de', pass: html.includes('hreflang="de"') },
  { name: 'Hreflang fr', pass: html.includes('hreflang="fr"') },
  { name: 'Hreflang ja', pass: html.includes('hreflang="ja"') },
  { name: 'Hreflang x-default', pass: html.includes('hreflang="x-default"') },
  { name: 'BuyMeACoffee Link', pass: html.includes('https://buymeacoffee.com/kisharadilz') },
  { name: 'Canonical Link', pass: html.includes('rel="canonical"') && html.includes('https://bulkresize.github.io/') },
];

let allPassed = true;
checks.forEach((c) => {
  console.log(`${c.pass ? '✅' : '❌'} ${c.name}`);
  if (!c.pass) allPassed = false;
});

// Also check localized subpaths
const locales = ['es', 'pt', 'de', 'fr', 'ja'];
locales.forEach((loc) => {
  const locIndex = path.resolve(`dist/${loc}/index.html`);
  const exists = fs.existsSync(locIndex);
  console.log(`${exists ? '✅' : '❌'} Subpath dist/${loc}/index.html exists`);
  if (!exists) allPassed = false;
});

if (allPassed) {
  console.log('\n🎉 ALL SEO & ARCHITECTURAL CHECKS PASSED!');
} else {
  console.error('\n❌ Some checks failed!');
  process.exit(1);
}
