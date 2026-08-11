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

    it('should support both string array for disallow and allow in parallel', () => {
      const robots = buildRobotsText({
        rules: {
          userAgent: 'Googlebot',
          allow: ['/public/', '/assets/'],
          disallow: ['/drafts/', '/temp/']
        }
      });

      expect(robots).toContain('Allow: /public/');
      expect(robots).toContain('Allow: /assets/');
      expect(robots).toContain('Disallow: /drafts/');
      expect(robots).toContain('Disallow: /temp/');
    });
  });
});