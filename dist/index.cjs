"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  getServerSitemapResponse: () => getServerSitemapResponse
});
module.exports = __toCommonJS(index_exports);

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
    xml += `  <url>
`;
    xml += `    <loc>${escapeXml(entry.url)}</loc>
`;
    if (entry.alternates?.length) {
      for (const alt of entry.alternates) {
        xml += `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />
`;
      }
    }
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
    if (entry.images?.length) {
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
    if (entry.videos?.length) {
      for (const vid of entry.videos) {
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
function getServerSitemapResponse(entries) {
  const xml = generateXml(entries);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate"
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getServerSitemapResponse
});
//# sourceMappingURL=index.cjs.map