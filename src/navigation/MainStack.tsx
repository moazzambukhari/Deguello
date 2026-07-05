import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabs from './BottomTabs';
import TeamScreen from '../screens/TeamScreen';
import GameScreen from '../screens/GameScreen';
import LobbyScreen from '../screens/LobbyScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MatchResultScreen from '../screens/MatchResultScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="BottomTabs"
                component={BottomTabs}
            />

            {/* Other protected screens */}
            <Stack.Screen
                name="Team"
                component={TeamScreen}
            />

            <Stack.Screen
                name="Lobby"
                component={LobbyScreen}
            />

            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
            />

            <Stack.Screen
                name="Game"
                component={GameScreen}
            />

            <Stack.Screen
                name="MatchResult"
                component={MatchResultScreen}
                options={{ animation: 'fade' }}
            />
        </Stack.Navigator>
    );
}