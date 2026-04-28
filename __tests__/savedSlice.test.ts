import {hydrateSavedArticles, savedReducer, toggleSavedArticle} from 'store/slices/savedSlice';
import type {Article} from 'types/article';

const article: Article = {
  id: 'a1',
  title: 'Saved article',
  link: 'https://example.com/1',
  category: 'Category',
  summary: 'Summary',
  contentLength: 1000,
  readTimeMinutes: 1,
  publishedAt: '2026-01-01',
};

describe('savedSlice', () => {
  it('saves and removes article through toggle', () => {
    const savedState = savedReducer(undefined, toggleSavedArticle(article));
    expect(savedState.byId.a1).toBeDefined();

    const removedState = savedReducer(savedState, toggleSavedArticle(article));
    expect(removedState.byId.a1).toBeUndefined();
  });

  it('marks hydrated when persistence load fails so the app can continue', () => {
    const failedHydrate = hydrateSavedArticles.rejected(new Error('disk'), '', undefined);
    const state = savedReducer(undefined, failedHydrate);
    expect(state.hydrated).toBe(true);
    expect(state.byId).toEqual({});
  });
});
