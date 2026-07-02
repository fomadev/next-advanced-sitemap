/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { getServerSitemapResponse } from '../src/index.js';

describe('Security Framework - XML Injection & XSS Protection', () => {
  it('should strictly escape malicious cyber-payloads', async () => {
    const maliciousPayload = "</urlset><script>alert('hack')</script><news:name>Hacked & Dangerous</news:name>";

    const entries = [
      {
        url: 'https://fomadev.com',
        lastmod: new Date(),
        priority: 1.0,
        news: {
          name: maliciousPayload, 
          language: 'fr',
          publication_date: new Date(),
          title: 'DevOps Security Test',
        }
      }
    ];

    const response = await getServerSitemapResponse(entries);
    const xmlContent = await response.text();

    // 🛡️ ASSERTIONS DE SÉCURITÉ CRITIQUES
    // La balise <script> ne doit pas exister en tant que structure XML réelle
    expect(xmlContent).not.toContain("<script>");
    
    // La structure globale ne doit pas pouvoir être fermée prématurément
    expect(xmlContent).not.toContain("</urlset><");

    // Les caractères spéciaux doivent être convertis en entités XML sécurisées
    expect(xmlContent).toContain("&lt;script&gt;");
    expect(xmlContent).toContain("&lt;/urlset&gt;");
    expect(xmlContent).toContain("&amp; Dangerous");
  });
});