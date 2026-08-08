/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  // Génère des fichiers de types distincts (.d.ts pour ESM et .d.cts pour CJS)
  dts: {
    resolve: true,
    compilerOptions: {
      ignoreDeprecations: '6.0'
    }
  },
  splitting: false,
  sourcemap: true,
  clean: true,
});