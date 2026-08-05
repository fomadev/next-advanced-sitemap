/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { RobotsOptions, RobotsRule } from '../../types/robots.js';

/**
 * Génère le contenu texte brut pour le fichier robots.txt.
 * v1.3.0 : Integration native du helper Robots.txt.
 */
export function buildRobotsText(options: RobotsOptions): string {
  const buffer: string[] = [];
  const rules = Array.isArray(options.rules) ? options.rules : [options.rules];

  for (const rule of rules) {
    const userAgents = Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent];
    for (const agent of userAgents) {
      buffer.push(`User-agent: ${agent}\n`);
    }

    if (rule.allow) {
      const allows = Array.isArray(rule.allow) ? rule.allow : [rule.allow];
      for (const path of allows) {
        buffer.push(`Allow: ${path}\n`);
      }
    }

    if (rule.disallow) {
      const disallows = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
      for (const path of disallows) {
        buffer.push(`Disallow: ${path}\n`);
      }
    }

    if (rule.crawlDelay !== undefined) {
      buffer.push(`Crawl-delay: ${rule.crawlDelay}\n`);
    }

    buffer.push('\n');
  }

  if (options.host) {
    buffer.push(`Host: ${options.host}\n`);
  }

  if (options.sitemap) {
    const sitemaps = Array.isArray(options.sitemap) ? options.sitemap : [options.sitemap];
    for (const sm of sitemaps) {
      buffer.push(`Sitemap: ${sm}\n`);
    }
  }

  return buffer.join('').trimEnd();
}