/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('Auto-lastmod Feature (v1.0.3)', () => {
  
  // On fixe une date précise pour les tests afin d'éviter les décalages de millisecondes
  const MOCK_DATE = new Date('2026-05-14T12:00:00.000Z');

  beforeEach(() => {
    // On simule l'horloge système
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should inject current system date when autoLastmod is true and lastmod is missing', () => {
    const entries: SitemapEntry[] = [
      { url: 'https://fomadev.com/page-1' }
    ];

    const xml = generateXml(entries, { autoLastmod: true });

    // Vérifie que la balise lastmod contient la date mockée
    expect(xml).toContain(`<lastmod>${MOCK_DATE.toISOString()}</lastmod>`);
  });

  it('should NOT inject system date when autoLastmod is false (default behavior)', () => {
    const entries: SitemapEntry[] = [
      { url: 'https://fomadev.com/page-1' }
    ];

    const xml = generateXml(entries);

    // Ne doit pas contenir de balise lastmod
    expect(xml).not.toContain('<lastmod>');
  });

  it('should prioritize entry lastmod over autoLastmod date', () => {
    const specificDate = new Date('2025-01-01T00:00:00.000Z');
    const entries: SitemapEntry[] = [
      { 
        url: 'https://fomadev.com/specific',
        lastmod: specificDate 
      }
    ];

    const xml = generateXml(entries, { autoLastmod: true });

    // Doit contenir la date spécifique et NON la date du système (MOCK_DATE)
    expect(xml).toContain(`<lastmod>${specificDate.toISOString()}</lastmod>`);
    expect(xml).not.toContain(`<lastmod>${MOCK_DATE.toISOString()}</lastmod>`);
  });

  it('should handle mixed entries correctly', () => {
    const entries: SitemapEntry[] = [
      { url: 'https://fomadev.com/auto' }, // Sans date
      { url: 'https://fomadev.com/manual', lastmod: '2026-01-01' } // Avec date string
    ];

    const xml = generateXml(entries, { autoLastmod: true });

    expect(xml).toContain(`<loc>https://fomadev.com/auto</loc>\n    <lastmod>${MOCK_DATE.toISOString()}</lastmod>`);
    expect(xml).toContain(`<loc>https://fomadev.com/manual</loc>\n    <lastmod>2026-01-01</lastmod>`);
  });
});