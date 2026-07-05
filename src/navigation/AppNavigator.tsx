import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import MainStack from './MainStack';
import AuthStack from './AuthStack';
import { AuthContext } from './AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoading, userToken } = React.useContext(AuthContext);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {userToken ? (
        <Stack.Screen
          name="MainStack"
          component={MainStack}
        />
      ) : (
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
        />
      )}
    </Stack.Navigator>
  );
}