/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { submitIndexNow, getIndexNowKeyResponse } from '../src/core/indexnow.js';

describe('IndexNow Client (v2.0.0)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should POST a well-formed IndexNow payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200, statusText: 'OK' }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await submitIndexNow(['https://fomadev.com/a'], { host: 'fomadev.com', key: 'abc123' });

    expect(result).toEqual({ ok: true, status: 200, statusText: 'OK' });
    expect(fetchMock).toHaveBeenCalledOnce();

    const [endpoint, init] = fetchMock.mock.calls[0];
    expect(endpoint).toBe('https://api.indexnow.org/indexnow');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toEqual({
      host: 'fomadev.com',
      key: 'abc123',
      keyLocation: 'https://fomadev.com/abc123.txt',
      urlList: ['https://fomadev.com/a'],
    });
  });

  it('should honor a custom keyLocation and endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200, statusText: 'OK' }));
    vi.stubGlobal('fetch', fetchMock);

    await submitIndexNow(['https://fomadev.com/a'], {
      host: 'fomadev.com',
      key: 'abc123',
      keyLocation: 'https://cdn.fomadev.com/abc123.txt',
      endpoint: 'https://api.bing.com/indexnow',
    });

    const [endpoint, init] = fetchMock.mock.calls[0];
    expect(endpoint).toBe('https://api.bing.com/indexnow');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.keyLocation).toBe('https://cdn.fomadev.com/abc123.txt');
  });

  it('should throw when given an empty URL list', async () => {
    await expect(submitIndexNow([], { host: 'fomadev.com', key: 'abc123' })).rejects.toThrow(/at least one URL/);
  });

  it('should throw when given more than 10,000 URLs', async () => {
    const urls = Array.from({ length: 10001 }, (_, i) => `https://fomadev.com/${i}`);
    await expect(submitIndexNow(urls, { host: 'fomadev.com', key: 'abc123' })).rejects.toThrow(/10,000/);
  });

  it('getIndexNowKeyResponse should return the raw key as text/plain', async () => {
    const response = getIndexNowKeyResponse('abc123');
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(await response.text()).toBe('abc123');
  });
});
