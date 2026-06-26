# next-advanced-sitemap

[![License: FPL](https://img.shields.io/badge/License-FPL-orange.svg)](LICENSE)
![CI Status](https://github.com/fomadev/next-advanced-sitemap/actions/workflows/tests.yml/badge.svg)

A robust and type-safe sitemap generator for Next.js (App Router). This library extends standard sitemap capabilities by providing native support for Google-specific metadata including Images, Videos, News, and Internationalization (Hreflang).

## Overview

While Next.js provides a built-in `MetadataRoute.Sitemap` utility, it currently lacks support for advanced SEO attributes required by high-performance web applications. `next-advanced-sitemap` bridges this gap, allowing developers to programmatically generate complex XML sitemaps that comply with Google's extended schemas.

## Features

- **Google Images Support**: Index visual assets such as dashboard charts, infographics, and banners.
- **Google Video Support**: Improve search visibility for video content with thumbnail and description metadata.
- **Google Video Live Streaming (v1.1.1)**: Native injection of the `<video:live>` parameter to flag real-time broadcasts and instantly trigger red **LIVE** badges on Google SERP matrices.
- **Google News Support**: Comply with Google News requirements including publication names and dates.
- **Internationalization**: Seamless integration of `xhtml:link` tags for Hreflang and multi-regional SEO.
- **Priority Auto-Sorting (v1.0.8)**: Optional deterministic descending sort (`1.0` to `0.0`) based on entry weights to present your most strategic pages to crawlers first.
- **Auto-Trimming Sanitization (v1.0.7)**: Automatic `.trim()` execution on all URL fields to silently correct leading/trailing whitespace errors from CMS or databases.
- **Native Date Polymorphism (v1.0.6)**: Full support for native JavaScript `Date` objects inside Google News and Video extensions—no manual conversion required.
- **Strict SEO Enum Typing (v1.0.5)**: Compile-time validation and IDE autocompletion for `changefreq` and `priority` values to prevent typos.
- **Strict Structural Validation (v1.0.4)**: Advanced URL parsing using the platform-native engine to intercept syntax errors and unencoded whitespaces before deployment.
- **Auto-lastmod (v1.0.3)**: Optional automatic injection of the current system date for entries missing a `lastmod` value.
- **Advanced XML Escaping (v1.0.2)**: Enhanced processor to handle complex special characters (`&`, `"`, `'`, `<`, `>`) in SEO metadata, ensuring XML integrity.
- **Developer Experience**: Fully typed with TypeScript, zero external dependencies, and optimized for Next.js Route Handlers.
- **Custom TTL Cache-Control (v1.0.9)**: Direct control over sitemap caching persistence using a clean `maxAge` configuration option to lower crawl footprints on backend nodes.
- **Local SEO & Image Licensing (v1.1.0)**: Enhanced Google Images schema integration with full support for `geo_location` and programmatic `license` badges to protect visual assets and boost image search CTR.

## Installation

```bash
npm install next-advanced-sitemap
```

## Usage

To implement an advanced sitemap in the Next.js App Router, create a Route Handler at `app/sitemap.xml/route.ts`.

```typescript
import { getServerSitemapResponse, SitemapEntry } from 'next-advanced-sitemap';

export async function GET() {
  const entries: SitemapEntry[] = [
    {
      url: '  https://fomadev.com  ', // Auto-trimmed seamlessly in v1.0.7
      lastmod: new Date(),
      changefreq: 'daily', // Strictly typed
      priority: 1.0,       // Auto-completed and strictly typed
      alternates: [
        { hreflang: 'fr', href: 'https://fomadev.com/fr' },
        { hreflang: 'en', href: 'https://fomadev.com/en' }
      ]
    },
    {
      url: 'https://fomadev.com/live-stream',
      priority: 0.9,
      videos: [
        {
          thumbnail_loc: 'https://fomadev.com/thumbs/live.jpg',
          title: 'FomaDev Live Tech Session',
          description: 'Building production-grade packages with Next.js.',
          publication_date: new Date(),
          live: 'yes' // v1.1.1: Triggers the official Google LIVE badge on SERP
        }
      ]
    },
    {
      url: 'https://fomadev.com/dashboard',
      priority: 0.8,
      images: [
        {
          loc: 'https://fomadev.com/charts/analytics.png',
          title: 'Growth Analytics Chart',
          caption: 'Visual representation of monthly user growth.',
          geo_location: 'Kinshasa, Democratic Republic of the Congo', // v1.1.0 Local SEO
          license: 'https://fomadev.com/terms/licensing' // v1.1.0 Badging
        }
      ]
    }
  ];

  // Enable autoLastmod and sortByPriority (v1.0.8) to optimize crawl efficiency
  return getServerSitemapResponse(entries, { 
    autoLastmod: true,
    sortByPriority: true 
  });
}
```

## API Reference

### getServerSitemapResponse(entries: SitemapEntry[], options?: SitemapOptions)

Generates a standard Next.js `Response` object with the correct `application/xml` content-type and optimized cache headers.

### Options:

* `autoLastmod` (boolean): If `true`, injects the current ISO date for any entry missing the `lastmod` property.

* `sortByPriority` (boolean): If `true`, sorts the sitemap records in a descending sequence based on their priority level (`1.0` down to `0.0`) before writing the XML stream. Items without an explicit priority fall back safely to `0.5`.

* `maxAge` (number): (Optional) Maximum lifespan duration expressed in seconds. Transforms the HTTP communication layer payload to use a rigid `public, max-age=X, must-revalidate` schema.

### SitemapEntry Object

<table>
  <thead>
      <tr>
          <th>Property</th>
          <th>Type</th>
          <th>Description</th>
      </tr>
  </thead>
  <tbody>
      <tr>
          <td><code>url</code></td>
          <td class="type-label">string</td>
          <td>The absolute URL of the page (must start with <strong>http/https</strong>).</td>
      </tr>
      <tr>
          <td><code>lastmod</code></td>
          <td class="type-label">Date | string</td>
          <td>(Optional) Last modification date.</td>
      </tr>
      <tr>
          <td><code>changefreq</code></td>
          <td class="type-label">SitemapChangeFreq</td>
          <td>(Optional) Bounded search engine hint ('always', 'daily', etc.).</td>
      </tr>
      <tr>
          <td><code>priority</code></td>
          <td class="type-label">SitemapPriority</td>
          <td>(Optional) Bounded priority float value (0.0 to 1.0).</td>
      </tr>
      <tr>
          <td><code>images</code></td>
          <td class="type-label">SitemapImage[]</td>
          <td>(Optional) Array of image metadata for Google Images.</td>
      </tr>
      <tr>
          <td><code>videos</code></td>
          <td class="type-label">SitemapVideo[]</td>
          <td>(Optional) Array of video metadata for Google Videos.</td>
      </tr>
      <tr>
          <td><code>news</code></td>
          <td class="type-label">SitemapNews</td>
          <td>(Optional) Metadata for Google News indexing.</td>
      </tr>
      <tr>
          <td><code>alternates</code></td>
          <td class="type-label">SitemapAlternate[]</td>
          <td>(Optional) Regional alternate URLs (Hreflang).</td>
      </tr>
      <tr>
          <td><code>geo_location</code></td>
          <td class="type-label">string</td>
          <td>(Optional) Geographic location string of the image (e.g., "Kinshasa, DRC").</td>
      </tr>
      <tr>
          <td><code>license</code></td>
          <td class="type-label">string</td>
          <td>(Optional) Valid HTTP/HTTPS URL addressing the licensing rights or usage terms of the image asset.</td>
      </tr>
  </tbody>
</table>

## Technical Implementation

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