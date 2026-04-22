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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getServerSitemapResponse
});
//# sourceMappingURL=index.cjs.map