/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Allowed change frequency values from the sitemap protocol specification
 */
export type SitemapChangeFreq = 
  | 'always' 
  | 'hourly' 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'yearly' 
  | 'never';

/**
 * Recommended priorities (from 0.0 to 1.0)
 * The (number & {}) intersection keeps IDE autocompletion for common steps
 * while still accepting any other floating-point number.
 */
export type SitemapPriority = 
  | 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0
  | (number & {});

/**
 * Interface for alternate links (Hreflang / Multilingual)
 * @see https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap
 */
export interface SitemapAlternate {
  hreflang: string;
  href: string;
}

/**
 * Interface for sitemap images with Local SEO and License support (v1.1.0)
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */
export interface SitemapImage {
  loc: string;
  caption?: string;
  title?: string;
  /** (Optional) v1.1.0: Geographic description of the image (e.g. "Kinshasa, DRC"). */
  geo_location?: string;
  /** (Optional) v1.1.0: URL pointing to the image's usage terms or license contract. */
  license?: string;
}

/**
 * Interface for geographic restrictions on videos (v1.1.4)
 */
export interface VideoRestriction {
  relationship: 'allow' | 'deny';
  /** Array of ISO 3166-1 alpha-2 country codes (e.g. ['FR', 'US', 'CA']) */
  countries: string[];
}

/**
 * Interface for video platform restrictions (v1.1.4)
 */
export interface VideoPlatform {
  relationship: 'allow' | 'deny';
  /** Array of allowed or disallowed platforms */
  platforms: ('web' | 'mobile' | 'tv')[];
}

export interface VideoPrice {
  /** Numeric price value (e.g. 9.99) */
  value: number;
  /** ISO 4217 3-letter currency code (e.g. 'USD', 'EUR', 'CDF') */
  currency: string;
  /** Optional: Transaction type, either 'rent' or 'own' (purchase) */
  type?: 'rent' | 'own';
}

/**
 * Interface for videos in the sitemap
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
 */
export interface SitemapVideo {
  thumbnail_loc: string;
  title: string;
  description: string;
  content_loc?: string;
  player_loc?: string;
  publication_date?: Date | string;
  /** (Optional) Indicates whether the video is SafeSearch-compatible ('yes' | 'no' or boolean). */
  family_friendly?: boolean | 'yes' | 'no';
  /** (Optional) v1.1.1: Indicates whether the video is a live stream ('yes' or 'no'). */
  live?: 'yes' | 'no';
  /** (Optional) v1.1.3: Video duration in seconds. */
  duration?: number;
  /** (Optional) v1.1.3: Number of video views. */
  view_count?: number;
  /** (Optional) v1.1.4: Geographic broadcast restriction (ISO 3166-1 alpha-2). */
  restriction?: VideoRestriction;
  /** (Optional) v1.1.4: Restriction by device / platform type. */
  platform?: VideoPlatform;
  /**
   * v1.1.5: Indicates whether accessing the video requires a paid subscription.
   * Accepts true/false or, strictly, 'yes'/'no'.
   * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
   */
  requires_subscription?: boolean | 'yes' | 'no';
  /**
   * v1.1.6: Video pricing for purchase or rental (VOD).
   * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
   */
  price?: VideoPrice;
  /** 
   * ✨ v1.1.7: General thematic category of the video (e.g. 'Education', 'Technology'). 
   * Maximum 256 characters.
   */
  category?: string;
  /** 
   * ✨ v1.1.7: Keywords describing the video. 
   * Array of strings, limited to 32 tags per video.
   */
  tags?: string[];
}

/**
 * Interface for Google News
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemaps
 */
export interface SitemapNews {
  name: string;
  language: string;
  publication_date: Date | string;
  title: string;
  /**
   * ✨ v1.1.8: List of stock ticker symbols associated with the article.
   * Example: ['NASDAQ:AAPL', 'NYSE:GE']
   * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
   */
  stock_tickers?: string[];
}

/**
 * Main interface representing a sitemap entry
 */
export interface SitemapEntry {
  url: string;
  lastmod?: string | Date;
  changefreq?: SitemapChangeFreq;
  priority?: SitemapPriority;
  images?: SitemapImage[];
  videos?: SitemapVideo[];
  news?: SitemapNews;
  alternates?: SitemapAlternate[];
}

/**
 * Configuration options for sitemap generation
 */
export interface SitemapOptions {
  /**
   * If true, injects the current system date (ISO) for every entry
   * that does not define a 'lastmod' field.
   */
  autoLastmod?: boolean;
  /**
   * If true, sorts the URL array from the highest priority (1.0)
   * to the lowest (0.0) before generating the XML stream.
   * Entries without a priority default to 0.5.
   */
  sortByPriority?: boolean; // Option added in v1.0.8
  /**
   * Maximum cache duration (TTL) expressed in seconds.
   * If defined, the Cache-Control header becomes: public, max-age=X, must-revalidate.
   * If omitted, keeps the highly-performant default CDN strategy.
   */
  maxAge?: number; // Option added in v1.0.9
}

/**
 * Interface for an individual entry within a sitemap index
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps
 */
export interface SitemapIndexEntry {
  /** Absolute URL of the child sitemap (e.g. 'https://fomadev.com/sitemap-videos.xml') */
  loc: string;
  /** Last modification date of the child sitemap */
  lastmod?: string | Date;
}