# next-advanced-sitemap

A robust and type-safe sitemap generator for Next.js (App Router). This library extends standard sitemap capabilities by providing native support for Google-specific metadata including Images, Videos, News, and Internationalization (Hreflang).

## Overview

While Next.js provides a built-in `MetadataRoute.Sitemap` utility, it currently lacks support for advanced SEO attributes required by high-performance web applications. `next-advanced-sitemap` bridges this gap, allowing developers to programmatically generate complex XML sitemaps that comply with Google's extended schemas.

## Features

- **Google Images Support**: Index visual assets such as dashboard charts, infographics, and banners.
- **Google Video Support**: Improve search visibility for video content with thumbnail and description metadata.
- **Google News Support**: Comply with Google News requirements including publication names and dates.
- **Internationalization**: Seamless integration of `xhtml:link` tags for Hreflang and multi-regional SEO.
- **Strict Validation (v1.0.1)**: Built-in safety checks to ensure all URLs follow absolute protocols (http/https), preventing search engine rejection.
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
      url: '[https://fomadev.com](https://fomadev.com)',
      lastmod: new Date(),
      changefreq: 'daily',
      priority: 1.0,
      alternates: [
        { hreflang: 'fr', href: '[https://fomadev.com/fr](https://fomadev.com/fr)' },
        { hreflang: 'en', href: '[https://fomadev.com/en](https://fomadev.com/en)' }
      ]
    },
    {
      url: '[https://fomadev.com/dashboard](https://fomadev.com/dashboard)',
      images: [
        {
          loc: '[https://fomadev.com/charts/analytics.png](https://fomadev.com/charts/analytics.png)',
          title: 'Growth Analytics Chart',
          caption: 'Visual representation of monthly user growth.'
        }
      ]
    },
    {
      url: '[https://fomadev.com/video-tutorial](https://fomadev.com/video-tutorial)',
      videos: [
        {
          thumbnail_loc: '[https://fomadev.com/thumbs/tutorial.jpg](https://fomadev.com/thumbs/tutorial.jpg)',
          title: 'Next.js Advanced SEO Tutorial',
          description: 'Learn how to implement advanced sitemaps in Next.js.',
          publication_date: new Date('2026-04-22')
        }
      ]
    }
  ];

  return getServerSitemapResponse(entries);
}
```

## API Reference

### getServerSitemapResponse(entries: SitemapEntry[])

Generates a standard Next.js `Response` object with the correct `application/xml` content-type and optimized cache headers.

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
          <td>(Optional) Last modification date in ISO format.</td>
      </tr>
      <tr>
          <td><code>changefreq</code></td>
          <td class="type-label">string</td>
          <td>(Optional) Search engine hint (always, hourly, daily, etc.).</td>
      </tr>
      <tr>
          <td><code>priority</code></td>
          <td class="type-label">number</td>
          <td>(Optional) Priority of the URL (0.0 to 1.0).</td>
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

### Validation & Safety

Starting from version 1.0.1, the library performs strict validation on all link-related fields. If a URL does not include a valid protocol (http/https), the generator will throw a descriptive error to prevent deploying malformed sitemaps.

### Performance

This library uses an efficient string-building approach to ensure a minimal memory footprint. It automatically handles XML entity escaping for special characters (e.g., `&`, `<`, `>`) to maintain document integrity.

## License

This project is licensed under the [FomaDev Public License (FPL)](LICENSE).

* **Free Use**: Authorized for personal and commercial projects as a dependency.

* **[Contributions](CONTRIBUTING.md)**: Authorized via Pull Requests to the official repository only.

* **Restrictions**: Independent forks, redistribution of source code, or building competing products based on this engine require a paid commercial license.

See the [LICENSE](LICENSE) file for the full legal text.