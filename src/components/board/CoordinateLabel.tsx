import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

type CoordinateLabelProps = {
    label: string;
    variant?: 'file' | 'rank' | 'roman';
    position?: 'top' | 'bottom' | 'left' | 'right' | 'corner';
    tone?: 'light' | 'dark' | 'blue' | 'red' | 'yellow';
    inverted?: boolean;
    size?: number;
    style?: ViewStyle;
};

const TONE_STYLES = {
    light: { bg: '#F5F0E8', text: '#1A1A2E' },
    dark: { bg: '#1A1A2E', text: '#F5F0E8' },
    blue: { bg: '#2980B9', text: '#FFFFFF' },
    red: { bg: '#C0392B', text: '#FFFFFF' },
    yellow: { bg: '#FFD700', text: '#1A1A2E' },
};

export default function CoordinateLabel({
    label,
    variant = 'file',
    tone = 'light',
    inverted = false,
    size = 16,
    style,
}: CoordinateLabelProps) {
    const colors = TONE_STYLES[tone];

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.bg,
                    minWidth: size,
                    minHeight: size,
                },
                style,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    {
                        color: colors.text,
                        fontSize: variant === 'roman' ? size * 0.55 : size * 0.5,
                        transform: inverted ? [{ rotate: '180deg' }] : undefined,
                    },
                ]}
            >
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 2,
    },
    text: {
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
