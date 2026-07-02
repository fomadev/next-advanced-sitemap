/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { getServerSitemapResponse } from '../src/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Recréer le comportement de __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('E2E XML Generation for CI Compliance', () => {
  it('should compile a multi-resource sitemap and write a physical fixture file', async () => {
    const mockEntries = [
      {
        url: 'https://fomadev.com/news/fintech-drc',
        priority: 1.0,
        news: {
          name: 'FomaDev Insights',
          language: 'fr',
          publication_date: new Date('2026-07-02T10:00:00.000Z'),
          title: 'The Rise of FinTech Infrastructure in Central Africa & DRC',
          stock_tickers: ['NASDAQ:AAPL', 'NYSE:BABA']
        },
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/thumb.jpg',
            title: 'Masterclass Pricing and Paywall Architecture',
            description: 'Deep dive into next-advanced-sitemap design schemas.',
            publication_date: '2026-07-02T10:00:00.000Z',
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

    // 🎯 CHEMIN ABSOLU SÉCURISÉ : On cible 'tests/fixtures' à la racine du projet
    const targetDir = path.resolve(__dirname, 'fixtures');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, 'sitemap.xml');
    fs.writeFileSync(targetPath, xmlContent, 'utf-8');

    expect(fs.existsSync(targetPath)).toBe(true);
  });
});