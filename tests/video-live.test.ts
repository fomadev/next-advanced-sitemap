/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('Google Video Live Streaming Extension (v1.1.1)', () => {
  it('should correctly render the <video:live> tag with yes/no values', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/live/stream-1',
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/thumbs/live.jpg',
            title: 'FomaDev Live Coding Session',
            description: 'Building next-advanced-sitemap features live.',
            live: 'yes'
          }
        ]
      }
    ];

    const xml = generateXml(entries);
    expect(xml).toContain('<video:live>yes</video:live>');
  });
});