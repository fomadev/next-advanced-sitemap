# next-advanced-sitemap

A robust and type-safe sitemap generator for Next.js (App Router). This library extends standard sitemap capabilities by providing native support for Google-specific metadata including Images, Videos, News, and Internationalization (Hreflang).

## Overview

While Next.js provides a built-in `MetadataRoute.Sitemap` utility, it currently lacks support for advanced SEO attributes required by high-performance web applications. `next-advanced-sitemap` bridges this gap, allowing developers to programmatically generate complex XML sitemaps that comply with Google's extended schemas.

## Features

- **Google Images Support**: Index visual assets such as dashboard charts, infographics, and banners.
- **Google Video Support**: Improve search visibility for video content with thumbnail and description metadata.
- **Google News Support**: Comply with Google News requirements including publication names and dates.
- **Internationalization**: Seamless integration of `xhtml:link` tags for Hreflang and multi-regional SEO.
- **Native Date Polymorphism (v1.0.6)**: Full support for native JavaScript `Date` objects inside Google News and Video extensions—no manual conversion required.
- **Strict SEO Enum Typing (v1.0.5)**: Compile-time validation and IDE autocompletion for `changefreq` and `priority` values to prevent typos.
- **Strict Structural Validation (v1.0.4)**: Advanced URL parsing using the platform-native engine to intercept syntax errors and unencoded whitespaces before deployment.
- **Auto-lastmod (v1.0.3)**: Optional automatic injection of the current system date for entries missing a `lastmod` value.
- **Advanced XML Escaping (v1.0.2)**: Enhanced processor to handle complex special characters (`&`, `"`, `'`, `<`, `>`) in SEO metadata, ensuring XML integrity.
- **Developer Experience**: Fully typed with TypeScript, zero external dependencies, and optimized for Next.js Route Handlers.

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
      url: 'https://fomadev.com',
      lastmod: new Date(),
      changefreq: 'daily', // Strictly typed
      priority: 1.0,      // Auto-completed and strictly typed
      alternates: [
        { hreflang: 'fr', href: 'https://fomadev.com/fr' },
        { hreflang: 'en', href: 'https://fomadev.com/en' }
      ]
    },
    {
      url: 'https://fomadev.com/dashboard',
      images: [
        {
          loc: 'https://fomadev.com/charts/analytics.png',
          title: 'Growth Analytics Chart',
          caption: 'Visual representation of monthly user growth.'
        }
      ]
    },
    {
      url: 'https://fomadev.com/video-tutorial',
      videos: [
        {
          thumbnail_loc: 'https://fomadev.com/thumbs/tutorial.jpg',
          title: 'Next.js Advanced SEO Tutorial',
          description: 'Learn how to implement advanced sitemaps in Next.js & React.',
          publication_date: new Date('2026-04-22') // Accepts raw Date objects smoothly
        }
      ]
    }
  ];

  // (Optional) v1.0.3: Enable autoLastmod to fill missing dates automatically
  return getServerSitemapResponse(entries, { autoLastmod: true });
}
```

## API Reference

### getServerSitemapResponse(entries: SitemapEntry[], options?: SitemapOptions)

Generates a standard Next.js `Response` object with the correct `application/xml` content-type and optimized cache headers.

### Options:

* `autoLastmod` (boolean): If `true`, injects the current ISO date for any entry missing the `lastmod` property.

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
  </tbody>
</table>

## Technical Implementation

### Native Date Polymorphism (v1.0.6 Update)

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