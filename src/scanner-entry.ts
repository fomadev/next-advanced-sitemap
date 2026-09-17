/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Node.js-only entry point (`next-advanced-sitemap/scanner`).
 *
 * The experimental App Router route scanner depends on `node:fs` and
 * `node:path`, which are unavailable in Edge/browser runtimes. It is kept
 * out of the main package entry so that `getServerSitemapResponse()` and
 * friends stay usable from `export const runtime = 'edge'` route handlers
 * without ever pulling Node built-ins into that bundle.
 */
export { scanAppRouterRoutes, printScanReport, type ScannedRoute, type ScanRoutesOptions, type ScannedRouteMetadata } from './core/scanner.js';
