import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import {
    getBoundaryEdges,
    getSquareColors,
    isLightSquare,
    isQueenThrone,
} from './boardLayout';
import { BoundaryEdges } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SquareProps = {
    row: number;
    col: number;
    size: number;
    isSelected?: boolean;
    isHighlighted?: boolean;
    onPress?: () => void;
};

function getGradientColors(light: string, dark: string, isLight: boolean) {
    const base = isLight ? light : dark;
    const highlight = isLight
        ? lighten(base, 0.08)
        : lighten(base, 0.12);
    const shadow = isLight ? darken(base, 0.06) : darken(base, 0.04);

    return [highlight, base, shadow];
}

function lighten(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * amount));
    const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount));
    const b = Math.min(255, (num & 0xff) + Math.round(255 * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function darken(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, ((num >> 16) & 0xff) - Math.round(255 * amount));
    const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount));
    const b = Math.max(0, (num & 0xff) - Math.round(255 * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function BoundaryOverlay({
    edges,
    size,
}: {
    edges: BoundaryEdges;
    size: number;
}) {
    // const borderWidth = Math.max(1.5, size * 0.04);
    const borderWidth = 0.5;
    return (
        <>
            {edges.top && (
                <View
                    style={[
                        styles.boundary,
                        {
                            top: 0,
                            left: 0,
                            right: 0,
                            height: borderWidth,
                        },
                    ]}
                />
            )}
            {edges.bottom && (
                <View
                    style={[
                        styles.boundary,
                        {
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: borderWidth,
                        },
                    ]}
                />
            )}
            {edges.left && (
                <View
                    style={[
                        styles.boundary,
                        {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            width: borderWidth,
                        },
                    ]}
                />
            )}
            {edges.right && (
                <View
                    style={[
                        styles.boundary,
                        {
                            top: 0,
                            bottom: 0,
                            right: 0,
                            width: borderWidth,
                        },
                    ]}
                />
            )}
        </>
    );
}

export default function Square({
    row,
    col,
    size,
    isSelected = false,
    isHighlighted = false,
    onPress,
}: SquareProps) {
    const { light, dark } = getSquareColors(row, col);
    const lightSquare = isLightSquare(row, col);
    const gradientColors = getGradientColors(light, dark, lightSquare);
    const boundaries = getBoundaryEdges(row, col);
    const isThrone = isQueenThrone(row, col);

    const selectionGlow = useSharedValue(0);

    useEffect(() => {
        selectionGlow.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
    }, [isSelected, selectionGlow]);

    const animatedStyle = useAnimatedStyle(() => ({
        shadowOpacity: 0.35 * selectionGlow.value,
        shadowRadius: 8 * selectionGlow.value,
        transform: [{ scale: withSpring(isSelected ? 1.04 : 1, { damping: 14 }) }],
    }));

    return (
        <AnimatedPressable
            onPress={onPress}
            style={[
                {
                    width: size,
                    height: size,
                },
                isSelected && styles.selectedShadow,
                animatedStyle,
            ]}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fill}
            >
                <BoundaryOverlay edges={boundaries} size={size} />

                {isHighlighted && !isSelected && (
                    <View style={styles.highlightRing} />
                )}

                {isThrone && (
                    <View
                        style={[
                            styles.throneBadge,
                            {
                                width: size * 0.55,
                                height: size * 0.55,
                                borderRadius: size * 0.275,
                            },
                        ]}
                    >
                        <Text style={[styles.throneText, { fontSize: size * 0.28 }]}>
                            Q
                        </Text>
                    </View>
                )}

                {isHighlighted && (
                    <View style={styles.moveDot} />
                )}
            </LinearGradient>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedShadow: {
        shadowColor: '#7FC97F',
        shadowOffset: { width: 0, height: 0 },
        elevation: 6,
        zIndex: 2,
    },
    boundary: {
        position: 'absolute',
        backgroundColor: '#FFD700',
        zIndex: 3,
    },
    highlightRing: {
        ...StyleSheet.absoluteFill,
        borderWidth: 0.5,
        // borderColor: 'rgba(255, 215, 0, 0.65)',
    },
    throneBadge: {
        position: 'absolute',
        borderWidth: 2,
        // borderColor: 'rgba(255, 215, 0, 0.85)',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    throneText: {
        color: '#FFD700',
        fontWeight: '900',
    },
    moveDot: {
        width: '28%',
        height: '28%',
        borderRadius: 999,
        backgroundColor: 'rgba(26, 26, 46, 0.55)',
    },
});
