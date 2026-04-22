// src/utils/xml-escape.ts
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return c;
    }
  });
}

// src/core/generator.ts
function generateXml(entries) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;
  for (const entry of entries) {
    xml += `  <url>
`;
    xml += `    <loc>${escapeXml(entry.url)}</loc>
`;
    if (entry.lastmod) {
      const date = entry.lastmod instanceof Date ? entry.lastmod.toISOString() : entry.lastmod;
      xml += `    <lastmod>${date}</lastmod>
`;
    }
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>
`;
    }
    if (entry.priority !== void 0) {
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>
`;
    }
    if (entry.images && entry.images.length > 0) {
      for (const img of entry.images) {
        xml += `    <image:image>
`;
        xml += `      <image:loc>${escapeXml(img.loc)}</image:loc>
`;
        if (img.title) xml += `      <image:title>${escapeXml(img.title)}</image:title>
`;
        if (img.caption) xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>
`;
        xml += `    </image:image>
`;
      }
    }
    xml += `  </url>
`;
  }
  xml += `</urlset>`;
  return xml;
}

// src/index.ts
function getServerSitemapResponse(entries) {
  const xml = generateXml(entries);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate"
    }
  });
}
export {
  getServerSitemapResponse
};
//# sourceMappingURL=index.js.map