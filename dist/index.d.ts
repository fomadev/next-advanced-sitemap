interface SitemapImage {
    loc: string;
    caption?: string;
    title?: string;
    geoLocation?: string;
    license?: string;
}
interface SitemapEntry {
    url: string;
    lastmod?: string | Date;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    images?: SitemapImage[];
}

/**
 * Génère une réponse HTTP compatible Next.js (App Router)
 * * @param entries - Liste des entrées du sitemap
 * @returns Une instance de Response contenant le flux XML
 */
declare function getServerSitemapResponse(entries: SitemapEntry[]): Response;

export { type SitemapEntry, type SitemapImage, getServerSitemapResponse };
