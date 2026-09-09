/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Escapes XML special characters into their entities to prevent file corruption.
 * Handles: <, >, &, ", '
 *
 * IMPORTANT (v1.3.10): Input MUST always be RAW / UNESCAPED text.
 * This is a single-pass strict encoder: it does NOT attempt to detect or decode
 * pre-escaped input. Passing already-escaped content such as `&amp;` will produce
 * `&amp;amp;` (double-encoding). Always feed the original unescaped value (e.g.
 * a raw URL containing `&` becomes `&amp;` in the output — never pass `&amp;`).
 */
export function escapeXml(unsafe: string | undefined | null): string {
  if (!unsafe) return '';
  
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
}