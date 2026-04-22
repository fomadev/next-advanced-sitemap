# next-advanced-sitemap

A robust and type-safe sitemap generator for Next.js (App Router). This library extends standard sitemap capabilities by providing native support for Google-specific metadata including Images, Videos, News, and Internationalization (Hreflang).

## Overview

While Next.js provides a built-in `MetadataRoute.Sitemap` utility, it currently lacks support for advanced SEO attributes required by high-performance web applications. `next-advanced-sitemap` bridges this gap, allowing developers to programmatically generate complex XML sitemaps that comply with Google's extended schemas.

## Features

- **Google Images Support**: Index visual assets such as dashboard charts, infographics, and banners.
- **Google Video Support**: Improve search visibility for video content with thumbnail and description metadata.
- **Google News Support**: Comply with Google News requirements including publication names and dates.
- **Internationalization**: Seamless integration of `xhtml:link` tags for Hreflang and multi-regional SEO.
- **Developer Experience**: Fully typed with TypeScript, zero external dependencies, and optimized for Next.js Route Handlers.

## Installation

```bash
npm install next-advanced-sitemap
```

## Usage

To implement an advanced sitemap in the Next.js App Router, create a Route Handler at `app/sitemap.xml/route.ts`.

```ts
import { getServerSitemapResponse } from 'next-advanced-sitemap';

export async function GET() {
  const entries = [
    {
      url: 'https://fomadev.com',
      lastmod: new Date(),
      changefreq: 'daily',
      priority: 1.0,
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
            <td>string</td>
            <td>The absolute URL of the page.</td>
        </tr>
        <tr>
            <td><code>lastmod</code></td>
            <td>Date | string</td>
            <td>(Optional) Last modification date in ISO format.</td>
        </tr>
        <tr>
            <td><code>changefreq</code></td>
            <td>string</td>
            <td>(Optional) Search engine hint for crawl frequency.</td>
        </tr>
        <tr>
            <td><code>priority</code></td>
            <td>number</td>
            <td>(Optional) Priority of the URL (0.0 to 1.0).</td>
        </tr>
        <tr>
            <td><code>images</code></td>
            <td>SitemapImage[]</td>
            <td>(Optional) Array of image metadata for Google Images.</td>
        </tr>
        <tr>
            <td><code>videos</code></td>
            <td>SitemapVideo[]</td>
            <td>(Optional) Array of video metadata for Google Videos.</td>
        </tr>
        <tr>
            <td><code>news</code></td>
            <td>SitemapNews</td>
            <td>(Optional) Metadata for Google News indexing.</td>
        </tr>
        <tr>
            <td><code>alternates</code></td>
            <td>SitemapAlternate[]</td>
            <td>(Optional) Language and regional alternate URLs (Hreflang).</td>
        </tr>
    </tbody>
</table>

## Technical Implementation

This library uses a stream-aligned string builder approach to ensure minimal memory footprint during XML generation. It automatically handles XML entity escaping for special characters (e.g., `&`, `<`, `>`) to prevent sitemap corruption.

## License

Distributed under the MIT License. See <a href="LICENSE">LICENSE</a> for more information.

## Author

Created by <a href="https://github.com/fomadev">fomadev</a>.