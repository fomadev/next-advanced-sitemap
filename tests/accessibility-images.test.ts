/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, test, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('v1.1.2 : Métadonnées d\'Accessibilité Images', () => {
  test('devrait générer le XML sans caption ni title s\'ils sont absents', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/produit-1',
        images: [
          { loc: 'https://fomadev.com/images/produit-1.jpg' }
        ]
      }
    ];

    const xml = generateXml(entries);
    expect(xml).toContain('<image:loc>https://fomadev.com/images/produit-1.jpg</image:loc>');
    expect(xml).not.toContain('<image:caption>');
    expect(xml).not.toContain('<image:title>');
  });

  test('devrait échapper drastiquement les caractères spéciaux e-commerce dans caption et title', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/produit-2',
        images: [
          {
            loc: 'https://fomadev.com/images/produit-2.jpg',
            title: 'Écran PC & Gaming 27" - Haut de Gamme',
            caption: 'Profitez d\'un affichage <Ultra-HD> pour vos sessions "Pro".'
          }
        ]
      }
    ];

    const xml = generateXml(entries);
    
    // Vérification de l'échappement du titre (& -> &amp;, " -> &quot;)
    expect(xml).toContain('<image:title>Écran PC &amp; Gaming 27&quot; - Haut de Gamme</image:title>');
    
    // Vérification de l'échappement de la légende (< > -> &lt; &gt;, ' -> &apos;, " -> &quot;)
    expect(xml).toContain('<image:caption>Profitez d&apos;un affichage &lt;Ultra-HD&gt; pour vos sessions &quot;Pro&quot;.</image:caption>');
  });
});