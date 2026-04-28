import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {loadSavedArticles} from 'services/storage/savedArticlesStorage';
import type {Article} from 'types/article';

interface SavedState {
  byId: Record<string, Article>;
  hydrated: boolean;
}

const initialState: SavedState = {
  byId: {},
  hydrated: false,
};

export const hydrateSavedArticles = createAsyncThunk('saved/hydrate', async () => {
  return loadSavedArticles();
});

const savedSlice = createSlice({
  name: 'saved',
  initialState,
  reducers: {
    saveArticle(state, action: PayloadAction<Article>) {
      state.byId[action.payload.id] = action.payload;
    },
    removeArticle(state, action: PayloadAction<string>) {
      delete state.byId[action.payload];
    },
    toggleSavedArticle(state, action: PayloadAction<Article>) {
      if (state.byId[action.payload.id]) {
        delete state.byId[action.payload.id];
      } else {
        state.byId[action.payload.id] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(hydrateSavedArticles.fulfilled, (state, action) => {
      state.byId = {
        ...action.payload,
        ...state.byId,
      };
      state.hydrated = true;
    });
    builder.addCase(hydrateSavedArticles.rejected, state => {
      state.hydrated = true;
    });
  },
});

export const {saveArticle, removeArticle, toggleSavedArticle} = savedSlice.actions;
export const savedReducer = savedSlice.reducer;
