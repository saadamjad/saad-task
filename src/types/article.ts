export interface Article {
  id: string;
  title: string;
  link: string;
  category: string;
  summary: string;
  contentLength: number;
  readTimeMinutes: number;
  publishedAt: string;
}

export interface RssItem {
  title?: string;
  link?: string;
  category?: string | string[];
  description?: string;
  pubDate?: string;
  guid?: string | { '#text'?: string };
}
