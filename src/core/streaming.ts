/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry, SitemapOptions } from '../types/sitemap.js';
import { buildUrlBaseXml } from './builders/url-builder.js';
import { buildImageXml } from './builders/image-builder.js';
import { buildVideoXml } from './builders/video-builder.js';
import { buildNewsXml } from './builders/news-builder.js';
import { createProcessingStats, processEntry, printDebugReport, ProcessedEntry } from './pipeline.js';

const MAX_ENTRIES = 50000;

const XML_HEADER =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
  `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n` +
  `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\n` +
  `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n` +
  `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

const XML_FOOTER = `</urlset>`;

export type SitemapEntrySource = SitemapEntry[] | Iterable<SitemapEntry> | AsyncIterable<SitemapEntry>;

function isAsyncIterable(source: unknown): source is AsyncIterable<SitemapEntry> {
  return typeof source === 'object' && source !== null && Symbol.asyncIterator in source;
}

async function* toProcessedStream(
  source: SitemapEntrySource,
  options: SitemapOptions,
  stats: ReturnType<typeof createProcessingStats>
): AsyncGenerator<ProcessedEntry> {
  if (Array.isArray(source)) {
    if (source.length > MAX_ENTRIES) {
      throw new Error(
        `[next-advanced-sitemap] Sitemap volume threshold breach: A single sitemap cannot contain more than 50,000 URLs. Detected: ${source.length}. Please leverage chunkSitemapEntries() to segment your dataset.`
      );
    }

    const processed: ProcessedEntry[] = [];
    for (const raw of source) {
      const result = processEntry(raw, options, stats);
      if (result) processed.push(result);
    }

    if (options.sortByPriority) {
      processed.sort((a, b) => {
        const priorityA = a.entry.priority !== undefined ? (a.entry.priority as number) : 0.5;
        const priorityB = b.entry.priority !== undefined ? (b.entry.priority as number) : 0.5;
        return priorityB - priorityA;
      });
    }

    for (const item of processed) yield item;
    return;
  }

  // Iterable / AsyncIterable: streamed lazily, one entry at a time — sortByPriority
  // is not supported here since the full dataset is never materialized in memory.
  let count = 0;
  const iterator = isAsyncIterable(source) ? source : (source as Iterable<SitemapEntry>);
  for await (const raw of iterator) {
    count++;
    if (count > MAX_ENTRIES) {
      throw new Error(
        `[next-advanced-sitemap] Sitemap volume threshold breach: A single sitemap cannot contain more than 50,000 URLs.`
      );
    }
    const result = processEntry(raw, options, stats);
    if (result) yield result;
  }
}

/**
 * Builds a `ReadableStream<Uint8Array>` that emits the sitemap XML
 * incrementally, one `<url>` block at a time, instead of constructing one
 * large in-memory string. Accepts either an array (already loaded in
 * memory) or an `AsyncIterable<SitemapEntry>` (e.g. a database cursor),
 * in which case entries are pulled and serialized lazily — the response
 * begins flushing to the client before the full dataset has even been
 * fetched.
 *
 * v2.0.0 (Phase 4 flagship feature: "Génération par Flux / Streaming").
 */
export function createSitemapXmlStream(source: SitemapEntrySource, options: SitemapOptions = {}): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const nowIso = new Date().toISOString();
  const stats = createProcessingStats();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(XML_HEADER));

        for await (const { entry, removalComment } of toProcessedStream(source, options, stats)) {
          let chunk = '';
          if (removalComment) {
            chunk += `  ${removalComment}\n`;
          }
          chunk += `  <url>\n`;
          chunk += buildUrlBaseXml(entry, options, nowIso);
          chunk += buildImageXml(entry.images);
          chunk += buildVideoXml(entry.videos);
          chunk += buildNewsXml(entry.news);
          chunk += `  </url>\n`;

          controller.enqueue(encoder.encode(chunk));
        }

        controller.enqueue(encoder.encode(XML_FOOTER));

        if (options.debug) {
          printDebugReport(stats);
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
