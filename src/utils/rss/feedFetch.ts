/** HTTP fetch for RSS/sitemap XML with a single timeout (AbortController). */

const REQUEST_TIMEOUT_MS = 12000;

/** True when the body looks like XML/RSS (not an HTML error page). */
export const hasRssPayload = (payload: string): boolean => {
  const normalized = payload.trim().toLowerCase();
  return (
    normalized.startsWith('<?xml') ||
    normalized.includes('<rss') ||
    normalized.includes('<channel>')
  );
};

export const fetchFeedResponse = async (url: string): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
        'User-Agent': 'SaadTaskRN/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Feed request failed with status ${response.status}`);
    }

    return response;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith('Feed request failed with status')
    ) {
      throw error;
    }

    const aborted = error instanceof Error && error.name === 'AbortError';

    if (aborted) {
      throw new Error(
        'The request timed out. Check your connection and try again.',
      );
    }

    throw new Error(
      error instanceof Error ? error.message : 'Unable to reach the feed.',
    );
  } finally {
    clearTimeout(timeout);
  }
};
