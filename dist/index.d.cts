/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Fréquences de changement autorisées dans la spécification des sitemaps
 */
type SitemapChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
/**
 * Priorités recommandées (de 0.0 à 1.0)
 * L'intersection (number & {}) permet de conserver l'autocomplétion des paliers
 * tout en acceptant n'importe quel autre nombre flottant.
 */
type SitemapPriority = 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0 | (number & {});
/**
 * Interface pour les liens alternatifs (Hreflang / Multilingue)
 * @see https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap
 */
interface SitemapAlternate {
    hreflang: string;
    href: string;
}
/**
 * Interface pour les images dans le sitemap
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */
interface SitemapImage {
    loc: string;
    caption?: string;
    title?: string;
    geoLocation?: string;
    license?: string;
}
/**
 * Interface pour les vidéos dans le sitemap
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
 */
interface SitemapVideo {
    thumbnail_loc: string;
    title: string;
    description: string;
    content_loc?: string;
    player_loc?: string;
    duration?: number;
    view_count?: number;
    publication_date?: Date | string;
    family_friendly?: 'yes' | 'no';
}
/**
 * Interface pour Google News
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemaps
 */
interface SitemapNews {
    name: string;
    language: string;
    publication_date: Date | string;
    title: string;
}
/**
 * Interface principale représentant une entrée du sitemap
 */
interface SitemapEntry {
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
interface SitemapOptions {
    /**
     * Si true, injecte la date système actuelle (ISO) pour toutes les entrées
     * qui n'ont pas de champ 'lastmod' défini.
     */
    autoLastmod?: boolean;
}

/**
 * Génère une réponse HTTP compatible Next.js (App Router) avec options de configuration.
 * * @param entries - Liste des entrées du sitemap
 * @param options - Options de génération facultatives (ex: autoLastmod)
 * @returns Une instance de Response contenant le flux XML configuré
 */
declare function getServerSitemapResponse(entries: SitemapEntry[], options?: SitemapOptions): Response;

export { type SitemapAlternate, type SitemapChangeFreq, type SitemapEntry, type SitemapImage, type SitemapNews, type SitemapOptions, type SitemapPriority, type SitemapVideo, getServerSitemapResponse };
