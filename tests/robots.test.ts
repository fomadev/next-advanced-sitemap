/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { buildRobotsText } from '../src/index.js';

describe('v1.3.0 Robots.txt Helper Suite', () => {
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

  it('should support multiple sitemaps and custom user agents', () => {
    const robots = buildRobotsText({
      rules: [
        { userAgent: 'Googlebot', allow: '/' },
        { userAgent: 'Bingbot', disallow: '/private/' }
      ],
      sitemap: [
        'https://fomadev.com/sitemap-1.xml',
        'https://fomadev.com/sitemap-2.xml'
      ],
      host: 'https://fomadev.com'
    });

    expect(robots).toContain('User-agent: Googlebot');
    expect(robots).toContain('User-agent: Bingbot');
    expect(robots).toContain('Host: https://fomadev.com');
    expect(robots).toContain('Sitemap: https://fomadev.com/sitemap-1.xml');
    expect(robots).toContain('Sitemap: https://fomadev.com/sitemap-2.xml');
  });
});