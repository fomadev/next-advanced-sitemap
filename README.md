# next-advanced-sitemap

[![License: FPL](https://img.shields.io/badge/License-FPL-orange.svg)](LICENSE)
![CI Status](https://github.com/fomadev/next-advanced-sitemap/actions/workflows/tests.yml/badge.svg)

A robust and type-safe sitemap generator for Next.js (App Router). This library extends standard sitemap capabilities by providing native support for Google-specific metadata including Images, Videos, News, Internationalization (Hreflang), and large-scale Sitemap Index structures.

## Overview

While Next.js provides a built-in `MetadataRoute.Sitemap` utility, it currently lacks support for advanced SEO attributes required by high-performance web applications. `next-advanced-sitemap` bridges this gap, allowing developers to programmatically generate complex XML sitemaps and indexes that comply with Google's extended schemas.

## Features

- **Index Volume Payload Guard (vx.x.x)**: Implements an immutable fail-fast structural guardrail. Automatically intercepts and aborts execution by throwing a clear runtime exception if an index registration payload exceeds Google's absolute industrial threshold of 50,000 sub-sitemaps.
- **Large-Scale Data Chunking Helper (v1.2.4)**: Ships a pure, high-performance utility function `chunkSitemapEntries(entries, size)` designed to slice massive records arrays into smaller sub-arrays (e.g., batches of 10,000 or 40,000 links). Seamlessly orchestrates dataset splitting before routing content blocks into distinct multi-sitemap router nodes.
- **Index Date Polymorphism & Hybrid Typing (v1.2.3)**: Aligns sitemap index developer experience with core architecture rules. The `<lastmod>` parameter for child sitemaps fully accepts both raw JavaScript `Date` instances and structured ISO timestamp strings interchangeably.
- **Universal XML Namespace Injection & Strict Index Guardrails (v1.2.2)**: Automated compliance matching that embeds standard canonical namespaces (`xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`) inside root index configurations. Prevents parsing errors or validation dropouts across alternative search crawlers like Bing, Yandex, or DuckDuckGo while routing individual child locations through strict syntax URL engines.
- **Native Sitemap Indexing Architecture (v1.2.0)**: Advanced support for sitemap index grouping (`getServerSitemapIndexResponse`). Allows seamless scaling by linking multiple sub-sitemaps (e.g., `sitemap-0.xml`, `sitemap-products.xml`) under a centralized endpoint to bypass Google's 50,000 URLs strict limitation.
- **Cross-Field Semantic Validation (v1.1.9)**: Native cross-field validation engine that intercepts logical data contradictions (e.g., Live streams with static durations, subscriptions conflicts, or expired news) before writing the XML stream. Guarantees a flawless 100% compliance score in Google Search Console.
- **Financial Google News Syndication (v1.1.8)**: Native support for `<news:stock_tickers>` tags, mapping general press articles directly to active global stock market boards.
- **Video Semantic Classification & Long-Tail SEO (v1.1.7)**: Support for `<video:category>` and multiple `<video:tag>` elements to deeply contextualize video content and map assets to highly targeted niche queries.
- **Video Monetization Models & Prices (v1.1.6)**: Support for `<video:price>` parameters allowing VOD systems, streaming apps, and online academies to append clear monetary tags (`currency`, `value`, `type: rent/own`) directly into Google video indexing carousels.
- **Google Video Support**: Boost video search layouts and video-carousel presence on Google Search with complete structured data encapsulation.
- **Video Subscription & Paywall Guardrails (v1.1.5)**: Native integration of the `<video:requires_subscription>` tag to signal premium paywall barriers or free-tier states, preventing user-frustration search algorithmic penalties.
- **Video Country & Device Restrictions (v1.1.4)**: Advanced access control policy injection via `<video:restriction>` and `<video:platform>` properties to strictly control video delivery layouts across global boundaries and distinct screen classes (`web`, `mobile`, `tv`).
- **Video Engagement Metrics & Validation (v1.1.3)**: Native integration of `<video:duration>` and `<video:view_count>` statistical metrics featuring deterministic float truncation (`Math.floor`) and strict bounding boundaries (0 to 28,800 seconds max).
- **Google Images Support**: Complete indexation of visual assets with support for titles, captions, local SEO positioning, and copyright protections.
- **Image Accessibility Protection (v1.1.2)**: Advanced preventive protection against empty text strings or spaces (`.trim()`) in `title` and `caption` fields to completely eliminate malformed empty XML tokens.
- **Google Video Live Streaming (v1.1.1)**: Native injection of the `<video:live>` parameter to flag active real-time broadcasts and instantly trigger red **LIVE** badges on Google SERP matrices.
- **Google News Support**: Instant discovery for news publications with strict support for required news name, language tag, and publication date attributes.
- **Internationalization (Hreflang)**: Seamless rendering of `xhtml:link` relation tags to govern multi-regional and multilingual indexing across global markets.
- **Priority Auto-Sorting (v1.0.8)**: Optional deterministic descending sort (`1.0` down to `0.0`) based on entry weights to present your most strategic revenue-driving pages to crawlers first.
- **Auto-Trimming Sanitization (v1.0.7)**: Automatic `.trim()` execution on all URL structures to silently correct leading/trailing whitespace errors originating from CMS fields or raw databases.
- **Native Date Polymorphism (v1.0.6)**: Full support for native JavaScript `Date` objects inside all extensions—handling internal conversion and structural formatting automatically.
- **Strict SEO Enum Typing (v1.0.5)**: Compile-time validation and IDE autocompletion for `changefreq` and `priority` keys to completely lock out manual layout typos.
- **Strict Structural Validation (v1.0.4)**: Advanced URL parsing using the platform-native engine to intercept syntax errors and unencoded internal spaces before application deployment.
- **Auto-lastmod (v1.0.3)**: Optional automatic injection of the current system ISO date for entries missing an explicit `lastmod` tracking value.
- **Deep XML Metadata Escaping (v1.0.2)**: Enhanced, high-performance regex processor to safely handle complex special characters (`&`, `"`, `'`, `<`, `>`) inside titles, descriptions, and captions.
- **Custom TTL Cache-Control (v1.0.9)**: Direct control over sitemap caching persistence using a clean `maxAge` configuration option to lower crawl footprints on backend nodes.
- **Local SEO & Image Licensing (v1.1.0)**: Support for `geo_location` parameters and programmatic `license` badges to trigger Google's image search retail overlay.

## Installation

```bash
npm install next-advanced-sitemap
```

## Usage

### 1. Generating a Sub-Sitemap (Standard XML)

To implement a rich structural sitemap in the Next.js App Router, create a Route Handler at `app/sitemap-records.xml/route.ts`.

```typescript
import { getServerSitemapResponse, SitemapEntry } from 'next-advanced-sitemap';

export async function GET() {
  const entries: SitemapEntry[] = [
    {
      url: '  https://fomadev.com  ', // Auto-trimmed seamlessly in v1.0.7
      lastmod: new Date(),          // Full native JavaScript Date polymorphism
      changefreq: 'daily',          // Strictly typed SEO enum
      priority: 1.0,                // Auto-completed and strictly typed
      alternates: [
        { hreflang: 'fr', href: 'https://fomadev.com/fr' },
        { hreflang: 'en', href: 'https://fomadev.com/en' }
      ]
    },
    {
      url: 'https://fomadev.com/exclusive-movie',
      priority: 0.9,
      videos: [
        {
          thumbnail_loc: 'https://fomadev.com/thumbs/movie.jpg',
          title: 'FomaDev Premium Masterclass',
          description: 'Building global production-grade architectures with Next.js.',
          publication_date: new Date(),
          duration: 7200, 
          view_count: 25000,
          category: 'Education & Technology',
          tags: ['nextjs', 'typescript', 'advanced seo'],
          price: { value: 19.99, currency: 'usd', type: 'own' }, 
          requires_subscription: true,
          restriction: {
            relationship: 'allow',
            countries: ['cd', 'fr', 'us']
          }
        }
      ]
    },
    {
      url: 'https://fomadev.com/news/fintech-drc-2026',
      priority: 0.85,
      news: {
        name: 'FomaDev Insights',
        language: 'fr',
        publication_date: new Date(), // Dynamically evaluated to honor the strict 48h news rule (v1.1.9)
        title: 'The Rise of FinTech Infrastructure in Central Africa',
        stock_tickers: ['NYSE:BABA', 'NASDAQ:AAPL']
      }
    }
  ];

  return getServerSitemapResponse(entries, { 
    autoLastmod: true,
    sortByPriority: true 
  });
}
```

### 2. Generating a Master Sitemap Index (v1.2.2 / v1.2.3 / v1.2.x)

When scaling up your platform past Google or Bing structural thresholds, seamlessly group multiple sub-sitemaps together under a standard compliant master index. Create a Route Handler at `app/sitemap.xml/route.ts`.

```typescript
import { getServerSitemapIndexResponse, SitemapIndexEntry } from 'next-advanced-sitemap';

export async function GET() {
  const subSitemaps: SitemapIndexEntry[] = [
    {
      loc: 'https://fomadev.com/sitemap-records.xml',
      lastmod: new Date() // Hybrid Date Polymorphism (v1.2.3): Pass native JS Date objects directly!
    },
    {
      loc: 'https://fomadev.com/sitemap-products.xml', 
      lastmod: '2026-07-05T12:00:00.000Z' // Hybrid Date Polymorphism (v1.2.3): Raw ISO strings also supported!
    }
  ];

  // Enforces authoritative xmlns namespace schemas (v1.2.2)
  // 🛡️ Index Payload Guard (v1.2.x): Throws a fail-fast runtime exception if subSitemaps exceeds 50,000 items.
  return getServerSitemapIndexResponse(subSitemaps, {
    maxAge: 3600
  });
}
```

### 3. Splitting Massive Datasets with the Chunking Utility (v1.2.4 / v1.2.x)
If you extract deep data clusters exceeding search engine single-file limits, use the segmentation helper to seamlessly prevent volume threshold errors and comply with the **v1.2.x** core guardrails:

```typescript
import { chunkSitemapEntries, SitemapEntry } from 'next-advanced-sitemap';

const massiveDatabaseRows: SitemapEntry[] = [ /* 120,000 items from an ORM */ ];

// Safe Segmentation (v1.2.4): Automatically slices rows into compliant batches
const partitionedSitemaps = chunkSitemapEntries(massiveDatabaseRows, 40000);

console.log(partitionedSitemaps.length); // Output: 3 distinct arrays

// Best Practice: Register these 3 arrays dynamically into your sitemap index 
// without triggering the 50,000 Index Payload Guard exception!
```

## API Reference

### getServerSitemapIndexResponse(entries: SitemapIndexEntry[], options?: Pick<SitemapOptions, 'maxAge'>)

**Introduced in v1.2.0**. Generates a Next.js `Response` instance wrapping a structural `<sitemapindex>` tree. Ideal for routing deep content clusters while maintaining custom Edge cache distributions.

### getServerSitemapResponse(entries: SitemapEntry[], options?: SitemapOptions)

Generates a standard Next.js `Response` object with the correct `application/xml` content-type and optimized cache headers.

### Options Matrix:

* `autoLastmod` (boolean): If `true`, injects the current ISO date for any standard entry missing the `lastmod` property.

* `sortByPriority` (boolean): If `true`, sorts standard records in a descending sequence based on priority level (`1.0` down to `0.0`).

* `maxAge` (number): (Optional) Maximum lifespan duration expressed in seconds. Transforms the HTTP communication layer payload to use a rigid `public, max-age=X, must-revalidate` schema. Supported by both standard and index responses.

### SitemapEntry Object

| Property | Type | Description |
|----------|------|-------------|
| `url` | string | **Required.** Absolute target link (must begin with http:// or https://). |
| `lastmod` | Date \| string | Optional tracking timestamp reflecting last structural update. |
| `changefreq` | SitemapChangeFreq | Optional hint keyword mapped to engine crawling loops |
| `priority` | SitemapPriority | Optional weight coefficient bounding page value from 0.0 to 1.0. |
| `images` | SitemapImage[] | Optional array containing structural metadata assets for Google Images. |
| `videos` | SitemapVideo[] | Optional array conveying detailed schemas for rich video indexation. |
| `news` | SitemapNews | Optional integration configuration complying with Google News indexing rules. |
| `alternates` | SitemapAlternate[] | Optional translation links array serving Hreflang indexing loops. |
| `geo_location` | string | (Optional) Geographic location string of the image (e.g., "Kinshasa, DRC"). |
| `license` | string | (Optional) Valid HTTP/HTTPS URL addressing the licensing rights or usage terms of the image asset. |

### SitemapImage

| Property | Type | Description |
|----------|------|-------------|
| `loc` | string | **Required.** The absolute URL targeting the source image asset. |
| `title` | string | Optional text representation describing the visual asset. Auto-trimmed. |
| `caption` | string | Optional descriptive context surrounding the element. Deep XML Escaped. |
| `geo_location` | string | Optional location reference (e.g., "Kinshasa, Democratic Republic of the Congo"). |
| `license` | string | Optional absolute URL containing intellectual copyright terms or usage badges. |

### SitemapVideo

| Property | Type | Description |
|----------|------|-------------|
| `thumbnail_loc` | string | **Required.** The absolute URL targeting the source image asset. |
| `title` | string | **Required.** The descriptive headline of the video asset. Escaped. |
| `description` | string | **Required.** Summary text representing the video topic. Max 2048 chars. |
| `publication_date` | Date \| string | **Required.** Publication date object or raw formatted ISO string. |
| `content_loc` | string | Optional absolute URL targeting the raw video media stream container. |
| `player_loc` | string | Optional absolute URL linking out to an embeddable video player frame. |
| `duration` | number | Optional length in seconds. Must be an integer bounded between 0 and 28800. |
| `view_count` | number | Optional overall hit counter. Negative values strictly prohibited. |
| `live` | 'yes' \| 'no' | Optional switch triggering immediate Google SERP LIVE badges. |
| `price` | VideoPrice | Optional metadata structure attaching commercial purchase parameters to standard Google video rich cards. |
| `category` | string | Optional general topical category (e.g., 'Education', 'Technology'). Max 256 characters. Automatically trimmed and XML-escaped. |
| `tags` | string[] | Optional array of keywords describing the video. Bound to a strict maximum of 32 tags per video entry. Individual tags are automatically trimmed and XML-escaped. |

## Technical Implementation

### Index Payload Scale Boundaries & Fail-Fast Guardrails (vx.x.x)
To completely secure systems against deployment rejections within corporate crawling suites, **v1.2.x** establishes a rigid length validator at the entry-gate of the sitemap index builder pipeline:
* **Fail-Fast Boundary Control**: Before initializing any state buffers or resource string allocations, the engine checks array dimensions. If length variables surpass the 50,000 units parameter, it drops execution instantly with a descriptive troubleshooting message pointing directly to `chunkSitemapEntries()`.

### Large-Scale Dataset Segmentation & Memory Optimization (v1.2.4)
To comfortably address high-density web platforms where database extraction bounds exceed corporate index constraints, **v1.2.4** integrates a localized array segmentation helper:
* **Linear Time Complexity**: The `chunkSitemapEntries` algorithm implements a native slice stride pattern executing in $O(N)$ operational cycles, avoiding slow pointer shifts or excessive garbage collection overhead.
* **Deterministic Allocation**: Helps prevent memory overflow during XML node mapping inside standard Route Handlers by slicing the primary resource arrays cleanly into predictable partitions before any template generation loop begins.

### Hybrid Temporal Typings within Sub-Sitemaps Indexes (v1.2.3)
To guarantee consistency across internal modules, **v1.2.3** extends native date polymorphism to the sitemap index tree compilation pipeline:
* **Polymorphic Time Evaluation**: The serialization processor checks metadata keys at runtime using `instanceof Date` logic. Raw JavaScript objects are converted instantly to strict ISO-8601 strings, while pre-formatted database text tokens are preserved without extra computation overhead.

### Explicit Index Namespace Ingestion & Cross-Engine Interoperability (v1.2.2)
To secure discovery velocity across alternative crawlers (e.g., Bingbot) that reject unmapped root metadata structures, **v1.2.2** enforces strict compliance standards onto index generation trees:

* **Authoritative Schema Delivery**: The generator automatically injects the structural `xmlns` URI schema into the core `<sitemapindex>` element. This prevents alternative parsers from treating the output as an unindexed plain document.
* **Unified Normalization Layer**: Consolidates fault-tolerant property fallback mapping (recovering from `.url` variations seamlessly) and applies rigid validation patterns to intercept faulty localizations prior to production rendering.

### Native Sitemap Indexing Architecture & Edge Cache Alignment (v1.2.0)
To comfortably scale applications past search engine structural thresholds (max 50,000 URLs or 50MB per single uncompressed file), **v1.2.0** introduces a high-performance orchestration layer dedicated to nested sitemap index tree structures (`<sitemapindex>`):

* **Isolated Composition Engine**: The index builder avoids loading heavy polymorphic page matrices into memory. Instead, it relies on an ultra-lightweight serialization pipeline (`buildSitemapIndexXml`) dedicated exclusively to mapping nested `.xml` target links.
* **Shared Platform-Level Security**: Rather than implementing loose string references, the location processor (`loc`) is strictly routed through the core platform URL verification matrix. This intercepts structural mistakes, protocol anomalies (e.g. `ftp://`), and unencoded spaces before emitting a broken index payload.
* **Unified CDN Distribution Controls**: Both standard sitemaps and index structures share identical cache configuration capabilities. By default, index handlers emit immutable Edge CDN optimization directives (`public, s-maxage=86400, stale-while-revalidate`), while seamlessly unlocking manual invalidation windows via selective type extraction (`Pick<SitemapOptions, 'maxAge'>`).

### Cross-Field Semantic Validation & Search Console Guarantees (v1.1.9)
To enforce an absolute 100% SEO health score and completely prevent index drops caused by structural logic contradictions, **v1.1.9** introduces an isolated pre-generation validation layer (`validateCrossFields`). The core engine scans entry matrices and enforces strict cross-field business rules:

* **Live Stream vs Static Duration**: Google requires `<video:live>` structures to represent active real-time feeds. If an entry enables `live: 'yes'` while simultaneously specifying a static numerical `duration`, the compiler flags a fail-fast validation error.
* **Subscription Paywalls vs Ownership**: To protect user experience integrity, the engine blocks logical conflicts where a video simultaneously mandates a global subscription tier (`requires_subscription: 'yes'`) and offers individual permanent transactional ownership (`price.type: 'own'`).
* **Google News Temporal Strictness**: Google News indexes articles via sitemaps exclusively if they were published within a strict 48-hour window. The cross-validator evaluates the `publication_date` against the real-time system clock and halts the build if an expired article is detected, safeguarding your news syndication authority.

### Financial News Indexing & Exchange Layout Guarantees (v1.1.8)
To prevent ingestion validation errors within Google News Publisher Center dashboards, **v1.1.8** provides structural safety rails over trading taxonomy:

- **Literal Exchange Formatting**: The engine maps entries and asserts that each ticker entry implements an explicit colon separator split (`EXCHANGE:TICKER`). Mismatched patterns drop immediate compile-time or runtime errors.
- **Compact Delimiter Rendering**: Individual entities are fully sanitized, trimmed of white spaces, and bundled into a native single-line string token separated strictly by commas, adhering cleanly to Google's structural specification.

### Video Semantic Classification & Strict Structural Boundaries (v1.1.7)
To establish high topical authority without triggering algorithmic index drops or schema structure rejections in Google Search Console, **v1.1.7** implements multi-layered structural validation guardrails for categorization metadata:

- **Strict Array Length Checks**: The engine intercepts tag matrices at runtime. If a video block exceeds Google's hard threshold of 32 tags, the pipeline aborts via a descriptive fail-fast exception to prevent writing non-compliant XML structures.
- **Character Constraint & Trimming Safeties**: Category strings are automatically run through a whitespace-reduction pipeline. The internal engine verifies that the sanitized result complies with the 256-character limitation while throwing an error if the category reduces to an empty token.
- **Deep Entity Escaping on Metadata**: To fully protect the XML stream tree from layout crashes caused by characters like `&` or `<` inside user-generated or database-stored categories and tags (e.g., `"Next.js & Architecture"`), every text node is safely passed through the core high-performance regex escaping matrix.

### Video Pay-Per-View & VOD Pricing Architecture (v1.1.6)
For on-demand streaming infrastructures, private bootcamps, and e-learning engines, exposing precise transactional pricing properties to crawlers structures Google's rich metadata carousels. **v1.1.6** implements strict formatting pipelines to meet internal Google Search Console parameters:

- **ISO 4217 Auto-Normalization**: Currency codes are uniformly trimmed and transformed to mandatory uppercase formats (e.g. `currency: 'eur'` standardizes to `currency="EUR"`). Strings mismatching the exact 3-character international standard are rejected instantly.
- **Float Price Rounding**: Transaction values automatically pass through an integrated decimal standardizer mapping raw database values into clean, 2-digit floating formats (`.toFixed(2)`) to ensure layout parser compliance.
- **Transactional Intent Filtering**: The structure locks the optional transactional property down to strict literal string unions (`'rent'` | `'own'`) to avoid invalid data entry.

### Paywall Registration & Subscription Guardrails (v1.1.5)
For media syndicates, educational organizations, and video streaming architectures utilizing monetization paywalls, misconfiguring premium access markers can lead to harsh ranking reductions due to misleading click funnels (user frustration loops). **v1.1.5** abstracts this integration completely:

- **Polymorphic Flag Binding**: Developers can feed standard TypeScript boolean primitives (`true`/`false`) smoothly during layout binding, or explicitly pass native schema tokens (`'yes'` / `'no'`).

- **Data Normalization Engine**: The compiler captures boolean states and automatically renders them into standard Googlebot-compliant entity wrappers behind the scenes.

- **Fail-Fast Boundary Validation**: Inputting mixed type variables instantly triggers an architectural parsing error at runtime to halt invalid XML distribution formats before deployment.

### Video Distribution Rights & Geo-Blocking Safeguards (v1.1.4)
For streaming platforms, modern SaaS corporations, and decentralized content houses, geoblocking and device-specific index filtering are critical mechanisms needed to comply with broadcasting licenses and localized compliance laws. **v1.1.4** delivers high-performance runtime guardrails enforcing the exact schemas expected by Googlebot:

- **ISO 3166 Sanitation & Normalization**: Raw arrays housing country tokens are fully trimmed and mutated into pure uppercase codes automatically (e.g. `['cd', 'fr']` resolves seamlessly to `CD FR`). Length constraints ensure any invalid string length drops a granular error to block indexing corruption beforehand.

- **Screen Class Verification**: Platform listings undergo structural array verification to filter out illegal user strings. Only official Google target tokens (`web`, `mobile`, `tv`) are compiled into space-separated string structures.

### Strict Video Statistical Enforcement (v1.1.3)
Google's ingestion schema specifies rigid rules for video engagement parameters. Providing decimals or numbers outside structural limits can invalidate the entire sitemap file inside the Google Search Console.

- **Range Locking**: The generator enforces that any provided `duration` fits within a strict `0` to `28,800` seconds bracket (up to 8 hours). Breaking this threshold or inputting negative values immediately throws an descriptive runtime exception.

- **Decimal Truncation**: Both `duration` and `view_count` properties undergo automated conversion into integers using deterministic mathematical grounding (`Math.floor`). This allows systems to relay float-heavy numbers straight from analytics stores safely.

### Image Accessibility & E-commerce Protection
Large e-commerce platform backends or multi-vendor platforms frequently inject messy string data from user-generated fields—such as alternative text filled with raw spaces (`"   "`) or unescaped description metadata containing special HTML entities (`&`, `<`, `>`). To achieve strict alignment with Googlebot accessibility schemas without risking layout parsing crashes, the engine implements a two-tier architectural protective filter in **v1.1.2**:

1. **White Space Drop**: Every title, caption, and geographical entry is preventively processed using white-space reduction pipelines. Empty strings or lines composed only of white spaces are automatically stripped to avoid rendering dead, invalid `<image:title></image:title>` tokens.

2. **Deep Meta-Escaping**: Extends the core encoding matrix down to visual metadata blocks. This ensures massive production payloads safely render special symbols without altering the global XML stream layout tree.

### Priority Auto-Sorting
Search engine crawlers allocate a finite scanning resource quota (crawl budget) when inspecting domain properties. By default, raw database queries or collection iterations generate un-ordered XML lists, causing indexers to process trivial nodes ahead of strategic content. When `sortByPriority` is enabled, the generation engine executes an immutable descending sorting operation. Unlabeled entries smoothly receive an RFC-compliant fallback baseline score of `0.5`, allowing top-tier entries to line up at the absolute top of the index file.

### Auto-Trimming & Ingestion Sanitization

Distributed content pipelines frequently face issues with accidental leading spaces, trailing newlines, or indentation remnants introduced via headless CMS panels or Markdown document updates. To protect against application deployment errors caused by these invisible characters, the pipeline incorporates an automatic `.trim()` sanitization step. This layer cleans all input strings—including primary entries, alternative nodes, image endpoints, and video references—and passes the cleaned string directly down to the structural validation layer and the output XML stream.

### Native Date Polymorphism

To simplify integrations with database mappers and modern ORMs (like Prisma, Supabase, or Mongoose) that output raw timestamps, the compiler implements native date polymorphism. Media structures (`SitemapNews` and `SitemapVideo`) accept both standard string layouts and full JavaScript `Date` instances. The internal pipeline evaluates instances using the `instanceof Date` boundary condition and automatically fires the `.toISOString()` handler when a native object is discovered, removing boilerplate conversion overhead.

### Compile-Time Parameter Guarding

To avoid syntax typos breaking standard crawler schemas (e.g. accidentally writing `"dayly"` instead of `"daily"`), the library replaces generic primitive types with rigid evaluation layers:

* **SitemapChangeFreq**: A literal string union restricting data ingestion exclusively to authorized keywords (`'always'` | `'hourly'` | `'daily'` | `'weekly'` | `'monthly'` | `'yearly'` | `'never'`).

* **SitemapPriority**: A custom intersection schema offering direct autocomplete properties across decimal steps from `0.0` to `1.0` within modern code editors while retaining flexibility for precise custom float variables.

### Validation & Safety

The library executes deterministic validation layers on all URL inputs:

1. **Protocol Match**: Enforces that all strings begin strictly with an absolute `http://` or `https://` prefix.

2. **Whitespace Interception**: Instantly isolates and rejects strings containing unencoded internal spaces.

3. **Structural Compliance**: Leverages the native `URL.canParse`() API (with a clean fallback mechanism to the `new URL()` constructor) to validate layout health.


### Advanced XML Security

The engine includes an enhanced encoding processor. It automatically detects and escapes special characters within titles, descriptions, and captions to prevent XML layout corruption (e.g., `&` becomes `&amp;`, `<` becomes `&lt;`).

### Performance

This library relies on an optimized string-building pattern to ensure minimal execution memory footprints, even when parsing deep multi-resource structures with thousands of entries.

## License

This project is licensed under the [FomaDev Public License (FPL)](LICENSE).

* **Free Use**: Authorized for personal and commercial projects as a dependency.

* **[Contributions](CONTRIBUTING.md)**: Authorized via Pull Requests to the official repository only.

* **Restrictions**: Independent forks, redistribution of source code, or building competing products based on this engine require a paid commercial license.

See the [LICENSE](LICENSE) file for the full legal text.