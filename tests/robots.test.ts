/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { buildRobotsText, KnownUserAgent } from '../src/index.js';

describe('v1.3.x Robots.txt Helper Suite', () => {
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

  describe('User-Agent Autocomplete & Strict Typing (v1.3.2)', () => {
    it('should correctly format rules with known user agents and custom crawlers', () => {
      const knownAgents: KnownUserAgent[] = ['Googlebot', 'GPTBot', 'ClaudeBot', 'CustomBot/1.0'];

      const robots = buildRobotsText({
        rules: [
          { userAgent: knownAgents[0], allow: '/' },
          { userAgent: [knownAgents[1], knownAgents[2]], disallow: '/' },
          { userAgent: knownAgents[3], allow: '/public/' }
        ]
      });

      expect(robots).toContain('User-agent: Googlebot');
      expect(robots).toContain('User-agent: GPTBot');
      expect(robots).toContain('User-agent: ClaudeBot');
      expect(robots).toContain('User-agent: CustomBot/1.0');
    });
  });

  describe('Disallow Array Mapping (v1.3.4)', () => {
    it('should seamlessly map an array of disallowed paths into standard single-line directives', () => {
      const robots = buildRobotsText({
        rules: {
          userAgent: '*',
          disallow: ['/admin', '/api', '/private/', '/dashboard/settings']
        },
        sitemap: 'https://fomadev.com/sitemap.xml'
      });

      const expectedBlock = [
        'User-agent: *',
        'Disallow: /admin',
        'Disallow: /api',
        'Disallow: /private/',
        'Disallow: /dashboard/settings'
      ].join('\n');

      expect(robots).toContain(expectedBlock);
    });
  });

  describe('Multi-Sitemap Directives (v1.3.5)', () => {
    it('should declare multiple sitemaps (standard, news, index) sequentially', () => {
      const robots = buildRobotsText({
        rules: { userAgent: '*', allow: '/' },
        sitemap: [
          'https://fomadev.com/sitemap-index.xml',
          'https://fomadev.com/news-sitemap.xml',
          'https://fomadev.com/video-sitemap.xml'
        ]
      });

      expect(robots).toContain('Host: https://fomadev.com');
      expect(robots).toContain('Sitemap: https://fomadev.com/sitemap-index.xml');
      expect(robots).toContain('Sitemap: https://fomadev.com/news-sitemap.xml');
      expect(robots).toContain('Sitemap: https://fomadev.com/video-sitemap.xml');
    });
  });

  describe('Explicit Allow Directives & Sub-route Overrides (v1.3.6)', () => {
    it('should allow override of specific sub-routes within blocked parent directories', () => {
      const robots = buildRobotsText({
        rules: {
          userAgent: '*',
          disallow: ['/assets/', '/private/'],
          allow: ['/assets/open-graph/', '/private/public-doc.pdf']
        },
        sitemap: 'https://fomadev.com/sitemap.xml'
      });

      expect(robots).toContain('Allow: /assets/open-graph/');
      expect(robots).toContain('Allow: /private/public-doc.pdf');
      expect(robots).toContain('Disallow: /assets/');
      expect(robots).toContain('Disallow: /private/');
    });
  });

  describe('Crawl-Delay Directive (v1.3.7)', () => {
    it('should correctly output Crawl-delay for rate-limiting aggressive bots', () => {
      const robots = buildRobotsText({
        rules: [
          { userAgent: 'Bingbot', allow: '/', crawlDelay: 10 },
          { userAgent: 'Baiduspider', disallow: '/api/', crawlDelay: 5 }
        ],
        sitemap: 'https://fomadev.com/sitemap.xml'
      });

      expect(robots).toContain('User-agent: Bingbot\nAllow: /\nCrawl-delay: 10');
      expect(robots).toContain('User-agent: Baiduspider\nDisallow: /api/\nCrawl-delay: 5');
    });
  });
});