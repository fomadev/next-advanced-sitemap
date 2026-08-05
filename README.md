# next-advanced-sitemap

[![License: FPL](https://img.shields.io/badge/License-FPL-orange.svg)](LICENSE)
![CI Status](https://github.com/fomadev/next-advanced-sitemap/actions/workflows/tests.yml/badge.svg)

A robust, type-safe XML sitemap, sitemap index, and robots.txt generator for Next.js App Router applications (`>= 13.0.0`). 

It provides native support for Google Images, Google Video, Google News, Hreflang (multilingual), Master Sitemap Indexes (`<sitemapindex>`), Robots.txt Builder (`buildRobotsText`), Large-Scale Dataset Chunking, and Cross-Field Semantic Validation.

> **Full Documentation & API Reference**: For complete technical specifications, in-depth extension guides, and validation rules, see [DOCUMENTATION.md](DOCUMENTATION.md).

---

## Key Features

- **Native Robots.txt Generator (`buildRobotsText`) (v1.3.0)**: Instantly generate standardized, clean `robots.txt` text content with full support for user-agents, allow/disallow paths, crawl-delay directives, custom host rules, and sitemap/sitemap index links.
- **Master Sitemap Indexing (`getServerSitemapIndexResponse`)**: Seamlessly link multiple child sitemaps to bypass search engine structural limits (50,000 URLs / 50MB per file).
- **Index URL Escaping & Query Parameters Safety (v1.2.8)**: Rigorous URL sanitization and XML entity escaping (`&` to `&amp;`, `<`, `>`, `"`, `'`) for `<sitemapindex>` child `<loc>` URLs, guaranteeing RFC 3986 and XML 1.0 compliance when index locations contain query parameters (`?`, `&`, `=`) or reserved characters.
- **Google Images Extensions**: Full support for titles, captions, local SEO positioning (`geo_location`), and copyright licensing (`license`).
- **Google Video Extensions**: Support for live stream markers (`live`), monetization models (`price`), paywall signals (`requires_subscription`), restrictions (`restriction`, `platform`), categories, and tags.
- **Google News Extensions**: Support for required metadata, 48-hour freshness rules, and stock market tickers (`stock_tickers`).
- **Multilingual (Hreflang)**: Native `xhtml:link` alternate language/region links.
- **Large-Scale Data Chunking (`chunkSitemapEntries`)**: High-performance O(N) utility function to segment large database outputs into compliant sub-arrays.
- **Cross-Field Semantic Validation**: Pre-generation validation engine that catches logical data contradictions before XML emission.
- **Payload Guardrails**: Fail-fast volume checks preventing index payloads from exceeding 50,000 child sitemaps.
- **Edge Cache Optimization**: Dynamic header generation for CDN caching with custom TTL support (`maxAge`).
- **Automatic Sanitization & Escaping**: Deep XML escaping (`&`, `<`, `>`, `"`, `'`) and automatic whitespace trimming.

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
import { buildRobotsText } from 'next-advanced-sitemap';

export async function GET() {
  const robots = buildRobotsText({
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/private/'],
        crawlDelay: 2
      },
      {
        userAgent: 'GPTBot',
        disallow: '/'
      }
    ],
    sitemap: [
      'https://fomadev.com/sitemap.xml',
      'https://fomadev.com/sitemap-news.xml'
    ],
    host: 'https://fomadev.com'
  });

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600'
    }
  });
}
```

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