/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

export interface IndexNowOptions {
  /** The host your URLs belong to, e.g. "fomadev.com" (no protocol). */
  host: string;
  /** Your IndexNow API key (a random hex/alphanumeric string you generate once). */
  key: string;
  /**
   * Public URL where the key file is hosted for verification, e.g.
   * `https://fomadev.com/<key>.txt`. Defaults to `https://<host>/<key>.txt`.
   */
  keyLocation?: string;
  /** IndexNow endpoint. Defaults to the shared multi-engine endpoint. */
  endpoint?: string;
}

export interface IndexNowSubmitResult {
  ok: boolean;
  status: number;
  statusText: string;
}

const DEFAULT_ENDPOINT = 'https://api.indexnow.org/indexnow';

/**
 * Submits a batch of URLs to the IndexNow protocol, instantly notifying
 * Bing, Yandex, Seznam and any other participating search engine that
 * they changed — instead of waiting for the next scheduled crawl.
 *
 * @see https://www.indexnow.org/documentation
 * v2.0.0 (inspired by the "IndexNow" v2.5.0 roadmap item).
 */
export async function submitIndexNow(urls: string[], options: IndexNowOptions): Promise<IndexNowSubmitResult> {
  if (urls.length === 0) {
    throw new Error('[next-advanced-sitemap] submitIndexNow(): at least one URL is required.');
  }
  if (urls.length > 10000) {
    throw new Error('[next-advanced-sitemap] submitIndexNow(): IndexNow accepts a maximum of 10,000 URLs per submission.');
  }

  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const keyLocation = options.keyLocation ?? `https://${options.host}/${options.key}.txt`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: options.host,
      key: options.key,
      keyLocation,
      urlList: urls,
    }),
  });

  return { ok: response.ok, status: response.status, statusText: response.statusText };
}

/**
 * Generates the plain-text Response for the IndexNow key verification route
 * (`app/[key].txt/route.ts`). The response body must be exactly the key
 * itself for IndexNow to trust your `keyLocation`.
 *
 * v2.0.0.
 */
export function getIndexNowKeyResponse(key: string): Response {
  return new Response(key, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
