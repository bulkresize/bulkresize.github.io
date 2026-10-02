import fs from 'fs';

const html = fs.readFileSync('dist/how-to-bulk-resize-compress-images-free/index.html', 'utf8');

const report = {
  title: html.match(/<title>([^<]*)<\/title>/)?.[1] || '',
  canonical: html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] || '',
  ogType: html.match(/<meta property="og:type" content="([^"]*)"/)?.[1] || '',
  ogTitle: html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] || '',
  ogDescription: html.match(/<meta property="og:description" content="([^"]*)"/)?.[1] || '',
  h1: html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/\s+/g, ' ').trim() || '',
  h1Count: (html.match(/<h1[\s\S]*?<\/h1>/g) || []).length,
  h2Count: (html.match(/<h2[\s\S]*?<\/h2>/g) || []).length,
  h3Count: (html.match(/<h3[\s\S]*?<\/h3>/g) || []).length,
  hasBreadcrumbs: html.includes('aria-label="Breadcrumb"'),
  hasMicrodata: html.includes('itemtype="https://schema.org/BreadcrumbList"'),
  inSitemap: fs.readFileSync('dist/sitemap-0.xml', 'utf8').includes('how-to-bulk-resize-compress-images-free'),
  schemas: []
};

const schemaMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
schemaMatches.forEach((s, idx) => {
  const parsed = JSON.parse(s.replace(/<script type="application\/ld\+json">|<\/script>/g, ''));
  report.schemas.push({
    index: idx + 1,
    graphTypes: parsed['@graph'] ? parsed['@graph'].map(item => item['@type']) : [parsed['@type']]
  });
});

console.log(JSON.stringify(report, null, 2));
