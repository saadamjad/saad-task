/**
 * GFG page-sitemap fallback when RSS returns HTML or fails.
 * Filters to article URLs under geeksforgeeks.org, sorts by `lastmod`, maps URLs to Article rows.
 */
import type {Article} from 'types/article';
import {calculateReadTime} from 'utils/readTime';

import {titleFromUrl} from './feedText';
import {rssXmlParser} from './xmlParser';

const GFG_ORIGIN = 'https://www.geeksforgeeks.org/';

export interface SitemapUrlEntry {
  loc?: string;
  lastmod?: string;
}

/** Newest content first when RSS is unavailable (better UX than arbitrary XML order). */
export const compareSitemapByLastModDesc = (
  a: SitemapUrlEntry,
  b: SitemapUrlEntry,
): number => {
  const aTime = a.lastmod ? new Date(a.lastmod).getTime() : 0;
  const bTime = b.lastmod ? new Date(b.lastmod).getTime() : 0;
  return bTime - aTime;
};

export const extractSitemapEntries = (xml: string): SitemapUrlEntry[] => {
  const parsed = rssXmlParser.parse(xml) as {
    urlset?: {url?: SitemapUrlEntry[] | SitemapUrlEntry};
  };
  const rawEntries = parsed.urlset?.url;
  if (!rawEntries) {
    return [];
  }
  return Array.isArray(rawEntries) ? rawEntries : [rawEntries];
};

export const mapSitemapEntriesToArticles = (entries: SitemapUrlEntry[]): Article[] => {
  return entries.map((entry, index) => {
    const link = entry.loc ?? '';
    const title = titleFromUrl(link);
    return {
      id: link || `sitemap-${index}`,
      title: title || 'Untitled',
      link,
      category: 'General',
      summary: '',
      contentLength: 0,
      readTimeMinutes: calculateReadTime(title || 'article'),
      publishedAt: entry.lastmod ?? '',
    };
  });
};

/**
 * Full pipeline: parse sitemap XML → filter article URLs → sort → cap → map to Article.
 * Throws if filtering removes all URLs (nothing to show).
 */
export const buildArticlesFromGfgPageSitemapXml = (
  xml: string,
  maxItems: number,
): Article[] => {
  const sitemapEntries = extractSitemapEntries(xml);

  const filtered = sitemapEntries
    .filter(entry => {
      const loc = entry.loc;
      return Boolean(
        loc && loc.startsWith(GFG_ORIGIN) && loc !== GFG_ORIGIN,
      );
    })
    .sort(compareSitemapByLastModDesc)
    .slice(0, maxItems);

  if (filtered.length === 0) {
    throw new Error('Feed is temporarily unavailable. Please try again in a moment.');
  }

  return mapSitemapEntriesToArticles(filtered);
};
