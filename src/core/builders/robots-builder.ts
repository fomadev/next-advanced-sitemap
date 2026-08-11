/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { RobotsOptions } from '../../types/robots.js';

/**
 * Extraire l'origine (protocol + host) depuis une URL absolue.
 */
function extractRootDomain(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return null;
  }
}

/**
 * Génère le contenu texte brut pour le fichier robots.txt.
 * v1.3.0 : Intégration native du helper Robots.txt.
 * v1.3.1 : Détection et chaînage automatique du domaine racine (Root Domain Auto-Discovery).
 * v1.3.2 : Typage strict KnownUserAgent avec autocomplétion IDE.
 * v1.3.4 : Mapping automatique de tableaux pour les directives d'exclusion (Disallow Array Mapping).
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
        if (path) buffer.push(`Allow: ${path}\n`);
      }
    }

    // 🚀 v1.3.4 : Transformation propre des directives Disallow fournies sous forme de tableau
    if (rule.disallow) {
      const disallows = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
      for (const path of disallows) {
        if (path) buffer.push(`Disallow: ${path}\n`);
      }
    }

    if (rule.crawlDelay !== undefined) {
      buffer.push(`Crawl-delay: ${rule.crawlDelay}\n`);
    }

    buffer.push('\n');
  }

  // Auto-détection du domaine racine si non spécifié explicitement
  let effectiveHost = options.host;
  const sitemaps = options.sitemap
    ? Array.isArray(options.sitemap)
      ? options.sitemap
      : [options.sitemap]
    : [];

  if (!effectiveHost && sitemaps.length > 0) {
    const autoDetectedHost = extractRootDomain(sitemaps[0]);
    if (autoDetectedHost) {
      effectiveHost = autoDetectedHost;
    }
  }

  if (effectiveHost) {
    buffer.push(`Host: ${effectiveHost}\n`);
  }

  if (sitemaps.length > 0) {
    for (const sm of sitemaps) {
      buffer.push(`Sitemap: ${sm}\n`);
    }
  }

  return buffer.join('').trimEnd();
}