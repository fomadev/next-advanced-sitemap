# next-advanced-sitemap (v1.3.2) - Technical Documentation and Reference Manual

## 1. Introduction

`next-advanced-sitemap` is a high-performance, strictly typed XML sitemap, sitemap index, and `robots.txt` generator specifically engineered for Next.js App Router applications (`>= 13.0.0`). 

While Next.js offers basic out-of-the-box metadata support via `MetadataRoute.Sitemap` and `MetadataRoute.Robots`, enterprise web platforms require rich metadata extensions, dynamic index generation, multi-sitemap orchestration, and unified `robots.txt` synchronization to maximize discovery across search engine crawler matrices. `next-advanced-sitemap` fills this architectural gap by supplying full native support for:

- **Robots.txt Builder Engine (`buildRobotsText`) (v1.3.2)**: Instant, zero-dependency helper to format RFC-compliant `robots.txt` rules, infer the root host from the first sitemap URL when `host` is omitted, expose IDE autocomplete for major crawlers via `KnownUserAgent`, and link them directly to standard sitemaps or sitemap index endpoints.
- **Google Images Schema**: Captions, titles, local SEO positioning (`geo_location`), and copyright licensing (`license`).
- **Google Video Schema**: Live stream markers (`live`), restrictions (`restriction`, `platform`), monetization models (`price`), paywall markers (`requires_subscription`), duration bounds, categories, and tags.
- **Google News Schema**: Strict 48-hour freshness validation and stock tickers (`stock_tickers`).
- **Hreflang / Internationalization**: `xhtml:link` multi-region alternate links.
- **Master Sitemap Indexes (`<sitemapindex>`)**: Scalable data structures with strict URL escaping & query parameters safety for routing thousands of URLs across child sitemaps.
- **Data Chunking Utilities (`chunkSitemapEntries`)**: High-performance O(N) segmentation for datasets exceeding search engine single-file limits (50,000 URLs / 50MB).
- **Cross-Field Semantic Validation Engine**: Pre-generation validation that catches logical data contradictions before XML or text emission.

---

## 2. Core Architecture and Concepts

The library operates on a zero-dependency runtime strategy (outside Next.js and React peer definitions), delivering ultra-fast string serialization without heavy DOM manipulation or external formatting overhead.

### 2.1 Standard Sitemaps vs. Sitemap Indexes

Search engine standard specifications impose two hard physical constraints on individual sitemap files:
1. Maximum of 50,000 URLs per XML file.
2. Maximum uncompressed file size of 50MB.

To support large web applications, `next-advanced-sitemap` provides two distinct generation pipelines:

- **Standard Sitemap Pipeline (`getServerSitemapResponse`)**: Renders a standard XML `<urlset>` containing individual `<url>` nodes equipped with rich metadata extensions.
- **Sitemap Index Pipeline (`getServerSitemapIndexResponse`)**: Renders a master XML `<sitemapindex>` tree linking multiple child sitemaps (e.g., `sitemap-products.xml`, `sitemap-articles.xml`).

### 2.2 Edge Caching and Header Customization

Sitemaps and `robots.txt` files are frequently fetched by search engine crawlers. Generating complex XML or text payloads on every crawler request can strain database engines. `next-advanced-sitemap` provides built-in Cache-Control header customization:

- Default Header: `public, max-age=86400, stale-while-revalidate=3600` (optimized for Edge CDNs).
- Custom Header (`maxAge: N`): `public, max-age=N, must-revalidate`.

### 2.3 Robots.txt Builder & App Router Integration (v1.3.2)

Version 1.3.2 extends the helper with a typed `KnownUserAgent` union for IDE autocomplete while preserving custom crawler strings. It also keeps the v1.3.1 root-domain auto-discovery feature, making it ideal across environments such as staging, preview, or production where the same robots policy is reused but the sitemap origin changes.

By unifying `robots.txt` generation with sitemap management:
- You ensure your `Sitemap:` directive in `robots.txt` always points to your primary sitemap or master `<sitemapindex>`.
- You can specify single or multiple `userAgent` groups, fine-grained `allow` and `disallow` path rules, `crawlDelay` restrictions, typed bot suggestions, and explicit or inferred `host` directives.
- You can return the result seamlessly from a Next.js App Router Route Handler (`app/robots.txt/route.ts`).

---

## 3. Installation and Peer Dependencies

### 3.1 Installation

Install the package using your preferred Node.js package manager:

```bash
npm install next-advanced-sitemap
```

Or with Yarn / pnpm / Bun:

```bash
yarn add next-advanced-sitemap
# or
pnpm add next-advanced-sitemap
# or
bun add next-advanced-sitemap
```

### 3.2 System Requirements

- Node.js: `>= 18.0.0`
- Next.js: `>= 13.0.0` (App Router recommended)
- React: `>= 18.0.0`
- TypeScript: `>= 5.0.0` (for optimal type inference)

---

## 4. Getting Started

### 4.1 Creating a Standard Sub-Sitemap Route

Create a Route Handler at `app/sitemap-records.xml/route.ts`:

```typescript
import { getServerSitemapResponse, SitemapEntry } from 'next-advanced-sitemap';

export async function GET() {
  const entries: SitemapEntry[] = [
    {
      url: 'https://example.com',
      lastmod: new Date(),
      changefreq: 'daily',
      priority: 1.0,
      alternates: [
        { hreflang: 'en', href: 'https://example.com/en' },
        { hreflang: 'fr', href: 'https://example.com/fr' }
      ]
    },
    {
      url: 'https://example.com/about',
      changefreq: 'monthly',
      priority: 0.8
    }
  ];

  return getServerSitemapResponse(entries, {
    autoLastmod: true,
    sortByPriority: true,
    maxAge: 3600
  });
}
```

### 4.2 Creating a Master Sitemap Index Route

Create a Route Handler at `app/sitemap.xml/route.ts`:

```typescript
import { getServerSitemapIndexResponse, SitemapIndexEntry } from 'next-advanced-sitemap';

export async function GET() {
  const subSitemaps: SitemapIndexEntry[] = [
    {
      loc: 'https://example.com/sitemap-records.xml',
      lastmod: new Date()
    },
    {
      loc: 'https://example.com/api/sitemap?page=1&category=tech', // Query parameters are safely escaped into &amp;
      lastmod: '2026-08-01T00:00:00.000Z'
    }
  ];

  return getServerSitemapIndexResponse(subSitemaps, {
    autoLastmod: true,
    maxAge: 86400
  });
}
```

### 4.3 Creating a Native Robots.txt Route (v1.3.2)

Create a Route Handler at `app/robots.txt/route.ts`:

```typescript
import { buildRobotsText, type KnownUserAgent } from 'next-advanced-sitemap';

const knownBots: KnownUserAgent[] = ['Googlebot', 'GPTBot', 'ClaudeBot', 'CustomBot/1.0'];

export async function GET() {
  const robotsText = buildRobotsText({
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/private/', '/api/'],
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
      'https://staging.example.com/sitemap.xml',
      'https://staging.example.com/sitemap-news.xml'
    ],
    // host is optional: v1.3.2 infers https://staging.example.com from the first sitemap URL
  });

  return new Response(robotsText, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600'
    }
  });
}
```

This produces output equivalent to:

```txt
Host: https://staging.example.com
Sitemap: https://staging.example.com/sitemap.xml
Sitemap: https://staging.example.com/sitemap-news.xml
```

---

## 5. Rich Extension Guides

### 5.1 Google Images Metadata

Expose visual assets to Google Image Search with extended attributes including local SEO positioning and copyright licensing.

```typescript
const entry: SitemapEntry = {
  url: 'https://example.com/gallery/kinshasa',
  images: [
    {
      loc: 'https://example.com/images/photo1.jpg',
      title: 'Kinshasa Skyline',
      caption: 'Panoramic view of downtown Kinshasa at dusk.',
      geo_location: 'Kinshasa, Democratic Republic of the Congo',
      license: 'https://example.com/licenses/commercial'
    }
  ]
};
```

Features and Validation Rules:
- White-Space Drop: Title and caption fields containing only empty whitespace are automatically stripped to prevent empty XML tags (`<image:title></image:title>`).
- Deep XML Escaping: Special characters (`&`, `<`, `>`, `"`, `'`) are encoded safely into XML entities (`&amp;`, `&lt;`, etc.).
- License URL Validation: Must begin strictly with `http://` or `https://`.

### 5.2 Google Video Metadata

Provide structured metadata to rank videos in Google SERP video carousels and rich search cards.

```typescript
const entry: SitemapEntry = {
  url: 'https://example.com/videos/nextjs-masterclass',
  videos: [
    {
      thumbnail_loc: 'https://example.com/thumbs/nextjs.jpg',
      title: 'Next.js Advanced Masterclass',
      description: 'Comprehensive guide to building enterprise applications with Next.js.',
      content_loc: 'https://example.com/media/nextjs.mp4',
      player_loc: 'https://example.com/embed/nextjs',
      publication_date: new Date('2026-07-01T10:00:00Z'),
      duration: 5400,
      view_count: 125000,
      live: 'no',
      requires_subscription: true,
      price: {
        value: 49.99,
        currency: 'USD',
        type: 'own'
      },
      category: 'Technology & Software',
      tags: ['nextjs', 'react', 'typescript', 'seo'],
      restriction: {
        relationship: 'allow',
        countries: ['US', 'CA', 'FR', 'CD']
      },
      platform: {
        relationship: 'allow',
        platforms: ['web', 'mobile', 'tv']
      }
    }
  ]
};
```

Features and Validation Rules:
- Duration Boundary: Must be an integer between 0 and 28,800 seconds (8 hours max). Truncated via `Math.floor`.
- View Count: Must be a non-negative integer.
- Country Restriction Codes: Array of ISO 3166-1 alpha-2 or alpha-3 codes. Automatically converted to uppercase strings separated by spaces.
- Platform Restrictions: Allowed values are strictly `'web'`, `'mobile'`, and `'tv'`.
- Video Pricing: Currency code must be a valid 3-letter ISO 4217 code (e.g. `'USD'`, `'EUR'`). Price value is rounded to two decimal places (`.toFixed(2)`).
- Category and Tags: Category length capped at 256 characters. Tags capped at 32 items per video entry.

### 5.3 Google News Metadata

Index breaking news articles instantly in Google News Publisher Center.

```typescript
const entry: SitemapEntry = {
  url: 'https://example.com/news/fintech-expansion',
  news: {
    name: 'Tech Chronicle',
    language: 'en',
    publication_date: new Date(),
    title: 'Fintech Platforms Expand Across Central Africa',
    stock_tickers: ['NASDAQ:AAPL', 'NYSE:BABA']
  }
};
```

Features and Validation Rules:
- 48-Hour Freshness Rule: Google News sitemaps accept articles published within the last 48 hours only. Entries older than 48 hours trigger a cross-validation exception.
- Stock Tickers: Tickers must follow the strict `EXCHANGE:TICKER` pattern (e.g., `NASDAQ:AAPL`). They are joined into a comma-separated XML string tag.

### 5.4 Hreflang / Multilingual Alternate Links

Coordinate multi-regional and multi-language site structures.

```typescript
const entry: SitemapEntry = {
  url: 'https://example.com/products/phone',
  alternates: [
    { hreflang: 'en-us', href: 'https://example.com/us/products/phone' },
    { hreflang: 'fr-fr', href: 'https://example.com/fr/products/phone' },
    { hreflang: 'x-default', href: 'https://example.com/products/phone' }
  ]
};
```

### 5.5 Robots.txt Configuration & Formatting (v1.3.2)

Build standard RFC 9309 `robots.txt` files directly using `buildRobotsText(options)`.

```typescript
import { buildRobotsText, type KnownUserAgent, type RobotsOptions } from 'next-advanced-sitemap';

const knownBots: KnownUserAgent[] = ['Googlebot', 'Bingbot', 'GPTBot', 'CustomBot/1.0'];

const config: RobotsOptions = {
  rules: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/'],
      crawlDelay: 2
    },
    {
      userAgent: [knownBots[0], knownBots[1]],
      allow: ['/', '/public/']
    },
    {
      userAgent: knownBots[2],
      disallow: '/'
    }
  ],
  sitemap: [
    'https://staging.example.com/sitemap.xml',
    'https://staging.example.com/sitemap-news.xml'
  ],
  // host is optional in v1.3.2; it is inferred from the first sitemap origin
};

const output = buildRobotsText(config);
```

Generated Output:
```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Crawl-delay: 2

User-agent: Googlebot
User-agent: Bingbot
Allow: /
Allow: /public/

User-agent: GPTBot
Disallow: /

Host: https://staging.example.com
Sitemap: https://staging.example.com/sitemap.xml
Sitemap: https://staging.example.com/sitemap-news.xml
```

Features and Formatting Rules:
- Polymorphic Acceptor: `userAgent`, `allow`, `disallow`, and `sitemap` accept either a single string or an array of strings.
- IDE Autocomplete: `KnownUserAgent` exposes common crawler identifiers such as `Googlebot`, `Bingbot`, `GPTBot`, `ClaudeBot`, and others while still accepting custom strings like `CustomBot/1.0`.
- Array Serialization: Arrays are flattened into repetitive directive lines (e.g. multiple `Disallow:` or `User-agent:` lines).
- Crawl-Delay Formatting: Formatted as `Crawl-delay: <number>`.
- Auto-Host Discovery: If `host` is omitted, the first sitemap URL origin is extracted automatically and used as `Host:`. Explicit `host` values still take precedence.
- Host & Sitemap Appending: `Host:` and `Sitemap:` directives are placed cleanly at the end of the file buffer.

---

## 6. Advanced Features and Safety Guardrails

### 6.1 Large-Scale Dataset Segmentation (`chunkSitemapEntries`)

When building sitemaps for database entries reaching tens of thousands of records, use `chunkSitemapEntries` to break arrays into compliant sub-arrays:

```typescript
import { chunkSitemapEntries, SitemapEntry } from 'next-advanced-sitemap';

const massiveDatabaseRows: SitemapEntry[] = await fetchAllProductsFromDatabase();

// Slice entries into batches of 40,000 links
const chunks = chunkSitemapEntries(massiveDatabaseRows, 40000);

console.log(`Generated ${chunks.length} sub-sitemap arrays.`);
```

### 6.2 Index Volume Payload Scale Guard

`getServerSitemapIndexResponse` enforces an immutable fail-fast boundary constraint. If a sitemap index receives more than 50,000 child entries, execution halts immediately with an exception:

```
[next-advanced-sitemap] Index volume threshold breach: A single sitemap index cannot contain more than 50,000 sub-sitemaps.
```

### 6.3 Cross-Field Semantic Validation Engine

Before compiling XML outputs, `next-advanced-sitemap` passes entries through `validateCrossFields()` to catch logical contradictions:

1. Live Stream vs. Static Duration: A live video stream (`live: 'yes'`) cannot specify a static duration greater than zero.
2. Subscription vs. Ownership: A video requiring a subscription (`requires_subscription: 'yes'`) cannot simultaneously offer permanent direct purchase (`price.type: 'own'`).
3. News Article Freshness: News articles with `publication_date` older than 48 hours are rejected.

### 6.4 Dynamic Auto-Lastmod Injection

When `autoLastmod: true` is set in options, any standard entry or sitemap index entry missing an explicit `lastmod` date will automatically be assigned the current system timestamp in ISO format (`new Date().toISOString()`).

### 6.5 Priority Auto-Sorting

Setting `sortByPriority: true` sorts entries in strict descending order based on their numerical `priority` value (from `1.0` down to `0.0`). Entries lacking a defined priority inherit a baseline default value of `0.5`.

### 6.6 URL Sanitization, Auto-Trimming, and Index Location Escaping (v1.2.8)

All input URLs undergo strict sanitization and XML entity escaping:
- **Whitespace Trimming**: Leading and trailing spaces are automatically removed (`.trim()`).
- **Protocol Verification**: URLs must begin strictly with `http://` or `https://`.
- **Internal Space Interception**: URLs containing internal spaces are rejected with a strict validation exception.
- **Parsing Check**: Validated via native `URL.canParse()` or `new URL()`.
- **Sitemap Index Escaping & Query Parameters Safety (v1.2.8)**: In `buildSitemapIndexXml()`, child sitemap location URLs (`loc`) are sanitized with `sanitizeAndValidateUrl()` and XML entity-escaped using `escapeXml()`. This guarantees strict RFC 3986 and XML 1.0 compliance when index locations contain query parameters (e.g. `?page=1&category=tech` becomes `?page=1&amp;category=tech`) or XML reserved characters (`<`, `>`, `"`, `'`).

---

## 7. API Reference

### 7.1 Exported Functions

#### `getServerSitemapResponse(entries, options)`

Generates an HTTP `Response` object containing the standard sitemap XML structure.

- Parameters:
  - `entries` (`SitemapEntry[]`): Array of sitemap entries.
  - `options` (`SitemapOptions`, optional): Configuration options.
- Returns: `Response` with `Content-Type: application/xml; charset=utf-8` and configured `Cache-Control` headers.

#### `getServerSitemapIndexResponse(entries, options)`

Generates an HTTP `Response` object containing a sitemap index XML structure.

- Parameters:
  - `entries` (`SitemapIndexEntry[]`): Array of child sitemap index references.
  - `options` (`Pick<SitemapOptions, 'maxAge' | 'autoLastmod'>`, optional): Configuration options.
- Returns: `Response` with `Content-Type: application/xml; charset=utf-8`.

#### `buildRobotsText(options)` (v1.3.2)

Generates a formatted raw string for a `robots.txt` file.

- Parameters:
  - `options` (`RobotsOptions`): Configuration object containing rules, sitemap links, and optional host settings. If `host` is omitted, the helper infers it from the first provided sitemap URL origin.
- Returns: `string` (formatted `robots.txt` content).

#### `KnownUserAgent` (v1.3.2)

Typed union exposing the main public crawler identifiers with IDE autocomplete support while preserving custom bot strings via `(string & {})`.

- Examples: `'*'`, `'Googlebot'`, `'Bingbot'`, `'GPTBot'`, `'ClaudeBot'`, `'CustomBot/1.0'`

#### `chunkSitemapEntries(entries, size)`

Utility function to slice an array of sitemap entries into smaller chunks.

- Parameters:
  - `entries` (`SitemapEntry[]`): Full array of entries.
  - `size` (`number`): Maximum chunk size.
- Returns: `SitemapEntry[][]` (Array of entry arrays).

---

### 7.2 Core Interfaces and Types

#### `RobotsOptions` (v1.3.2)

| Property | Type | Required | Description |
|---|---|---|---|
| `rules` | `RobotsRule \| RobotsRule[]` | Yes | Rule or array of rules specifying user-agent access permissions. |
| `sitemap` | `string \| string[]` | No | Absolute URL or array of URLs pointing to sitemap / index endpoints. |
| `host` | `string` | No | Target domain host definition (e.g., `'https://example.com'`). If omitted, the helper derives it automatically from the first sitemap URL origin, while an explicit value still takes precedence. |

#### `RobotsRule` (v1.3.2)

| Property | Type | Required | Description |
|---|---|---|---|
| `userAgent` | `KnownUserAgent \| KnownUserAgent[]` | Yes | Targeted crawler identifier(s) (e.g. `'*'`, `'Googlebot'`, `['Bingbot', 'Slurp']`, or a custom value like `'CustomBot/1.0'`). |
| `allow` | `string \| string[]` | No | Path or array of paths allowed for crawling (e.g., `'/'`, `['/public/', '/blog/']`). |
| `disallow` | `string \| string[]` | No | Path or array of paths forbidden for crawling (e.g., `'/admin/'`, `['/api/', '/private/']`). |
| `crawlDelay` | `number` | No | Crawl delay requirement in seconds. |

#### `SitemapEntry`

| Property | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | Target absolute URL (must start with http:// or https://). |
| `lastmod` | `string \| Date` | No | Timestamp of last modification. |
| `changefreq` | `SitemapChangeFreq` | No | Crawl frequency hint (`always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`). |
| `priority` | `SitemapPriority` | No | Numerical weight between 0.0 and 1.0. |
| `images` | `SitemapImage[]` | No | Array of image metadata objects. |
| `videos` | `SitemapVideo[]` | No | Array of video metadata objects. |
| `news` | `SitemapNews` | No | Google News metadata object. |
| `alternates` | `SitemapAlternate[]` | No | Array of multilingual alternate links. |

#### `SitemapIndexEntry`

| Property | Type | Required | Description |
|---|---|---|---|
| `loc` | `string` | Yes | Absolute URL to the child sitemap XML file. |
| `lastmod` | `string \| Date` | No | Timestamp of last child sitemap modification. |

#### `SitemapOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `autoLastmod` | `boolean` | `false` | Dynamically injects system runtime date for missing `lastmod` fields. |
| `sortByPriority` | `boolean` | `false` | Sorts sitemap entries descending from priority 1.0 to 0.0. |
| `maxAge` | `number` | `undefined` | Defines custom TTL max-age in seconds for `Cache-Control` header. |

#### `SitemapImage`

| Property | Type | Required | Description |
|---|---|---|---|
| `loc` | `string` | Yes | Absolute URL of the target image file. |
| `title` | `string` | No | Image title text. Auto-trimmed and XML-escaped. |
| `caption` | `string` | No | Image caption text. Auto-trimmed and XML-escaped. |
| `geo_location` | `string` | No | Geographic location string (e.g., "Kinshasa, DRC"). |
| `license` | `string` | No | Absolute URL to usage rights or license terms. |

#### `SitemapVideo`

| Property | Type | Required | Description |
|---|---|---|---|
| `thumbnail_loc` | `string` | Yes | Absolute URL of thumbnail image. |
| `title` | `string` | Yes | Video title. Escaped. |
| `description` | `string` | Yes | Video description. Escaped. |
| `content_loc` | `string` | No | Direct URL to media file. |
| `player_loc` | `string` | No | Embeddable player iframe URL. |
| `publication_date` | `string \| Date` | No | Video publication date. |
| `duration` | `number` | No | Video duration in seconds (0 - 28800). |
| `view_count` | `number` | No | Number of views (non-negative). |
| `live` | `'yes' \| 'no'` | No | Live broadcast indicator. |
| `requires_subscription` | `boolean \| 'yes' \| 'no'` | No | Paywall requirement indicator. |
| `price` | `VideoPrice` | No | Commercial price parameters object. |
| `category` | `string` | No | General category string (max 256 chars). |
| `tags` | `string[]` | No | Array of tags (max 32 items). |
| `restriction` | `VideoRestriction` | No | Country access policy object. |
| `platform` | `VideoPlatform` | No | Device/platform access policy object. |

---

## 8. Version Changelog Highlights (v1.0.0 - v1.3.2)

- **v1.3.2**: Added `KnownUserAgent` autocomplete support for major crawlers in the TypeScript IDE while preserving custom crawler strings. This improves DX for rules such as `Googlebot`, `Bingbot`, `GPTBot`, `ClaudeBot`, and other known bots without blocking custom values.
- **v1.3.1**: Added automatic root-domain discovery for `buildRobotsText()`. If `host` is omitted, the helper extracts the origin from the first sitemap URL and emits the matching `Host:` directive, reducing environment-specific duplication across staging, preview, and production.
- **v1.3.0**: Native `robots.txt` helper release. Introduced `buildRobotsText()` and type interfaces (`RobotsRule`, `RobotsOptions`) allowing Next.js developers to generate clean, RFC 9309-compliant `robots.txt` files synced with sitemap endpoints in a single line of code.
- **v1.2.8**: Introduced Index Escaping & Query Parameters Safety for `<sitemapindex>` (`<loc>`), enforcing strict RFC 3986 and XML 1.0 entity escaping (`&` to `&amp;`, `?`, `=`, `<`, `>`) on child sitemap URLs.
- **v1.2.7**: Introduced automatic lastmod fallback support for Sitemap Index files via `autoLastmod`.
- **v1.2.6**: Added custom `maxAge` cache-control configuration for `getServerSitemapIndexResponse`.
- **v1.2.5**: Implemented Index Volume Payload Scale Guard throwing exceptions above 50,000 sub-sitemaps.
- **v1.2.4**: Introduced pure `chunkSitemapEntries()` utility function.
- **v1.2.3**: Added native `Date` object polymorphism support to `SitemapIndexEntry.lastmod`.
- **v1.2.2**: Enforced authoritative `xmlns` XML namespace injection for root sitemap index files.
- **v1.2.0**: Native Sitemap Indexing architecture (`getServerSitemapIndexResponse`).
- **v1.1.9**: Integrated Cross-Field Semantic Validation Engine (`validateCrossFields`).
- **v1.1.8**: Added Google News `<news:stock_tickers>` support.
- **v1.1.7**: Added video categories and tags support with character and count constraints.
- **v1.1.6**: Added video monetization and pricing schema (`<video:price>`).
- **v1.1.5**: Added video subscription paywall tracking (`<video:requires_subscription>`).
- **v1.1.4**: Added video country and platform access restriction schemas.
- **v1.1.3**: Added video duration and view count statistical validation rules.
- **v1.1.2**: Added white-space reduction and deep XML escaping for image accessibility attributes.
- **v1.1.1**: Added Google Video live streaming marker (`<video:live>`).
- **v1.1.0**: Added local SEO (`geo_location`) and license URL tracking for images.
- **v1.0.9**: Added `maxAge` custom TTL header support.
- **v1.0.8**: Added `sortByPriority` descending sort option.
- **v1.0.7**: Added URL auto-trimming sanitization.

---

## 9. License

`next-advanced-sitemap` is released under the **FomaDev Public License (FPL)**.

- **Free Use**: Authorized for personal and commercial projects as a dependency.
- **Contributions**: Pull requests are welcome via the official repository.
- **Restrictions**: Independent forks, source code redistribution, or building competing standalone software products based on this engine require a paid commercial license.

Copyright (c) 2026 Fordi / FomaDev.
