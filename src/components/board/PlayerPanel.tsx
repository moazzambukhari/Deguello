import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { HOUSE_COLORS } from './boardLayout';
import { House, PlayerInfo } from './types';

type PlayerPanelProps = {
    player: PlayerInfo;
    isActive?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    turn?: boolean;
};

export default function PlayerPanel({
    player,
    isActive = false,
    position = 'bottom',
    turn,

}: PlayerPanelProps) {
    const colors = HOUSE_COLORS[player.house];
    const isHorizontal = position === 'top' || position === 'bottom';

    return (
        <View
            style={[
                styles.wrapper,
                isHorizontal ? styles.horizontal : styles.vertical,
            ]}
        >

            <View
                style={[
                    styles.avatarRing,
                    isActive && { borderColor: colors.accent },
                ]}
            >
                <Image
                    source={
                        player.avatar ??
                        require('../../assets/images/avatar2.png')
                    }
                    style={styles.avatar}
                />
            </View>

            <View style={styles.info}>
                <Text
                    style={[
                        styles.name,
                        isActive && { color: colors.accent },
                    ]}
                >
                    {player.name}
                </Text>
                <Text style={styles.houseLabel}>
                    {colors.label} House
                </Text>
            </View>
            <View style={[
                styles.turnBadge,
                { backgroundColor: turn ? '#2ECC71' : '#666' }
            ]}>
                <Text style={styles.turnText}>
                    {turn ? 'TURN' : 'WAIT'}
                </Text>
            </View>

            {isActive && (
                <View
                    style={[
                        styles.activeDot,
                        { backgroundColor: colors.accent },
                    ]}
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
    },
    horizontal: {
        width: '100%',
    },
    vertical: {
        width: 100,
    },

    avatarRing: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        overflow: 'hidden',
        marginBottom: 6,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    info: {
        alignItems: 'center',
    },
    name: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
    },
    houseLabel: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 10,
        marginTop: 2,
        fontWeight: '600',
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
    },
    turnBadge: {
        marginTop: 4,
        backgroundColor: '#2ECC71',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        alignSelf: 'center',
    },

    turnText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
});
