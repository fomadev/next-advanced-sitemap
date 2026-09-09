/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('v1.1.9 Cross-Field Validation Suite', () => {
  
  it('should throw an error if a live video has a static duration', () => {
    const invalidEntry: SitemapEntry[] = [{
      url: 'https://fomadev.com/live',
      videos: [{
        thumbnail_loc: 'https://fomadev.com/thumb.jpg',
        title: 'FomaDev Live Dev Stream',
        description: 'Building tools live.',
        live: 'yes',
        duration: 3600 // Erreur ! Un flux live ne peut pas avoir de durée fixe
      }]
    }];

    expect(() => generateXml(invalidEntry)).toThrowError(
      '[next-advanced-sitemap] Cross-field validation error'
    );
  });

  it('should throw an error if a video requires a subscription but is sold for ownership', () => {
    const invalidEntry: SitemapEntry[] = [{
      url: 'https://fomadev.com/premium-video',
      videos: [{
        thumbnail_loc: 'https://fomadev.com/thumb.jpg',
        title: 'Premium Masterclass',
        description: 'Advanced engineering systems.',
        requires_subscription: 'yes',
        price: {
          value: 49.99,
          currency: 'USD',
          type: 'own' // Conflit sémantique direct
        }
      }]
    }];

    expect(() => generateXml(invalidEntry)).toThrowError(
      '[next-advanced-sitemap] Cross-field validation error'
    );
  });

  it('should throw an error if a video requires a subscription (boolean true) but is sold for ownership', () => {
    const invalidEntry: SitemapEntry[] = [{
      url: 'https://fomadev.com/premium-video-boolean',
      videos: [{
        thumbnail_loc: 'https://fomadev.com/thumb.jpg',
        title: 'Premium Masterclass Boolean',
        description: 'Advanced engineering systems.',
        requires_subscription: true,
        price: {
          value: 49.99,
          currency: 'USD',
          type: 'own'
        }
      }]
    }];

    expect(() => generateXml(invalidEntry)).toThrowError(
      '[next-advanced-sitemap] Cross-field validation error'
    );
  });

  it('should not throw an error if requires_subscription is false with price type own', () => {
    const validEntry: SitemapEntry[] = [{
      url: 'https://fomadev.com/premium-video-not-sub',
      videos: [{
        thumbnail_loc: 'https://fomadev.com/thumb.jpg',
        title: 'Purchasable Video',
        description: 'Advanced engineering systems.',
        requires_subscription: false,
        price: {
          value: 49.99,
          currency: 'USD',
          type: 'own'
        }
      }]
    }];

    expect(() => generateXml(validEntry)).not.toThrow();
  });

  it('should throw an error if a Google News article is older than 48 hours', () => {
    const dynamicPastDate = new Date();
    dynamicPastDate.setDate(dynamicPastDate.getDate() - 5); // 5 jours en arrière

    const invalidEntry: SitemapEntry[] = [{
      url: 'https://fomadev.com/news/old-story',
      news: {
        name: 'FomaDev Journal',
        language: 'fr',
        title: 'Ancienne annonce système',
        publication_date: dynamicPastDate
      }
    }];

    expect(() => generateXml(invalidEntry)).toThrowError(
      '[next-advanced-sitemap] Cross-field validation error'
    );
  });

  it('should complete successfully if all conditions are met', () => {
    const validEntry: SitemapEntry[] = [{
      url: 'https://fomadev.com/news/fresh-story',
      news: {
        name: 'FomaDev Tech',
        language: 'fr',
        title: 'Inauguration de la Sandbox v1.1.9',
        publication_date: new Date() // Article du jour
      }
    }];

    const xml = generateXml(validEntry);
    expect(xml).toContain('<news:news>');
  });
});