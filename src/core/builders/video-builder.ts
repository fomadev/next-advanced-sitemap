/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../../types/sitemap.js';
import { escapeXml } from '../../utils/xml-escape.js';
import { sanitizeAndValidateUrl } from './url-builder.js';

export function buildVideoXml(videos: SitemapEntry['videos']): string {
  if (!videos?.length) return '';

  let xml = '';
  for (const vid of videos) {
    const cleanThumbLoc = sanitizeAndValidateUrl(vid.thumbnail_loc, 'video thumbnail');
    const cleanContentLoc = vid.content_loc ? sanitizeAndValidateUrl(vid.content_loc, 'video content location') : undefined;
    const cleanPlayerLoc = vid.player_loc ? sanitizeAndValidateUrl(vid.player_loc, 'video player location') : undefined;

    xml += `    <video:video>\n`;
    xml += `      <video:thumbnail_loc>${escapeXml(cleanThumbLoc)}</video:thumbnail_loc>\n`;
    xml += `      <video:title>${escapeXml(vid.title)}</video:title>\n`;
    xml += `      <video:description>${escapeXml(vid.description)}</video:description>\n`;
    
    if (cleanContentLoc) xml += `      <video:content_loc>${escapeXml(cleanContentLoc)}</video:content_loc>\n`;
    if (cleanPlayerLoc) xml += `      <video:player_loc>${escapeXml(cleanPlayerLoc)}</video:player_loc>\n`;
    
    if (vid.publication_date) {
      const vDate = vid.publication_date instanceof Date ? vid.publication_date.toISOString() : vid.publication_date;
      xml += `      <video:publication_date>${vDate}</video:publication_date>\n`;
    }

    // ✨ Validation et Sérialisation de la durée (0 - 28800s)
    if (vid.duration !== undefined) {
      const finalDuration = Math.floor(vid.duration);
      if (finalDuration < 0 || finalDuration > 28800) {
        throw new Error(
          `[next-advanced-sitemap] Invalid video duration: ${finalDuration}. Duration must be an integer between 0 and 28800 seconds (8 hours).`
        );
      }
      xml += `      <video:duration>${finalDuration}</video:duration>\n`;
    }

    // ✨ Validation et Sérialisation du nombre de vues (>= 0)
    if (vid.view_count !== undefined) {
      const finalViewCount = Math.floor(vid.view_count);
      if (finalViewCount < 0) {
        throw new Error(
          `[next-advanced-sitemap] Invalid video view_count: ${finalViewCount}. View count cannot be negative.`
        );
      }
      xml += `      <video:view_count>${finalViewCount}</video:view_count>\n`;
    }

    if (vid.live) {
      xml += `      <video:live>${vid.live}</video:live>\n`;
    }

    // ✨ Validation et Sérialisation des Restrictions Pays (v1.1.4)
    if (vid.restriction) {
      if (!vid.restriction.countries || vid.restriction.countries.length === 0) {
        throw new Error(
          `[next-advanced-sitemap] Invalid video restriction: countries array cannot be empty.`
        );
      }

      const cleanCountries = vid.restriction.countries.map(country => {
        const code = country.trim().toUpperCase();
        if (code.length < 2 || code.length > 3) {
          throw new Error(
            `[next-advanced-sitemap] Invalid ISO country code detected: "${country}". Must be a valid ISO 3166 code.`
          );
        }
        return code;
      });

      const countriesStr = cleanCountries.join(' ');
      xml += `      <video:restriction relationship="${vid.restriction.relationship}">${countriesStr}</video:restriction>\n`;
    }

    // ✨ Validation et Sérialisation des Plateformes (v1.1.4)
    if (vid.platform) {
      if (!vid.platform.platforms || vid.platform.platforms.length === 0) {
        throw new Error(
          `[next-advanced-sitemap] Invalid video platform: platforms array cannot be empty.`
        );
      }

      const validPlatforms = ['web', 'mobile', 'tv'];
      for (const p of vid.platform.platforms) {
        if (!validPlatforms.includes(p)) {
          throw new Error(
            `[next-advanced-sitemap] Invalid platform type: "${p}". Allowed values are 'web', 'mobile', or 'tv'.`
          );
        }
      }

      const platformsStr = vid.platform.platforms.join(' ');
      xml += `      <video:platform relationship="${vid.platform.relationship}">${platformsStr}</video:platform>\n`;
    }
    
    if (vid.requires_subscription !== undefined) {
      let subValue: 'yes' | 'no';

      if (typeof vid.requires_subscription === 'boolean') {
        subValue = vid.requires_subscription ? 'yes' : 'no';
      } else if (vid.requires_subscription === 'yes' || vid.requires_subscription === 'no') {
        subValue = vid.requires_subscription;
      } else {
        throw new Error(
          `[next-advanced-sitemap] Invalid value for requires_subscription: "${vid.requires_subscription}". Expected boolean or strict string 'yes' | 'no'.`
        );
      }

      xml += `      <video:requires_subscription>${subValue}</video:requires_subscription>\n`;
    }

    // ✨ Validation et Sérialisation des Prix et Achats (v1.1.6)
    if (vid.price) {
      const { value, currency, type } = vid.price;

      if (value === undefined || value < 0) {
        throw new Error(
          `[next-advanced-sitemap] Invalid video price value: "${value}". Value must be a positive number.`
        );
      }

      const cleanCurrency = currency ? currency.trim().toUpperCase() : '';
      if (cleanCurrency.length !== 3) {
        throw new Error(
          `[next-advanced-sitemap] Invalid ISO 4217 currency code: "${currency}". Currency must be exactly a 3-letter code.`
        );
      }

      let priceXml = `      <video:price currency="${cleanCurrency}"`;
      if (type) {
        if (type !== 'rent' && type !== 'own') {
          throw new Error(
            `[next-advanced-sitemap] Invalid price type: "${type}". Allowed values are 'rent' or 'own'.`
          );
        }
        priceXml += ` type="${type}"`;
      }
      priceXml += `>${value.toFixed(2)}</video:price>\n`;
      
      xml += priceXml;
    }

    xml += `    </video:video>\n`;
  }
  
  return xml;
}