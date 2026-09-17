/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../types/sitemap.js';

export interface HealthCheckResult {
  url: string;
  status: number | null;
  ok: boolean;
  error?: string;
}

export interface HealthCheckOptions {
  /** Maximum number of concurrent HEAD requests. Default: 10. */
  concurrency?: number;
  /** Per-request timeout in milliseconds. Default: 5000. */
  timeoutMs?: number;
}

async function headRequest(url: string, timeoutMs: number): Promise<HealthCheckResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
    return { url, status: response.status, ok: response.ok };
  } catch (error) {
    return { url, status: null, ok: false, error: error instanceof Error ? error.message : 'Unknown fetch error' };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Performs an HTTP HEAD request against every entry's URL to catch broken
 * (404/410/5xx) links before they are submitted to Google in a sitemap.
 * Requests run with a bounded concurrency pool so large sitemaps do not
 * open thousands of simultaneous connections.
 *
 * This is an opt-in diagnostic utility — it is never invoked automatically
 * during XML generation. Intended for a CI job, a pre-deploy script, or an
 * on-demand `/api/sitemap/health` route.
 *
 * v2.0.0 (inspired by the "Sitemap Health Check" v4.0.0 roadmap item).
 */
export async function validateSitemapHealth(
  entries: SitemapEntry[],
  options: HealthCheckOptions = {}
): Promise<HealthCheckResult[]> {
  const concurrency = Math.max(1, options.concurrency ?? 10);
  const timeoutMs = options.timeoutMs ?? 5000;

  const results: HealthCheckResult[] = new Array(entries.length);
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < entries.length) {
      const index = cursor++;
      results[index] = await headRequest(entries[index].url, timeoutMs);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, entries.length) }, () => worker());
  await Promise.all(workers);

  return results;
}
