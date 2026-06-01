import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import TutorialScreen from '../screens/TutorialScreen';
import RulesScreen from '../screens/RulesScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarStyle: {
                    position: 'absolute',
                    left: 20,
                    right: 20,
                    bottom: 15,
                    height: 65,
                    borderRadius: 35,
                    backgroundColor: '#D90015',
                    borderTopWidth: 0,
                    elevation: 10,
                    paddingTop: 5,
                },

                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#fff',

                tabBarLabelStyle: {
                    fontSize: 9,
                    marginBottom: 5,
                },

                tabBarIcon: ({ color }) => {
                    let iconName: any;

                    switch (route.name) {
                        case 'Tutorial':
                            iconName = 'play';
                            break;
                        case 'Rules':
                            iconName = 'document-text';
                            break;
                        case 'Home':
                            iconName = 'home';
                            break;
                        case 'Notifications':
                            iconName = 'notifications';
                            break;
                        case 'Settings':
                            iconName = 'grid';
                            break;
                    }

                    if (route.name === 'Home') {
                        return (
                            <View
                                style={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 26,
                                    backgroundColor: '#D90015',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: -30,

                                    // elevation: 8,
                                }}>
                                <Ionicons
                                    name="home"
                                    size={24}
                                    color="#fff"
                                />
                            </View>
                        );
                    }

                    return (
                        <Ionicons
                            name={iconName}
                            size={22}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tab.Screen name="Tutorial" component={TutorialScreen} />
            <Tab.Screen name="Rules" component={RulesScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen
                name="Notifications"
                component={NotificationScreen}
            />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}