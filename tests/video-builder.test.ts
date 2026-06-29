/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { buildVideoXml } from '../src/core/builders/video-builder.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('buildVideoXml - v1.1.5 (requires_subscription)', () => {
  const baseVideo = {
    thumbnail_loc: 'https://fomadev.com/thumb.jpg',
    title: 'Test Video',
    description: 'A video description',
    publication_date: '2026-06-29T12:00:00.000Z',
  };

  it('should not render <video:requires_subscription> if it is undefined', () => {
    const videos: SitemapEntry['videos'] = [
      { ...baseVideo }
    ];

    const xml = buildVideoXml(videos);
    expect(xml).not.toContain('<video:requires_subscription>');
  });

  it('should transform boolean true to "yes"', () => {
    const videos: SitemapEntry['videos'] = [
      {
        ...baseVideo,
        requires_subscription: true,
      }
    ];

    const xml = buildVideoXml(videos);
    expect(xml).toContain('<video:requires_subscription>yes</video:requires_subscription>');
  });

  it('should transform boolean false to "no"', () => {
    const videos: SitemapEntry['videos'] = [
      {
        ...baseVideo,
        requires_subscription: false,
      }
    ];

    const xml = buildVideoXml(videos);
    expect(xml).toContain('<video:requires_subscription>no</video:requires_subscription>');
  });

  it('should allow strict string "yes"', () => {
    const videos: SitemapEntry['videos'] = [
      {
        ...baseVideo,
        requires_subscription: 'yes',
      }
    ];

    const xml = buildVideoXml(videos);
    expect(xml).toContain('<video:requires_subscription>yes</video:requires_subscription>');
  });

  it('should allow strict string "no"', () => {
    const videos: SitemapEntry['videos'] = [
      {
        ...baseVideo,
        requires_subscription: 'no',
      }
    ];

    const xml = buildVideoXml(videos);
    expect(xml).toContain('<video:requires_subscription>no</video:requires_subscription>');
  });

  it('should throw a fail-fast error when an invalid string value is passed', () => {
    const videos: SitemapEntry['videos'] = [
      {
        ...baseVideo,
        // @ts-expect-error - Testing runtime security barrier
        requires_subscription: 'maybe',
      }
    ];

    expect(() => buildVideoXml(videos)).toThrowError(
      '[next-advanced-sitemap] Invalid value for requires_subscription: "maybe". Expected boolean or strict string \'yes\' | \'no\'.'
    );
  });

  it('should throw a fail-fast error when an invalid type is passed', () => {
    const videos: SitemapEntry['videos'] = [
      {
        ...baseVideo,
        // @ts-expect-error - Testing runtime boundary exception
        requires_subscription: 42,
      }
    ];

    expect(() => buildVideoXml(videos)).toThrowError(
      '[next-advanced-sitemap] Invalid value for requires_subscription: "42". Expected boolean or strict string \'yes\' | \'no\'.'
    );
  });
});