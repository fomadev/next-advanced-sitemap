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
 * Génère une réponse HTTP compatible Next.js (App Router)
 * * @param entries - Liste des entrées du sitemap
 * @returns Une instance de Response contenant le flux XML
 */
declare function getServerSitemapResponse(entries: SitemapEntry[]): Response;

export { type SitemapAlternate, type SitemapEntry, type SitemapImage, type SitemapNews, type SitemapVideo, getServerSitemapResponse };
