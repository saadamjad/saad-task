import {configureStore} from '@reduxjs/toolkit';
import {fetchArticles} from 'services/rssService';
import {feedReducer, fetchFeed, loadMore, setFeedFromCache} from 'store/slices/feedSlice';
import type {Article} from 'types/article';

jest.mock('services/rssService');

const mockedFetchArticles = jest.mocked(fetchArticles);

const mockArticles: Article[] = Array.from({length: 15}).map((_, index) => ({
  id: `id-${index}`,
  title: `Article ${index}`,
  link: `https://example.com/${index}`,
  category: 'General',
  summary: 'summary text',
  contentLength: 1200,
  readTimeMinutes: 2,
  publishedAt: new Date().toISOString(),
}));

describe('feedSlice', () => {
  beforeEach(() => {
    mockedFetchArticles.mockReset();
  });

  it('does not start overlapping fetches while loading', async () => {
    let resolveFirst!: (value: Article[]) => void;
    const hanging = new Promise<Article[]>((resolve) => {
      resolveFirst = resolve;
    });
    mockedFetchArticles.mockImplementation(() => hanging);

    const store = configureStore({
      reducer: {feed: feedReducer},
    });

    const first = store.dispatch(fetchFeed());
    store.dispatch(fetchFeed());

    await Promise.resolve();

    expect(mockedFetchArticles).toHaveBeenCalledTimes(1);

    resolveFirst(mockArticles);
    await first;
  });

  it('loads and paginates visible article count', () => {
    const loadedState = feedReducer(undefined, setFeedFromCache(mockArticles));
    expect(loadedState.visibleCount).toBe(10);

    const expandedState = feedReducer(loadedState, loadMore());
    expect(expandedState.visibleCount).toBe(15);
  });
});
