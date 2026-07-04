/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { getServerSitemapResponse, SitemapEntry } from '../src/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('E2E XML Generation for CI Compliance', () => {
  it('should compile a multi-resource sitemap and write a physical fixture file', async () => {
    // 🎯 Génération d'une date dynamique (il y a 1 heure) pour contourner la barrière stricte des 48h de Google News
    const dynamicRecentDate = new Date();
    dynamicRecentDate.setHours(dynamicRecentDate.getHours() - 1);

    const mockEntries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/news/fintech-drc',
        priority: 1.0,
        news: {
          name: 'FomaDev Insights',
          language: 'fr',
          publication_date: dynamicRecentDate, // Date dynamique toujours valide
          title: 'The Rise of FinTech Infrastructure in Central Africa & DRC',
          stock_tickers: ['NASDAQ:AAPL', 'NYSE:BABA']
        },
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/thumb.jpg',
            title: 'Masterclass Pricing and Paywall Architecture',
            description: 'Deep dive into next-advanced-sitemap design schemas.',
            publication_date: dynamicRecentDate.toISOString(), // Format ISO dynamique
            category: 'Tech Education',
            tags: ['nextjs', 'seo', 'typescript'],
            price: { value: 19.99, currency: 'USD', type: 'own' },
            requires_subscription: true
          }
        ]
      }
    ];

    const response = await getServerSitemapResponse(mockEntries, { autoLastmod: true, sortByPriority: true });
    const xmlContent = await response.text();

    const targetDir = path.resolve(__dirname, 'fixtures');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, 'sitemap.xml');
    fs.writeFileSync(targetPath, xmlContent, 'utf-8');

    expect(fs.existsSync(targetPath)).toBe(true);
  });
});