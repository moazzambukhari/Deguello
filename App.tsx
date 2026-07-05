import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/navigation/AuthContext';
import { store } from './src/store/store';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          />

          <NavigationContainer>
            <AuthProvider>
              <AppNavigator />
            </AuthProvider>
          </NavigationContainer>

        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;