import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { HOUSE_COLORS } from './boardLayout';
import { House } from './types';

type TurnIndicatorProps = {
    activeHouse: House;
    turnNumber?: number;
};

export default function TurnIndicator({
    activeHouse,
    turnNumber = 1,
}: TurnIndicatorProps) {
    const colors = HOUSE_COLORS[activeHouse];
    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 700 }),
                withTiming(1, { duration: 700 }),
            ),
            -1,
            false,
        );
    }, [activeHouse, pulse]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
    }));

    return (
        <Animated.View style={[styles.wrapper, animatedStyle]}>
            <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.badge}
            >
                <Text style={styles.label}>TURN</Text>
                <Text style={[styles.house, { color: colors.accent }]}>
                    {colors.label}
                </Text>
                <Text style={styles.turnNumber}>Round {turnNumber}</Text>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'center',
    },
    badge: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 2,
    },
    house: {
        fontSize: 16,
        fontWeight: '900',
        marginTop: 2,
    },
    turnNumber: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 9,
        marginTop: 2,
        fontWeight: '600',
    },
});
