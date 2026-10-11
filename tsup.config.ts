/*
 * Copyright (c) 2026 Fordima Inc. All rights reserved.
 * Licensed under the Fordima Public License (FPL) v1.0.
 * See the LICENSE file in the project root for full license information.
 */

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    scanner: 'src/scanner-entry.ts',
  },
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