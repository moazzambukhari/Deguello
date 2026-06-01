import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabs from './BottomTabs';
import TeamScreen from '../screens/TeamScreen';

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
        </Stack.Navigator>
    );
}