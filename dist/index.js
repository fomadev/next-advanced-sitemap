// src/utils/xml-escape.ts
function escapeXml(unsafe) {
  if (!unsafe) return "";
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
function validateUrl(url, context) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error(
      `[next-advanced-sitemap] Invalid URL in ${context}: "${url}". URLs must start with http:// or https://`
    );
  }
}
function generateXml(entries, options = {}) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
`;
  xml += `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
`;
  xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
  for (const entry of entries) {
    validateUrl(entry.url, "main entry");
    xml += `  <url>
`;
    xml += `    <loc>${escapeXml(entry.url)}</loc>
`;
    if (entry.alternates?.length) {
      for (const alt of entry.alternates) {
        validateUrl(alt.href, "alternate link");
        xml += `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />
`;
      }
    }
    let lastmodValue = entry.lastmod;
    if (options.autoLastmod && !lastmodValue) {
      lastmodValue = now;
    }
    if (lastmodValue) {
      const date = lastmodValue instanceof Date ? lastmodValue.toISOString() : lastmodValue;
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
    if (entry.images?.length) {
      for (const img of entry.images) {
        validateUrl(img.loc, "image location");
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
    if (entry.videos?.length) {
      for (const vid of entry.videos) {
        validateUrl(vid.thumbnail_loc, "video thumbnail");
        if (vid.content_loc) validateUrl(vid.content_loc, "video content location");
        if (vid.player_loc) validateUrl(vid.player_loc, "video player location");
        xml += `    <video:video>
`;
        xml += `      <video:thumbnail_loc>${escapeXml(vid.thumbnail_loc)}</video:thumbnail_loc>
`;
        xml += `      <video:title>${escapeXml(vid.title)}</video:title>
`;
        xml += `      <video:description>${escapeXml(vid.description)}</video:description>
`;
        if (vid.content_loc) xml += `      <video:content_loc>${escapeXml(vid.content_loc)}</video:content_loc>
`;
        if (vid.player_loc) xml += `      <video:player_loc>${escapeXml(vid.player_loc)}</video:player_loc>
`;
        if (vid.publication_date) {
          const vDate = vid.publication_date instanceof Date ? vid.publication_date.toISOString() : vid.publication_date;
          xml += `      <video:publication_date>${vDate}</video:publication_date>
`;
        }
        xml += `    </video:video>
`;
      }
    }
    if (entry.news) {
      const nDate = entry.news.publication_date instanceof Date ? entry.news.publication_date.toISOString() : entry.news.publication_date;
      xml += `    <news:news>
`;
      xml += `      <news:publication>
`;
      xml += `        <news:name>${escapeXml(entry.news.name)}</news:name>
`;
      xml += `        <news:language>${escapeXml(entry.news.language)}</news:language>
`;
      xml += `      </news:publication>
`;
      xml += `      <news:publication_date>${nDate}</news:publication_date>
`;
      xml += `      <news:title>${escapeXml(entry.news.title)}</news:title>
`;
      xml += `    </news:news>
`;
    }
    xml += `  </url>
`;
  }
  xml += `</urlset>`;
  return xml;
}

// src/index.ts
function getServerSitemapResponse(entries, options = {}) {
  const xml = generateXml(entries, options);
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