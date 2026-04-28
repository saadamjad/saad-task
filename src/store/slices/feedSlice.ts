import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {fetchArticles} from 'services/rssService';
import type {Article} from 'types/article';

const PAGE_SIZE = 10;

interface FeedState {
  allArticles: Article[];
  visibleCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  allArticles: [],
  visibleCount: PAGE_SIZE,
  loading: false,
  error: null,
};

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async () => fetchArticles(),
  {
    // Avoid overlapping network requests if the user triggers refresh multiple times quickly.
    condition: (_, {getState}) => {
      const state = getState() as {feed: FeedState};
      return !state.feed.loading;
    },
  },
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    loadMore(state) {
      if (state.visibleCount >= state.allArticles.length) {
        return;
      }

      // Pagination is kept synchronous to ensure immediate UI response on list end reach.
      state.visibleCount = Math.min(state.visibleCount + PAGE_SIZE, state.allArticles.length);
    },
    clearFeedError(state) {
      state.error = null;
    },
    setFeedFromCache(state, action: PayloadAction<Article[]>) {
      state.allArticles = action.payload;
      state.visibleCount = Math.min(PAGE_SIZE, action.payload.length);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchFeed.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFeed.fulfilled, (state, action) => {
      state.loading = false;
      state.allArticles = action.payload;
      state.visibleCount = Math.min(PAGE_SIZE, action.payload.length);
    });
    builder.addCase(fetchFeed.rejected, (state, action) => {
      state.loading = false;
      const raw =
        action.error.message ??
        'Unable to load feed. Check your connection and try again.';
      state.error = raw.trim().length > 0 ? raw : 'Unable to load feed. Try again.';
    });
  },
});

export const {loadMore, clearFeedError, setFeedFromCache} = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
