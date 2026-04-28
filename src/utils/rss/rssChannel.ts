/**
 * RSS channel → Article mapping: parses `<channel><item>` from XML, normalizes parser quirks
 * (single item vs array, guid object shape, category string/array).
 */
import type {Article, RssItem} from 'types/article';
import {calculateReadTime} from 'utils/readTime';

import {rssXmlParser} from './xmlParser';

const trimStr = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

export const normalizeCategory = (category: RssItem['category']): string => {
  if (Array.isArray(category) && category.length > 0) {
    return category[0] ?? 'General';
  }

  if (typeof category === 'string' && category.trim()) {
    return category;
  }

  return 'General';
};

/**
 * RSS `<guid>` may be a string or `{ '#text': '...' }` depending on fast-xml-parser output.
 */
export const resolveRssItemGuid = (guid: RssItem['guid']): string | undefined => {
  if (!guid) {
    return undefined;
  }

  if (typeof guid === 'string') {
    return guid;
  }

  return guid['#text'];
};

export const extractRssChannelItems = (xml: string): RssItem[] => {
  const parsed = rssXmlParser.parse(xml) as {
    rss?: {channel?: {item?: RssItem[] | RssItem}};
  };
  const rawItems = parsed.rss?.channel?.item;

  if (!rawItems) {
    return [];
  }

  return Array.isArray(rawItems) ? rawItems : [rawItems];
};

export const buildArticlesFromRssItems = (items: RssItem[]): Article[] => {
  return items
    .filter(item => Boolean(trimStr(item.title) && trimStr(item.link)))
    .map((item, index) => {
      const titleRaw = trimStr(item.title);
      const linkRaw = trimStr(item.link);
      const summary = item.description ?? '';
      const id = resolveRssItemGuid(item.guid) ?? `${linkRaw}-${index}`;

      return {
        id,
        title: titleRaw || 'Untitled',
        link: linkRaw,
        category: normalizeCategory(item.category),
        summary,
        contentLength: summary.length,
        readTimeMinutes: calculateReadTime(summary),
        publishedAt: item.pubDate ?? '',
      };
    });
};
