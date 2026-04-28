import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Article} from 'types/article';

const SAVED_ARTICLES_KEY = '@saad_task/saved_articles';

export const loadSavedArticles = async (): Promise<Record<string, Article>> => {
  const rawValue = await AsyncStorage.getItem(SAVED_ARTICLES_KEY);
  if (!rawValue) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Record<string, Article>;
    if (!parsedValue || typeof parsedValue !== 'object') {
      return {};
    }
    return parsedValue;
  } catch {
    return {};
  }
};

export const persistSavedArticles = async (
  articles: Record<string, Article>,
): Promise<void> => {
  await AsyncStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(articles));
};
