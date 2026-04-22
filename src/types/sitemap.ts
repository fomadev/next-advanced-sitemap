export interface SitemapImage {
  loc: string;
  caption?: string;
  title?: string;
  geoLocation?: string;
  license?: string;
}

export interface SitemapEntry {
  url: string;
  lastmod?: string | Date;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: SitemapImage[];
  // On pourra ajouter video et alternates plus tard
}