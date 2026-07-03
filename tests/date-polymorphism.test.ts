/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('Native Date Polymorphism (v1.0.6)', () => {
  // 🔥 Correction v1.1.9 : Utilisation d'une date dynamique pour éviter l'expiration Google News (48h)
  const getFreshMockDate = () => new Date();

  it('should accept and accurately parse native JavaScript Date objects in Google News extension', () => {
    const freshDate = getFreshMockDate();
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/news/tech',
        news: {
          name: 'FomaDev Insider',
          language: 'fr',
          publication_date: freshDate, // Objet Date brut et valide
          title: 'Next-advanced-sitemap v1.0.6 Released'
        }
      }
    ];

    const xml = generateXml(entries);
    expect(xml).toContain(`<news:publication_date>${freshDate.toISOString()}</news:publication_date>`);
  });

  it('should accept and accurately parse native JavaScript Date objects in Google Videos extension', () => {
    const freshDate = getFreshMockDate();
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/videos/tutorial',
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/thumb.jpg',
            title: 'SEO Implementation Guide',
            description: 'Advanced automated sitemaps',
            publication_date: freshDate // Objet Date brut
          }
        ]
      }
    ];

    const xml = generateXml(entries);
    expect(xml).toContain(`<video:publication_date>${freshDate.toISOString()}</video:publication_date>`);
  });
});