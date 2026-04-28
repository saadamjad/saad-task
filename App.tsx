import { OfflineBanner } from 'components/OfflineBanner';
import { AppNavigator } from 'navigation/AppNavigator';
import { type JSX, useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store, useAppDispatch } from 'store';
import { hydrateSavedArticles } from 'store/slices/savedSlice';
import { colors } from 'theme';
import { styles as appStyles } from './App.styles';

/** Loads persisted saved articles once on app start (Redux + AsyncStorage). */
const HydrateSavedArticlesOnMount = (): null => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateSavedArticles());
  }, [dispatch]);

  return null;
};

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <HydrateSavedArticlesOnMount />
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={appStyles.root}>
          <OfflineBanner />
          <View style={appStyles.navigatorShell}>
            <AppNavigator />
          </View>
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
