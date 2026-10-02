import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('dist/index.html', 'utf8');

const report = {};

// 1. Metadata and OG
report.title = html.match(/<title>([^<]*)<\/title>/)?.[1] || '';
report.description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '';
report.keywords = html.match(/<meta name="keywords" content="([^"]*)"/)?.[1] || '';
report.canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] || '';
report.ogSiteName = html.match(/<meta property="og:site_name" content="([^"]*)"/)?.[1] || '';
report.ogTitle = html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] || '';
report.ogImage = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] || '';
report.ogWidth = html.match(/<meta property="og:image:width" content="([^"]*)"/)?.[1] || '';
report.ogHeight = html.match(/<meta property="og:image:height" content="([^"]*)"/)?.[1] || '';
report.twitterCard = html.match(/<meta name="twitter:card" content="([^"]*)"/)?.[1] || '';
report.hreflangs = (html.match(/hreflang="[^"]*"/g) || []).map(m => m.replace(/hreflang="|"/g, ''));

// 2. Schema Markup
const schemaMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
report.schemas = schemaMatches.map((s, idx) => {
  const raw = s.replace(/<script type="application\/ld\+json">|<\/script>/g, '');
  try {
    const parsed = JSON.parse(raw);
    const types = parsed['@graph'] ? parsed['@graph'].map(item => item['@type']) : [parsed['@type']];
    return {
      index: idx + 1,
      valid: true,
      type: parsed['@type'] || (parsed['@graph'] ? '@graph' : undefined),
      types,
      graphCount: parsed['@graph'] ? parsed['@graph'].length : 0,
      name: parsed.name,
      details: Object.keys(parsed)
    };
  } catch (err) {
    return { index: idx + 1, valid: false, error: err.message };
  }
});

// 3. Breadcrumbs
const allTypes = report.schemas.flatMap(s => s.types || [s.type]);
report.hasBreadcrumbSchema = allTypes.includes('BreadcrumbList');
report.hasBreadcrumbHtml = html.includes('nav aria-label="breadcrumb"') || html.includes('nav aria-label="Breadcrumb"');

// 4. Sitemap & Canonical
report.hasRobots = fs.existsSync('dist/robots.txt');
report.robotsContent = report.hasRobots ? fs.readFileSync('dist/robots.txt', 'utf8') : '';
report.hasSitemapIndex = fs.existsSync('dist/sitemap-index.xml');
report.hasSitemap0 = fs.existsSync('dist/sitemap-0.xml');
report.sitemapIndexContent = report.hasSitemapIndex ? fs.readFileSync('dist/sitemap-index.xml', 'utf8') : '';

// 5. Semantic HTML
report.h1Count = (html.match(/<h1[\s\S]*?<\/h1>/g) || []).length;
report.h2Count = (html.match(/<h2[\s\S]*?<\/h2>/g) || []).length;
report.h3Count = (html.match(/<h3[\s\S]*?<\/h3>/g) || []).length;
report.hasHeader = html.includes('<header');
report.hasMain = html.includes('<main');
report.hasFooter = html.includes('<footer');
report.hasNav = html.includes('<nav');
report.hasSection = html.includes('<section');
report.hasDetails = html.includes('<details');
report.hasTable = html.includes('<table');

// 6. Aria labels
report.ariaLabels = (html.match(/aria-label="[^"]*"/g) || []).map(m => m.replace(/aria-label="|"/g, ''));
report.ariaExpanded = (html.match(/aria-expanded="[^"]*"/g) || []).map(m => m.replace(/aria-expanded="|"/g, ''));
report.ariaControls = (html.match(/aria-controls="[^"]*"/g) || []).map(m => m.replace(/aria-controls="|"/g, ''));

// 7. Image Optimization
report.hasFaviconSvg = fs.existsSync('dist/favicon.svg');
report.hasFaviconIco = fs.existsSync('dist/favicon.ico');
report.hasOgImagePng = fs.existsSync('dist/og-image.png');
report.ogImageSize = report.hasOgImagePng ? fs.statSync('dist/og-image.png').size : 0;
report.hasWebmanifest = fs.existsSync('dist/site.webmanifest');
report.imgTagsCount = (html.match(/<img[\s\S]*?>/g) || []).length;
report.svgTagsCount = (html.match(/<svg[\s\S]*?<\/svg>/g) || []).length;

console.log(JSON.stringify(report, null, 2));
