import {combineReducers, configureStore, createListenerMiddleware} from '@reduxjs/toolkit';
import {useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux';
import {persistSavedArticles} from 'services/storage/savedArticlesStorage';
import {authGateReducer} from 'store/slices/authGateSlice';
import {feedReducer} from 'store/slices/feedSlice';
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

const persistSavedSafely = async (state: RootState): Promise<void> => {
  try {
    await persistSavedArticles(state.saved.byId);
  } catch (error) {
    if (__DEV__) {
      console.warn('persistSavedArticles failed', error);
    }
  }
};

savedListenerMiddleware.startListening({
  actionCreator: saveArticle,
  effect: async (_, api) => {
    const state = api.getState() as RootState;
    await persistSavedSafely(state);
  },
});

savedListenerMiddleware.startListening({
  actionCreator: removeArticle,
  effect: async (_, api) => {
    const state = api.getState() as RootState;
    await persistSavedSafely(state);
  },
});

savedListenerMiddleware.startListening({
  actionCreator: toggleSavedArticle,
  effect: async (_, api) => {
    const state = api.getState() as RootState;
    await persistSavedSafely(state);
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
