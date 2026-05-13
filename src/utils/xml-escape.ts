/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Convertit les caractères spéciaux en entités XML pour éviter la corruption du fichier.
 * Gère : <, >, &, ", '
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