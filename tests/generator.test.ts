import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('generateXml', () => {
  
  it('must generate a valid sitemap with images', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/dashboard',
        images: [{ loc: 'https://fomadev.com/hero.jpg', title: 'Stats' }]
      }
    ];
    const result = generateXml(entries);
    
    expect(result).toContain('<image:image>');
    expect(result).toContain('<image:loc>https://fomadev.com/hero.jpg</image:loc>');
    expect(result).toContain('<image:title>Stats</image:title>');
  });

  it('must generate video tags correctly', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/tuto',
        videos: [{
          thumbnail_loc: 'https://fomadev.com/thumb.jpg',
          title: 'Apprendre Next.js',
          description: 'A great video tutorial'
        }]
      }
    ];
    const result = generateXml(entries);

    expect(result).toContain('<video:video>');
    expect(result).toContain('<video:title>Apprendre Next.js</video:title>');
    expect(result).toContain('<video:thumbnail_loc>https://fomadev.com/thumb.jpg</video:thumbnail_loc>');
  });

  it('must generate Google News tags', () => {
    const date = new Date('2026-04-22');
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/news/atlas',
        news: {
          name: 'FomaDev News',
          language: 'fr',
          publication_date: date,
          title: 'Next-advanced-sitemap output'
        }
      }
    ];
    const result = generateXml(entries);

    expect(result).toContain('<news:news>');
    expect(result).toContain('<news:name>FomaDev News</news:name>');
    expect(result).toContain(date.toISOString());
  });

  it('must escape special characters to avoid breaking the XML', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://site.com/search?q=next&sort=asc', // The & must be escaped
        images: [{ loc: 'https://site.com/img.jpg', title: 'Jean & Jacques' }]
      }
    ];
    const result = generateXml(entries);

    expect(result).toContain('search?q=next&amp;sort=asc');
    expect(result).toContain('Jean &amp; Jacques');
  });
});