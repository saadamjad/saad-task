import { combineReducers, configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistSavedArticles } from 'services/storage/savedArticlesStorage';
import { authGateReducer } from 'store/slices/authGateSlice';
import { feedReducer } from 'store/slices/feedSlice';
import {
  removeArticle,
  saveArticle,
  savedReducer,
  toggleSavedArticle,
} from 'store/slices/savedSlice';

const rootReducer = combineReducers({
  feed: feedReducer,
  saved: savedReducer,
  authGate: authGateReducer,
});

const savedListenerMiddleware = createListenerMiddleware();

const PERSIST_DEBOUNCE_MS = 280;

const persistSavedSafely = async (getState: () => RootState): Promise<void> => {
  try {
    await persistSavedArticles(getState().saved.byId);
  } catch (error) {
    if (__DEV__) {
      console.warn('persistSavedArticles failed', error);
    }
  }
};

let persistScheduledId: ReturnType<typeof setTimeout> | null = null;

const schedulePersistSaved = (getState: () => RootState): void => {
  if (persistScheduledId !== null) {
    clearTimeout(persistScheduledId);
  }
  persistScheduledId = setTimeout(() => {
    persistScheduledId = null;
    persistSavedSafely(getState).catch(() => {
      /* Errors logged inside persistSavedSafely */
    });
  }, PERSIST_DEBOUNCE_MS);
};

savedListenerMiddleware.startListening({
  actionCreator: saveArticle,
  effect: (_, api) => {
    schedulePersistSaved(() => api.getState() as RootState);
  },
});

savedListenerMiddleware.startListening({
  actionCreator: removeArticle,
  effect: (_, api) => {
    schedulePersistSaved(() => api.getState() as RootState);
  },
});

savedListenerMiddleware.startListening({
  actionCreator: toggleSavedArticle,
  effect: (_, api) => {
    schedulePersistSaved(() => api.getState() as RootState);
  },
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(savedListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
