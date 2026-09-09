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

  it('should escape a raw ampersand exactly once (single-pass encoder)', () => {
    // Input is RAW: a single "&" becomes exactly "&amp;".
    expect(escapeXml('https://fomadev.com/search?q=next&sort=asc')).toBe(
      'https://fomadev.com/search?q=next&amp;sort=asc'
    );
  });

  it('should document that pre-escaped input is NOT auto-decoded (no double-encode surprise is hidden)', () => {
    // Contract: escapeXml is a single-pass encoder over RAW input. It does not
    // sniff or decode entities. Feeding an already-escaped value produces the
    // documented double-encoded form so callers notice and pass raw data instead.
    expect(escapeXml('&amp;')).toBe('&amp;amp;');
    expect(escapeXml('&lt;')).toBe('&amp;lt;');
  });
});