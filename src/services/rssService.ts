/**
 * GeeksforGeeks articles: fetch primary RSS; if the response is not XML/RSS (e.g. HTML),
 * fall back to the public page sitemap.
 */
import type {Article} from 'types/article';

import {
  GFG_FEED_URL,
  GFG_MAX_SITEMAP_ITEMS,
  GFG_PAGE_SITEMAP_URL,
} from 'utils/rss/endpoints';
import {fetchFeedResponse, hasRssPayload} from 'utils/rss/feedFetch';
import {
  buildArticlesFromRssItems,
  extractRssChannelItems,
} from 'utils/rss/rssChannel';
import {buildArticlesFromGfgPageSitemapXml} from 'utils/rss/sitemap';

const fetchFromSitemap = async (): Promise<Article[]> => {
  const sitemapResponse = await fetchFeedResponse(GFG_PAGE_SITEMAP_URL);
  const sitemapXml = await sitemapResponse.text();
  return buildArticlesFromGfgPageSitemapXml(sitemapXml, GFG_MAX_SITEMAP_ITEMS);
};

export const fetchArticles = async (): Promise<Article[]> => {
  const response = await fetchFeedResponse(GFG_FEED_URL);
  const payload = await response.text();

  if (!hasRssPayload(payload)) {
    return fetchFromSitemap();
  }

  const items = extractRssChannelItems(payload);
  if (items.length === 0) {
    throw new Error('Feed returned no items. Please retry shortly.');
  }

  return buildArticlesFromRssItems(items);
};
