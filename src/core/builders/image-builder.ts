/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../../types/sitemap.js';
import { escapeXml } from '../../utils/xml-escape.js';
import { sanitizeAndValidateUrl } from './url-builder.js';

export function buildImageXml(images: SitemapEntry['images']): string {
  if (!images?.length) return '';

  let xml = '';
  for (const img of images) {
    const cleanImgUrl = sanitizeAndValidateUrl(img.loc, 'image location');
    
    xml += `    <image:image>\n`;
    xml += `      <image:loc>${escapeXml(cleanImgUrl)}</image:loc>\n`;
    
    if (img.title && img.title.trim() !== '') {
      xml += `      <image:title>${escapeXml(img.title.trim())}</image:title>\n`;
    }
    if (img.caption && img.caption.trim() !== '') {
      xml += `      <image:caption>${escapeXml(img.caption.trim())}</image:caption>\n`;
    }
    
    if (img.geo_location && img.geo_location.trim() !== '') {
      xml += `      <image:geo_location>${escapeXml(img.geo_location.trim())}</image:geo_location>\n`;
    }
    
    if (img.license) {
      const cleanLicenseUrl = sanitizeAndValidateUrl(img.license, 'image license URL');
      xml += `      <image:license>${escapeXml(cleanLicenseUrl)}</image:license>\n`;
    }
    
    xml += `    </image:image>\n`;
  }
  
  return xml;
}