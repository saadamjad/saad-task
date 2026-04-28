import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ArticleWebViewScreen } from 'features/article/screens/ArticleWebViewScreen';
import { FeedScreen } from 'features/feed/screens/FeedScreen';
import { SavedArticlesScreen } from 'features/saved/screens/SavedArticlesScreen';
import { SavedGateScreen } from 'features/saved/screens/SavedGateScreen';
import type { JSX } from 'react';
import { colors } from 'theme';
import type {
  FeedStackParamList,
  RootTabParamList,
  SavedStackParamList,
} from 'types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();
const FeedStack = createNativeStackNavigator<FeedStackParamList>();
const SavedStack = createNativeStackNavigator<SavedStackParamList>();

export const navigationRef = createNavigationContainerRef<RootTabParamList>();
const stackScreenOptions = {
  headerStyle: {backgroundColor: colors.surface},
  headerTintColor: colors.textPrimary,
} as const;

const tabScreenOptions = {
  headerShown: false,
  tabBarStyle: {backgroundColor: colors.surface},
  tabBarActiveTintColor: colors.accent,
  tabBarInactiveTintColor: colors.textSecondary,
} as const;

const FeedStackNavigator = (): JSX.Element => {
  return (
    <FeedStack.Navigator screenOptions={stackScreenOptions}>
      <FeedStack.Screen name="FeedHome" component={FeedScreen} options={{title: 'GeeksForGeeks Feed'}} />
      <FeedStack.Screen name="ArticleWebView" component={ArticleWebViewScreen} options={{title: 'Article'}} />
    </FeedStack.Navigator>
  );
};

const SavedStackNavigator = (): JSX.Element => {
  return (
    <SavedStack.Navigator screenOptions={stackScreenOptions}>
      <SavedStack.Screen name="SavedGate" component={SavedGateScreen} options={{headerShown: false}} />
      <SavedStack.Screen name="SavedArticles" component={SavedArticlesScreen} options={{title: 'Saved Articles'}} />
      <SavedStack.Screen name="ArticleWebView" component={ArticleWebViewScreen} options={{title: 'Article'}} />
    </SavedStack.Navigator>
  );
};

export const AppNavigator = (): JSX.Element => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator screenOptions={tabScreenOptions}>
        <Tab.Screen name="FeedTab" component={FeedStackNavigator} options={{title: 'Feed'}} />
        <Tab.Screen
          name="SavedTab"
          component={SavedStackNavigator}
          options={{title: 'Saved', unmountOnBlur: true}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
