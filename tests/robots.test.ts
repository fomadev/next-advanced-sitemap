/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { buildRobotsText } from '../src/index.js';

describe('v1.3.x Robots.txt Helper & Auto-Domain Chaining Suite', () => {
  it('should generate standard robots.txt with single user-agent and sitemap directive', () => {
    const robots = buildRobotsText({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/admin/'
      },
      sitemap: 'https://fomadev.com/sitemap.xml'
    });

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Disallow: /admin/');
    expect(robots).toContain('Sitemap: https://fomadev.com/sitemap.xml');
  });

  describe('Root Domain Auto-Discovery (v1.3.1)', () => {
    it('should automatically deduce Host directive from sitemap URL if host parameter is omitted', () => {
      const robots = buildRobotsText({
        rules: { userAgent: '*', allow: '/' },
        sitemap: 'https://staging.fomadev.com/sitemap.xml'
      });

      expect(robots).toContain('Host: https://staging.fomadev.com');
      expect(robots).toContain('Sitemap: https://staging.fomadev.com/sitemap.xml');
    });

    it('should prioritize explicit host option over auto-detected sitemap domain', () => {
      const robots = buildRobotsText({
        rules: { userAgent: '*', allow: '/' },
        host: 'https://custom-domain.com',
        sitemap: 'https://cdn.fomadev.com/sitemap.xml'
      });

      expect(robots).toContain('Host: https://custom-domain.com');
      expect(robots).toContain('Sitemap: https://cdn.fomadev.com/sitemap.xml');
    });
  });
});