/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { escapeXml } from '../src/utils/xml-escape.js';

describe('XML Escape Advanced', () => {
  it('should escape complex strings', () => {
    const input = 'This & that < > "quoted" \'item\'';
    const expected = 'This &amp; that &lt; &gt; &quot;quoted&quot; &apos;item&apos;';
    expect(escapeXml(input)).toBe(expected);
  });

  it('should handle empty or undefined values', () => {
    expect(escapeXml(undefined)).toBe('');
    expect(escapeXml(null)).toBe('');
  });
});