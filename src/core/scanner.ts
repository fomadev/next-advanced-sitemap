/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PAGE_EXTENSIONS = ['tsx', 'ts', 'jsx', 'js'];

export interface ScannedRouteMetadata {
  title?: string;
  description?: string;
}

export interface ScannedRoute {
  /** URL path derived from the folder structure (route groups stripped). */
  path: string;
  /** Absolute filesystem path of the matched page file. */
  filePath: string;
  /** True if the route (or one of its ancestor segments) is dynamic, e.g. `[slug]`. */
  isDynamic: boolean;
  /** True if the dynamic segment looks like an i18n locale folder (`[lang]`, `[locale]`). */
  isI18n: boolean;
  /** Best-effort extraction of a static `export const metadata = { ... }` object. */
  metadata?: ScannedRouteMetadata;
}

export interface ScanRoutesOptions {
  /**
   * Route path patterns to exclude, e.g. `['/admin', '/(dashboard)']`.
   * A pattern matches if the scanned route path starts with it, or equals
   * it exactly; trailing `*` matches any suffix.
   */
  excludeRoutes?: string[];
  /**
   * When set, any `[lang]` / `[locale]` segment is expanded into one
   * concrete route per locale instead of being reported as a single
   * dynamic placeholder (v1.4.3 i18n support).
   */
  locales?: string[];
  /**
   * If true, logs the discovered routes to the console (via
   * `printScanReport`) and does not throw on dynamic-route warnings —
   * useful to sanity-check the scanner before wiring it into a build.
   */
  dryRun?: boolean;
  /**
   * Disables the console warning emitted for dynamic segments that are
   * not expanded via `locales` (e.g. `app/blog/[slug]/page.tsx`), which
   * must instead be supplied manually through your database-backed API.
   */
  silent?: boolean;
}

interface CacheRecord {
  timestamp: number;
  routes: ScannedRoute[];
}

const DEV_CACHE = new Map<string, CacheRecord>();
const DEV_CACHE_TTL_MS = 5000;

function isIgnoredSegment(segment: string): boolean {
  return segment.startsWith('(') && segment.endsWith(')');
}

function isDynamicSegment(segment: string): boolean {
  return segment.startsWith('[') && segment.endsWith(']');
}

function isI18nSegment(segment: string): boolean {
  if (!isDynamicSegment(segment)) return false;
  const name = segment.slice(1, -1).toLowerCase();
  return name === 'lang' || name === 'locale' || name === 'locales';
}

function toRoutePath(segments: string[]): string {
  const clean = segments.filter((segment) => !isIgnoredSegment(segment));
  const path = '/' + clean.join('/');
  return path === '/' ? '/' : path.replace(/\/+$/, '');
}

function matchesExclude(routePath: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern.endsWith('*')) {
      return routePath.startsWith(pattern.slice(0, -1));
    }
    return routePath === pattern || routePath.startsWith(`${pattern}/`);
  });
}

function extractMetadata(filePath: string): ScannedRouteMetadata | undefined {
  let content: string;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch {
    return undefined;
  }

  if (!/export\s+const\s+metadata/.test(content)) return undefined;

  // Best-effort, static-string-literal extraction only — not a full AST parse.
  const titleMatch = content.match(/title\s*:\s*(['"`])((?:(?!\1).)*)\1/);
  const descriptionMatch = content.match(/description\s*:\s*(['"`])((?:(?!\1).)*)\1/);

  const metadata: ScannedRouteMetadata = {};
  if (titleMatch) metadata.title = titleMatch[2];
  if (descriptionMatch) metadata.description = descriptionMatch[2];

  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

function findPageFile(dir: string): string | null {
  for (const ext of PAGE_EXTENSIONS) {
    const candidate = join(dir, `page.${ext}`);
    try {
      if (statSync(candidate).isFile()) return candidate;
    } catch {
      // not found, try next extension
    }
  }
  return null;
}

function directoryHasOnlyRouteHandler(dir: string): boolean {
  // v1.4.6: a folder containing only route.ts (API Route Handler) with no page.* is skipped.
  return findPageFile(dir) === null && PAGE_EXTENSIONS.some((ext) => {
    try {
      return statSync(join(dir, `route.${ext}`)).isFile();
    } catch {
      return false;
    }
  });
}

function walk(dir: string, segments: string[], options: ScanRoutesOptions, results: ScannedRoute[]): void {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }

  const pageFile = findPageFile(dir);

  if (pageFile) {
    const routePath = toRoutePath(segments);
    const isDynamic = segments.some(isDynamicSegment);
    const isI18n = segments.some(isI18nSegment);

    if (!options.excludeRoutes || !matchesExclude(routePath, options.excludeRoutes)) {
      const metadata = extractMetadata(pageFile);
      const localeSegmentIndex = segments.findIndex(isI18nSegment);

      if (localeSegmentIndex !== -1 && options.locales?.length) {
        for (const locale of options.locales) {
          const expandedSegments = [...segments];
          expandedSegments[localeSegmentIndex] = locale;
          results.push({
            path: toRoutePath(expandedSegments),
            filePath: pageFile,
            isDynamic: expandedSegments.some(isDynamicSegment),
            isI18n: true,
            metadata,
          });
        }
      } else {
        if (isDynamic && !isI18n && !options.silent) {
          console.warn(
            `[next-advanced-sitemap] Dynamic route detected at "${pageFile}" (${routePath}) — connect it to your database-backed API to include it in the sitemap; it was NOT auto-added.`
          );
        }
        results.push({ path: routePath, filePath: pageFile, isDynamic, isI18n, metadata });
      }
    }
  }

  if (directoryHasOnlyRouteHandler(dir)) {
    return; // v1.4.6: don't descend into pure API-handler subtrees any further than needed
  }

  for (const child of entries) {
    if (child === 'node_modules' || child.startsWith('.')) continue;

    const fullPath = join(dir, child);
    let isDirectory = false;
    try {
      isDirectory = statSync(fullPath).isDirectory();
    } catch {
      continue;
    }

    if (!isDirectory) continue;

    walk(fullPath, [...segments, child], options, results);
  }
}

/**
 * Prints a concise table of discovered routes to the console. Used
 * automatically when `dryRun: true` is passed to {@link scanAppRouterRoutes}.
 */
export function printScanReport(routes: ScannedRoute[]): void {
  console.log(`[next-advanced-sitemap] Route scan: ${routes.length} static page(s) discovered.`);
  for (const route of routes) {
    const flags = [route.isDynamic ? 'dynamic' : null, route.isI18n ? 'i18n' : null].filter(Boolean).join(', ');
    console.log(`  - ${route.path}${flags ? ` (${flags})` : ''} -> ${route.filePath}`);
  }
}

/**
 * Scans a Next.js App Router `app/` directory and returns the list of
 * statically addressable routes, so they can be merged with your manually
 * maintained dynamic-route entries. Experimental — requires the Node.js
 * runtime (`export const runtime = 'nodejs'` in your route handler).
 *
 * Applies the following guardrails automatically:
 * - Skips `layout`, `loading`, `error`, `not-found`, `template`, `default` files (v1.4.4).
 * - Skips folders that only contain a `route.ts` API handler (v1.4.6).
 * - Skips route groups `(group)` when building the URL path.
 * - Warns (once per route) on dynamic segments that require manual wiring (v1.4.5),
 *   unless `locales` expansion applies or `silent: true` is passed.
 *
 * In development (`NODE_ENV === 'development'`), results are cached in
 * memory for a few seconds to avoid re-scanning the disk on every Fast
 * Refresh (v1.4.9).
 *
 * v1.4.0 / v2.0.0.
 */
export function scanAppRouterRoutes(appDir: string, options: ScanRoutesOptions = {}): ScannedRoute[] {
  const cacheKey = `${appDir}::${JSON.stringify(options)}`;

  if (process.env.NODE_ENV === 'development') {
    const cached = DEV_CACHE.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < DEV_CACHE_TTL_MS) {
      return cached.routes;
    }
  }

  const results: ScannedRoute[] = [];
  walk(appDir, [], options, results);

  if (options.dryRun) {
    printScanReport(results);
  }

  if (process.env.NODE_ENV === 'development') {
    DEV_CACHE.set(cacheKey, { timestamp: Date.now(), routes: results });
  }

  return results;
}
