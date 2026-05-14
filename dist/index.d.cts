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
    publication_date?: string | Date;
    family_friendly?: 'yes' | 'no';
}
/**
 * Interface pour Google News
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemaps
 */
interface SitemapNews {
    name: string;
    language: string;
    publication_date: string | Date;
    title: string;
}
/**
 * Interface principale représentant une entrée du sitemap
 */
interface SitemapEntry {
    url: string;
    lastmod?: string | Date;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
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

export { type SitemapAlternate, type SitemapEntry, type SitemapImage, type SitemapNews, type SitemapOptions, type SitemapVideo, getServerSitemapResponse };
