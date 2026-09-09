/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('URL Validation & Strict Structure (v1.0.4)', () => {
  // --- TESTS DE PROTOCOLE DE BASE ---
  it('should throw an error if main URL prefix is invalid', () => {
    const entries = [{ url: 'invalid-url' }];
    expect(() => generateXml(entries as any)).toThrow('[next-advanced-sitemap] Invalid URL');
  });

  it('should throw an error if image URL lacks protocol', () => {
    const entries = [
      { 
        url: 'https://fomadev.com',
        images: [{ loc: '/internal/image.png' }] // Manque http/https
      }
    ];
    expect(() => generateXml(entries as any)).toThrow('image location');
  });

  it('should pass if URLs are correct', () => {
    const entries: SitemapEntry[] = [{ url: 'https://fomadev.com' }];
    expect(() => generateXml(entries)).not.toThrow();
  });

  // --- TESTS DE STRUCTURE FINE (v1.0.4) ---
  it('should pass with a perfectly valid absolute URL', () => {
    const entries: SitemapEntry[] = [{ url: 'https://fomadev.com/valid-page' }];
    expect(() => generateXml(entries)).not.toThrow();
  });

  it('should throw an error if the URL contains internal spaces', () => {
    const entries: SitemapEntry[] = [{ url: 'https://fomadev.com/invalid page with spaces' }];
    expect(() => generateXml(entries)).toThrow(
      '[next-advanced-sitemap] Malformed URL structure detected in main entry'
    );
  });

  it('should throw an error if the URL is incomplete or missing a host', () => {
    const entries: SitemapEntry[] = [{ url: 'https://' }];
    expect(() => generateXml(entries)).toThrow(
      '[next-advanced-sitemap] Malformed URL structure detected in main entry'
    );
  });

  it('should validate sub-resource URLs like alternate links and image locations', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com',
        images: [{ loc: 'https://fomadev.com/invalid space.png' }]
      }
    ];
    expect(() => generateXml(entries)).toThrow(
      '[next-advanced-sitemap] Malformed URL structure detected in image location'
    );
  });
});