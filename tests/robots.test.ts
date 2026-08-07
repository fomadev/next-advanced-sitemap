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
});