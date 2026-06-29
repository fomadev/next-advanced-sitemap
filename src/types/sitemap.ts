/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Fréquences de changement autorisées dans la spécification des sitemaps
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
 * Priorités recommandées (de 0.0 à 1.0)
 * L'intersection (number & {}) permet de conserver l'autocomplétion des paliers
 * tout en acceptant n'importe quel autre nombre flottant.
 */
export type SitemapPriority = 
  | 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0
  | (number & {});

/**
 * Interface pour les liens alternatifs (Hreflang / Multilingue)
 * @see https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap
 */
export interface SitemapAlternate {
  hreflang: string;
  href: string;
}

/**
 * Interface pour les images dans le sitemap avec support SEO Local et Licences (v1.1.0)
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */
export interface SitemapImage {
  loc: string;
  caption?: string;
  title?: string;
  /** (Optional) v1.1.0: Description géographique de l'image (ex: "Kinshasa, DRC"). */
  geo_location?: string;
  /** (Optional) v1.1.0: URL pointant vers les conditions d'utilisation ou le contrat de licence de l'image. */
  license?: string;
}

/**
 * Interface pour les restrictions géographiques des vidéos (v1.1.4)
 */
export interface VideoRestriction {
  relationship: 'allow' | 'deny';
  /** Tableau de codes pays ISO 3166-1 alpha-2 (ex: ['FR', 'US', 'CA']) */
  countries: string[];
}

/**
 * Interface pour les restrictions de plateformes des vidéos (v1.1.4)
 */
export interface VideoPlatform {
  relationship: 'allow' | 'deny';
  /** Tableau de plateformes autorisées ou interdites */
  platforms: ('web' | 'mobile' | 'tv')[];
}

/**
 * Interface pour les vidéos dans le sitemap
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
 */
export interface SitemapVideo {
  thumbnail_loc: string;
  title: string;
  description: string;
  content_loc?: string;
  player_loc?: string;
  publication_date?: Date | string;
  family_friendly?: 'yes' | 'no';
  /** (Optional) v1.1.1: Indique si la vidéo est une diffusion en direct ('yes' ou 'no'). */
  live?: 'yes' | 'no';
  /** (Optional) v1.1.3: La durée de la vidéo en secondes. */
  duration?: number;
  /** (Optional) v1.1.3: Le nombre de vues de la vidéo. */
  view_count?: number;
  /** (Optional) v1.1.4: Restriction géographique de diffusion (ISO 3166-1 alpha-2). */
  restriction?: VideoRestriction;
  /** (Optional) v1.1.4: Restriction selon le type d'appareil / plateforme. */
  platform?: VideoPlatform;
  /**
   * v1.1.5 : Indique si l'accès à la vidéo nécessite un abonnement payant.
   * Accepte true/false ou de manière stricte 'yes'/'no'.
   * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
   */
  requires_subscription?: boolean | 'yes' | 'no';
}

/**
 * Interface pour Google News
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemaps
 */
export interface SitemapNews {
  name: string;
  language: string;
  publication_date: Date | string;
  title: string;
}

/**
 * Interface principale représentant une entrée du sitemap
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
 * Options de configuration pour la génération du sitemap
 */
export interface SitemapOptions {
  /**
   * Si true, injecte la date système actuelle (ISO) pour toutes les entrées 
   * qui n'ont pas de champ 'lastmod' défini.
   */
  autoLastmod?: boolean;
  /**
   * Si true, trie le tableau des URLs de la priorité la plus haute (1.0) 
   * à la plus basse (0.0) avant de lancer la génération du flux XML.
   * Les entrées sans priorité héritent d'une valeur par défaut de 0.5.
   */
  sortByPriority?: boolean; // Option ajoutée pour la v1.0.8
  /**
   * Durée maximale de mise en cache (TTL) exprimée en secondes.
   * Si définie, l'en-tête Cache-Control prendra la forme : public, max-age=X, must-revalidate.
   * Si omise, conserve la stratégie par défaut hautement performante pour CDN.
   */
  maxAge?: number; // Option ajoutée pour la v1.0.9
}