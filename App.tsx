import { Root, NavigatorShell } from './App.styled';
import { OfflineBanner } from 'components/OfflineBanner';
import { AppNavigator } from 'navigation/AppNavigator';
import { type JSX, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/native';
import { store, useAppDispatch } from 'store';
import { hydrateSavedArticles } from 'store/slices/savedSlice';
import { appTheme, colors } from 'theme';

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
      <ThemeProvider theme={appTheme}>
        <SafeAreaProvider>
          <HydrateSavedArticlesOnMount />
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />
          <Root>
            <OfflineBanner />
            <NavigatorShell>
              <AppNavigator />
            </NavigatorShell>
          </Root>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
