/**
 * Human-readable text extraction for RSS fields (descriptions often contain HTML entities/tags).
 * Not a full HTML parser — tuned for common feed snippets.
 */

/** Strip simple HTML tags and collapse whitespace. */
export const stripHtml = (value: string): string =>
  value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Decode a small set of entities frequently seen in RSS/HTML snippets.
 * Order is fixed; extend cautiously (e.g. `&amp;` before bare `&` replacements).
 */
export const decodeHtmlEntities = (value: string): string =>
  value
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

export const normalizeFeedText = (value?: string): string => {
  if (!value) {
    return '';
  }
  return decodeHtmlEntities(stripHtml(value));
};

/** Build a title from the URL path slug when no RSS title exists (e.g. sitemap-only rows). */
export const titleFromUrl = (url: string): string => {
  const trimmed = url.endsWith('/') ? url.slice(0, -1) : url;
  const slug = trimmed.split('/').pop() ?? 'article';
  return slug
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
