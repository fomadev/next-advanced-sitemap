import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator';

describe('generateXml', () => {
  it('should generate a valid sitemap with images', () => {
    const entries = [
      {
        url: 'https://fomadev.com/dashboard',
        images: [{ loc: 'https://fomadev.com/chart.png', title: 'Stats' }]
      }
    ];
    const result = generateXml(entries);
    
    expect(result).toContain('<image:image>');
    expect(result).toContain('<image:loc>https://fomadev.com/chart.png</image:loc>');
    expect(result).toContain('<image:title>Stats</image:title>');
  });
});