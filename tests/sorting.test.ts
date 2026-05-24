/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('Auto-Sorting by Priority (v1.0.8)', () => {
  
  it('should sort entries from highest priority to lowest when sortByPriority is enabled', () => {
    const entries: SitemapEntry[] = [
      { url: 'https://fomadev.com/low-priority', priority: 0.2 },
      { url: 'https://fomadev.com/max-priority', priority: 1.0 },
      { url: 'https://fomadev.com/mid-priority', priority: 0.7 }
    ];

    const xml = generateXml(entries, { sortByPriority: true });
    
    // Récupération des positions des URLs dans le flux XML généré
    const positionMax = xml.indexOf('https://fomadev.com/max-priority');
    const positionMid = xml.indexOf('https://fomadev.com/mid-priority');
    const positionLow = xml.indexOf('https://fomadev.com/low-priority');

    // Plus l'index est petit, plus l'élément apparaît tôt (haut) dans le fichier
    expect(positionMax).toBeLessThan(positionMid);
    expect(positionMid).toBeLessThan(positionLow);
  });

  it('should fall back to 0.5 priority for entries without defined priority during sorting', () => {
    const entries: SitemapEntry[] = [
      { url: 'https://fomadev.com/implicit-mid-priority' }, // Pas de priorité -> doit valoir 0.5
      { url: 'https://fomadev.com/absolute-lowest', priority: 0.1 },
      { url: 'https://fomadev.com/absolute-highest', priority: 0.9 }
    ];

    const xml = generateXml(entries, { sortByPriority: true });

    const positionHighest = xml.indexOf('https://fomadev.com/absolute-highest');
    const positionImplicit = xml.indexOf('https://fomadev.com/implicit-mid-priority');
    const positionLowest = xml.indexOf('https://fomadev.com/absolute-lowest');

    // L'élément implicite (0.5) doit être coincé entre le plus haut (0.9) et le plus bas (0.1)
    expect(positionHighest).toBeLessThan(positionImplicit);
    expect(positionImplicit).toBeLessThan(positionLowest);
  });

  it('should preserve the original array order and prevent side effects (Immutability)', () => {
    const originalEntries: SitemapEntry[] = [
      { url: 'https://fomadev.com/first-but-low', priority: 0.1 },
      { url: 'https://fomadev.com/second-but-high', priority: 0.9 }
    ];

    // On exécute la fonction avec le tri activé
    generateXml(originalEntries, { sortByPriority: true });

    // On s'assure que le tableau d'origine fourni par l'utilisateur n'a PAS bougé d'un poil
    expect(originalEntries[0].url).toBe('https://fomadev.com/first-but-low');
    expect(originalEntries[1].url).toBe('https://fomadev.com/second-but-high');
  });

  it('should not sort entries if sortByPriority option is omitted or false', () => {
    const entries: SitemapEntry[] = [
      { url: 'https://fomadev.com/low', priority: 0.1 },
      { url: 'https://fomadev.com/high', priority: 0.9 }
    ];

    // On génère sans activer l'option
    const xml = generateXml(entries);

    const positionLow = xml.indexOf('https://fomadev.com/low');
    const positionHigh = xml.indexOf('https://fomadev.com/high');

    // L'ordre d'insertion doit être conservé
    expect(positionLow).toBeLessThan(positionHigh);
  });
});