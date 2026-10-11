/*
 * Copyright (c) 2026 Fordima Inc. All rights reserved.
 * Licensed under the Fordima Public License (FPL) v1.0.
 * See the LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('v1.1.3: Video Metrics Validation & Serialization (duration & view_count)', () => {
  
  it('should successfully include video duration and view_count when they are valid', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/video-page',
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/thumb.jpg',
            title: 'Valid Video Metrics',
            description: 'Testing standard duration and views injection.',
            publication_date: '2026-06-27T12:00:00.000Z',
            duration: 3600,
            view_count: 1420
          }
        ]
      }
    ];

    const xml = generateXml(entries);

    expect(xml).toContain('<video:duration>3600</video:duration>');
    expect(xml).toContain('<video:view_count>1420</video:view_count>');
  });

  it('should automatically truncate decimal values using Math.floor', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/video-decimals',
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/thumb.jpg',
            title: 'Decimal Video Metrics',
            description: 'Testing automatic truncation behavior.',
            publication_date: '2026-06-27T12:00:00.000Z',
            duration: 125.75,   // Devrait devenir 125
            view_count: 850.99  // Devrait devenir 850
          }
        ]
      }
    ];

    const xml = generateXml(entries);

    expect(xml).toContain('<video:duration>125</video:duration>');
    expect(xml).toContain('<video:view_count>850</video:view_count>');
    expect(xml).not.toContain('125.75');
    expect(xml).not.toContain('850.99');
  });

  it('should throw an error if the video duration is negative', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/invalid-duration-neg',
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/thumb.jpg',
            title: 'Negative Duration Video',
            description: 'This test should fail generation safely.',
            publication_date: '2026-06-27T12:00:00.000Z',
            duration: -10
          }
        ]
      }
    ];

    expect(() => generateXml(entries)).toThrowError(
      '[next-advanced-sitemap] Invalid video duration: -10. Duration must be an integer between 0 and 28800 seconds (8 hours).'
    );
  });

  it('should throw an error if the video duration exceeds 28800 seconds (8 hours)', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/invalid-duration-max',
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/thumb.jpg',
            title: 'Too Long Video',
            description: 'Exceeding Google standard boundaries.',
            publication_date: '2026-06-27T12:00:00.000Z',
            duration: 30000 // Supérieur à 28800
          }
        ]
      }
    ];

    expect(() => generateXml(entries)).toThrowError(
      '[next-advanced-sitemap] Invalid video duration: 30000. Duration must be an integer between 0 and 28800 seconds (8 hours).'
    );
  });

  it('should throw an error if the video view_count is negative', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/invalid-views',
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/thumb.jpg',
            title: 'Negative Views Video',
            description: 'This test should fail generation safely.',
            publication_date: '2026-06-27T12:00:00.000Z',
            view_count: -150
          }
        ]
      }
    ];

    expect(() => generateXml(entries)).toThrowError(
      '[next-advanced-sitemap] Invalid video view_count: -150. View count cannot be negative.'
    );
  });
});