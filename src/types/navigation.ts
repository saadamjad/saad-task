import type {NavigatorScreenParams} from '@react-navigation/native';
import type {Article} from 'types/article';

export type FeedStackParamList = {
  FeedHome: undefined;
  ArticleWebView: {
    article: Article;
    sourceTab: 'feed' | 'saved';
  };
};

export type SavedStackParamList = {
  SavedGate: undefined;
  SavedArticles: undefined;
  ArticleWebView: {
    article: Article;
    sourceTab: 'feed' | 'saved';
  };
};

export type RootTabParamList = {
  FeedTab: NavigatorScreenParams<FeedStackParamList>;
  SavedTab: NavigatorScreenParams<SavedStackParamList>;
};
