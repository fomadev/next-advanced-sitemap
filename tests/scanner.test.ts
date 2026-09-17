/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { fileURLToPath } from 'node:url';
import { scanAppRouterRoutes } from '../src/core/scanner.js';

const FIXTURE_APP_DIR = fileURLToPath(new URL('./fixtures/app-router', import.meta.url));

describe('scanAppRouterRoutes (v1.4.0 / v2.0.0, Experimental)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should discover static pages and strip route groups', () => {
    const routes = scanAppRouterRoutes(FIXTURE_APP_DIR);
    const paths = routes.map((r) => r.path);

    expect(paths).toContain('/');
    expect(paths).toContain('/about');
    expect(paths).toContain('/contact'); // (marketing) route group stripped
  });

  it('should skip folders that only contain a route.ts API handler (v1.4.6)', () => {
    const routes = scanAppRouterRoutes(FIXTURE_APP_DIR);
    expect(routes.some((r) => r.path.includes('/users'))).toBe(false);
  });

  it('should skip special App Router files like layout/loading (v1.4.4)', () => {
    const routes = scanAppRouterRoutes(FIXTURE_APP_DIR);
    expect(routes.some((r) => r.filePath.includes('layout'))).toBe(false);
    expect(routes.some((r) => r.filePath.includes('loading'))).toBe(false);
  });

  it('should flag dynamic segments and warn unless silenced (v1.4.5)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const routes = scanAppRouterRoutes(FIXTURE_APP_DIR);

    const blogRoute = routes.find((r) => r.path.includes('/blog/'));
    expect(blogRoute?.isDynamic).toBe(true);
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockClear();
    scanAppRouterRoutes(FIXTURE_APP_DIR, { silent: true });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should respect excludeRoutes patterns (v1.4.1)', () => {
    const routes = scanAppRouterRoutes(FIXTURE_APP_DIR, { excludeRoutes: ['/admin'] });
    expect(routes.some((r) => r.path === '/admin')).toBe(false);
  });

  it('should expand an i18n [lang] segment into one route per locale (v1.4.3)', () => {
    const routes = scanAppRouterRoutes(FIXTURE_APP_DIR, { locales: ['en', 'fr'] });
    const localized = routes.filter((r) => r.isI18n);

    expect(localized.map((r) => r.path).sort()).toEqual(['/en', '/fr']);
  });

  it('should best-effort extract static metadata (v1.4.2)', () => {
    const routes = scanAppRouterRoutes(FIXTURE_APP_DIR);
    const about = routes.find((r) => r.path === '/about');

    expect(about?.metadata).toEqual({ title: 'About Us', description: 'Learn more about our company.' });
  });

  it('dryRun should print a report without throwing', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(() => scanAppRouterRoutes(FIXTURE_APP_DIR, { dryRun: true, silent: true })).not.toThrow();
    expect(logSpy).toHaveBeenCalled();
  });
});
