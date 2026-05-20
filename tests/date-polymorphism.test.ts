/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator';
import { SitemapEntry } from '../src/types/sitemap';

describe('Native Date Polymorphism (v1.0.6)', () => {
  const MOCK_DATE = new Date('2026-05-20T12:00:00.000Z');

  it('should accept and accurately parse native JavaScript Date objects in Google News extension', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/news/tech',
        news: {
          name: 'FomaDev Insider',
          language: 'fr',
          publication_date: MOCK_DATE, // Objet Date brut
          title: 'Next-advanced-sitemap v1.0.6 Released'
        }
      }
    ];

    const xml = generateXml(entries);
    expect(xml).toContain(`<news:publication_date>${MOCK_DATE.toISOString()}</news:publication_date>`);
  });

  it('should accept and accurately parse native JavaScript Date objects in Google Videos extension', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/videos/tutorial',
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/thumb.jpg',
            title: 'SEO Implementation Guide',
            description: 'Advanced automated sitemaps',
            publication_date: MOCK_DATE // Objet Date brut
          }
        ]
      }
    ];

    const xml = generateXml(entries);
    expect(xml).toContain(`<video:publication_date>${MOCK_DATE.toISOString()}</video:publication_date>`);
  });
});