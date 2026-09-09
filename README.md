# next-advanced-sitemap

[![License: FPL](https://img.shields.io/badge/License-FPL-orange.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)](DOCUMENTATION.md)
![CI Status](https://github.com/fomadev/next-advanced-sitemap/actions/workflows/tests.yml/badge.svg)

A robust, type-safe XML sitemap, sitemap index, and robots.txt generator for Next.js App Router applications (`>= 13.0.0`). 

It provides native support for Google Images, Google Video, Google News, Hreflang (multilingual), Master Sitemap Indexes (`<sitemapindex>`), Robots.txt Builder (`buildRobotsText`), Large-Scale Dataset Chunking, and Cross-Field Semantic Validation.

> **Full Documentation & API Reference**: For complete technical specifications, in-depth extension guides, and validation rules, see [DOCUMENTATION.md](DOCUMENTATION.md).

---

## What's New in v1.4.0 (Hardening & Strict Contract Release)

- **`<video:family_friendly>` is now serialized** — the property was previously declared in the type but silently dropped from the XML output (fix #39).
- **Cross-field validation handles booleans** — `requires_subscription: true` now correctly triggers Rule B rejection with `price.type: 'own'` (fix #40).
- **Strict `loc`-only sitemap index contract** — the undocumented `url` fallback on `SitemapIndexEntry` was removed; passing `url` now throws a clear validation error (breaking change, fix #47).
- **Strict `maxAge` validation** — negative, `NaN`, `Infinity`, or non-numeric values now throw a descriptive error instead of silently falling back (fix #49).
- **50,000-URL guardrail on single sitemaps** — `generateXml()` now enforces the sitemaps.org upper bound, like the existing index guardrail; use `chunkSitemapEntries()` for larger payloads (fix #50).
- **Shared `buildCacheControlHeader()`** — deduplicated Cache-Control logic across all response generators into one exported utility (fix #45).
- **English-first, modernized codebase** — all internal comments/JSDoc migrated to English; `tsconfig.json` and test imports hardened for NodeNext / strict JSON tooling (fixes #41-#44, #48).

---

## Key Features

- **Native Robots.txt Generator (`buildRobotsText`) (v1.3.10)**: Instantly generate standardized, clean `robots.txt` text content with full support for typed user-agents, allow/disallow paths, crawl-delay directives, inline host rules, sitemap links, and array-based `allow` / `disallow` directives. v1.3.10 adds the final RFC compliance sanitization pass — it removes excessive blank lines, trims trailing whitespace, normalizes paths to begin with `/`, strips Windows carriage returns, and preserves `getRobotsTextResponse()` text/plain delivery hardening with `X-Content-Type-Options: nosniff`. The IDE still offers autocomplete for major crawlers like `Googlebot`, `Bingbot`, `GPTBot`, `ClaudeBot`, and you can still use custom values such as `CustomBot/1.0`. If `host` is omitted, the helper auto-detects the root origin from the first sitemap URL to simplify staging, preview, and production setups.
- **Master Sitemap Indexing (`getServerSitemapIndexResponse`)**: Seamlessly link multiple child sitemaps to bypass search engine structural limits (50,000 URLs / 50MB per file).
- **Index URL Escaping & Query Parameters Safety (v1.2.8)**: Rigorous URL sanitization and XML entity escaping (`&` to `&amp;`, `<`, `>`, `"`, `'`) for `<sitemapindex>` child `<loc>` URLs, guaranteeing RFC 3986 and XML 1.0 compliance when index locations contain query parameters (`?`, `&`, `=`) or reserved characters.
- **Google Images Extensions**: Full support for titles, captions, local SEO positioning (`geo_location`), and copyright licensing (`license`).
- **Google Video Extensions**: Support for live stream markers (`live`), SafeSearch (`family_friendly`, serialized since v1.4.0), monetization models (`price`), paywall signals (`requires_subscription`), restrictions (`restriction`, `platform`), categories, and tags.
- **Google News Extensions**: Support for required metadata, 48-hour freshness rules, and stock market tickers (`stock_tickers`).
- **Multilingual (Hreflang)**: Native `xhtml:link` alternate language/region links.
- **Large-Scale Data Chunking (`chunkSitemapEntries`)**: High-performance O(N) utility function to segment large database outputs into compliant sub-arrays.
- **Cross-Field Semantic Validation**: Pre-generation validation engine that catches logical data contradictions before XML emission (including boolean `requires_subscription` since v1.4.0).
- **Payload Guardrails**: Fail-fast volume checks — 50,000-URL limit on single sitemaps and 50,000-child limit on index payloads.
- **Edge Cache Optimization**: Dynamic header generation for CDN caching with custom TTL support (`maxAge`), built on a single shared `buildCacheControlHeader()` utility. Invalid values (negative, `NaN`, `Infinity`) throw a clear error since v1.4.0.
- **Automatic Sanitization & Escaping**: Deep XML escaping (`&`, `<`, `>`, `"`, `'`) and automatic whitespace trimming. `escapeXml()` is a single-pass encoder over **raw** input — always pass unescaped text (e.g. `&`, not `&amp;`) to avoid double-encoding.

---

## Installation

```bash
npm install next-advanced-sitemap
# or
yarn add next-advanced-sitemap
# or
pnpm add next-advanced-sitemap
```

---

## Quick Start

### 1. Standard Sitemap Route (`app/sitemap-records.xml/route.ts`)

```typescript
import { getServerSitemapResponse, SitemapEntry } from 'next-advanced-sitemap';

export async function GET() {
  const entries: SitemapEntry[] = [
    {
      url: 'https://fomadev.com',
      lastmod: new Date(),
      changefreq: 'daily',
      priority: 1.0,
      alternates: [
        { hreflang: 'en', href: 'https://fomadev.com/en' },
        { hreflang: 'fr', href: 'https://fomadev.com/fr' }
      ]
    },
    {
      url: 'https://fomadev.com/videos/masterclass',
      priority: 0.9,
      videos: [
        {
          thumbnail_loc: 'https://fomadev.com/thumbs/masterclass.jpg',
          title: 'Next.js Advanced Masterclass',
          description: 'Building enterprise grade architectures.',
          duration: 7200,
          view_count: 25000,
          category: 'Technology',
          tags: ['nextjs', 'typescript']
        }
      ]
    }
  ];

  return getServerSitemapResponse(entries, {
    autoLastmod: true,
    sortByPriority: true,
    maxAge: 3600
  });
}
```

### 2. Master Sitemap Index Route (`app/sitemap.xml/route.ts`)

```typescript
import { getServerSitemapIndexResponse, SitemapIndexEntry } from 'next-advanced-sitemap';

export async function GET() {
  const subSitemaps: SitemapIndexEntry[] = [
    {
      loc: 'https://fomadev.com/sitemap-records.xml',
      lastmod: new Date()
    },
    {
      loc: 'https://fomadev.com/api/sitemap?page=1&category=tech', // Query parameters are safely escaped into &amp;
      lastmod: '2026-08-01T00:00:00.000Z'
    }
  ];

  return getServerSitemapIndexResponse(subSitemaps, {
    autoLastmod: true,
    maxAge: 86400
  });
}
```

### 3. Native Robots.txt Route (`app/robots.txt/route.ts`)

```typescript
import { getRobotsTextResponse, type KnownUserAgent } from 'next-advanced-sitemap';

const knownBots: KnownUserAgent[] = ['Googlebot', 'GPTBot', 'ClaudeBot', 'CustomBot/1.0'];

export async function GET() {
  return getRobotsTextResponse({
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/private/'],
        crawlDelay: 2
      },
      {
        userAgent: [knownBots[0], knownBots[1]],
        disallow: '/'
      },
      {
        userAgent: knownBots[3],
        allow: '/public/'
      }
    ],
    sitemap: [
      'https://staging.fomadev.com/sitemap.xml',
      'https://staging.fomadev.com/sitemap-news.xml'
    ],
    maxAge: 86400,
    // host is optional: it is automatically inferred from the first sitemap URL
  });
}
```

> In v1.3.10, if `host` is omitted, the helper automatically extracts the origin from the first sitemap URL and writes `Host: https://staging.fomadev.com` for you. The final RFC compliance sanitizer also trims trailing spaces, removes Windows carriage returns, collapses excessive blank lines, and normalizes missing leading slashes for `Allow` / `Disallow` paths. The `getRobotsTextResponse()` wrapper keeps enforcing `Content-Type: text/plain; charset=utf-8` and `X-Content-Type-Options: nosniff`, while preserving explicit `Crawl-delay` directives, `Allow` sub-route overrides, and multi-sitemap rendering. An explicit `host` still takes precedence if you need to override the detected value. The `KnownUserAgent` type also gives IDE autocomplete for the main crawlers while preserving custom string values.

### 4. Large Dataset Chunking (`chunkSitemapEntries`)

```typescript
import { chunkSitemapEntries, SitemapEntry } from 'next-advanced-sitemap';

const massiveDatabaseRows: SitemapEntry[] = [ /* 120,000 database items */ ];

// Slice into compliant batches of 40,000 links
const partitionedSitemaps = chunkSitemapEntries(massiveDatabaseRows, 40000);
```

---

## Documentation and API Manual

For complete technical specifications, interface definitions, cross-field validation rules, and full version history, please consult the dedicated manual:

**[DOCUMENTATION.md](DOCUMENTATION.md)**

---

## License

This project is licensed under the [FomaDev Public License (FPL)](LICENSE).

- **Free Use**: Authorized for personal and commercial projects as a dependency.
- **Contributions**: Authorized via Pull Requests to the official repository.
- **Restrictions**: Independent forks, source code redistribution, or building competing products based on this engine require a paid commercial license.

Copyright (c) 2026 Fordi / FomaDev.
