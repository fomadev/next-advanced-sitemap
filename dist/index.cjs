/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

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
function sanitizeAndValidateUrl(rawUrl, context) {
  const url = rawUrl ? rawUrl.trim() : "";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error(
      `[next-advanced-sitemap] Invalid URL in ${context}: "${url}". URLs must start with http:// or https://`
    );
  }
  if (url.includes(" ")) {
    throw new Error(
      `[next-advanced-sitemap] Malformed URL structure detected in ${context}: "${url}". Please verify spaces or special characters.`
    );
  }
  let isValid = false;
  if (typeof URL.canParse === "function") {
    isValid = URL.canParse(url);
  } else {
    try {
      new URL(url);
      isValid = true;
    } catch {
      isValid = false;
    }
  }
  if (!isValid) {
    throw new Error(
      `[next-advanced-sitemap] Malformed URL structure detected in ${context}: "${url}". Please verify spaces or special characters.`
    );
  }
  return url;
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
    const cleanMainUrl = sanitizeAndValidateUrl(entry.url, "main entry");
    xml += `  <url>
`;
    xml += `    <loc>${escapeXml(cleanMainUrl)}</loc>
`;
    if (entry.alternates?.length) {
      for (const alt of entry.alternates) {
        const cleanAltUrl = sanitizeAndValidateUrl(alt.href, "alternate link");
        xml += `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(cleanAltUrl)}" />
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
        const cleanImgUrl = sanitizeAndValidateUrl(img.loc, "image location");
        xml += `    <image:image>
`;
        xml += `      <image:loc>${escapeXml(cleanImgUrl)}</image:loc>
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
        const cleanThumbLoc = sanitizeAndValidateUrl(vid.thumbnail_loc, "video thumbnail");
        const cleanContentLoc = vid.content_loc ? sanitizeAndValidateUrl(vid.content_loc, "video content location") : void 0;
        const cleanPlayerLoc = vid.player_loc ? sanitizeAndValidateUrl(vid.player_loc, "video player location") : void 0;
        xml += `    <video:video>
`;
        xml += `      <video:thumbnail_loc>${escapeXml(cleanThumbLoc)}</video:thumbnail_loc>
`;
        xml += `      <video:title>${escapeXml(vid.title)}</video:title>
`;
        xml += `      <video:description>${escapeXml(vid.description)}</video:description>
`;
        if (cleanContentLoc) xml += `      <video:content_loc>${escapeXml(cleanContentLoc)}</video:content_loc>
`;
        if (cleanPlayerLoc) xml += `      <video:player_loc>${escapeXml(cleanPlayerLoc)}</video:player_loc>
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getServerSitemapResponse
});
//# sourceMappingURL=index.cjs.map