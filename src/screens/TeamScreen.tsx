import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { House } from '../components/board/types';
import {
    getPlayerForHouse,
    matchPlayersToPlayerInfo,
    startMatch,
    subscribeToMatch,
} from '../firebase/matches';
import type { MatchDocument, MatchPlayer } from '../firebase/types';
import { AuthContext } from '../navigation/AuthContext';
import type { MainStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Team'>;

const DEFAULT_AVATAR = require('../assets/images/avatar2.png');

export const TeamScreen = ({ navigation, route }: Props) => {
    const matchId = route.params?.matchId;
    const { userToken } = useContext(AuthContext);
    const [match, setMatch] = useState<MatchDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const hasNavigated = useRef(false);

    const statusText = useMemo(() => {
        if (!match) return 'Loading...';

        switch (match.status) {
            case 'waiting':
                return `Waiting for players (${match.players.length}/4)`;

            case 'ready':
                return 'Teams Ready';

            case 'in_progress':
                return 'Starting Match...';

            default:
                return '';
        }
    }, [match]);

    useEffect(() => {
        const unsubscribe = subscribeToMatch(
            matchId,
            (nextMatch) => {
                setMatch(nextMatch);
                setLoading(false);
            },
            () => setLoading(false),
        );

        return unsubscribe;
    }, [matchId]);

    useEffect(() => {
        if (!match || hasNavigated.current) {
            return;
        }

        if (match.status !== 'ready' && match.status !== 'in_progress') {
            return;
        }

        if (match.players.length < 4) {
            return;
        }

        hasNavigated.current = true;

        const navigateToGame = async () => {
            if (match.status === 'ready') {
                await startMatch(matchId);
            }

            navigation.replace('Game', {
                matchId,
                mode: 'multiplayer',
                players: matchPlayersToPlayerInfo(match.players),
            });
        };

        const timer = setTimeout(navigateToGame, 1500);
        return () => clearTimeout(timer);
    }, [match, matchId, navigation]);

    const playersByHouse = useMemo(() => {
        const map: Partial<Record<House, MatchPlayer>> = {};
        match?.players.forEach((player) => {
            map[player.house] = player;
        });
        return map;
    }, [match]);

    const renderPlayerCard = (
        house: House,
        variant: 'red' | 'white' | 'dark',
        alignRight = false,
    ) => {
        const player = playersByHouse[house];
        const isCurrentUser = player?.uid === userToken;
        const cardStyle =
            variant === 'red'
                ? styles.redCard
                : variant === 'white'
                    ? styles.whiteCard
                    : styles.darkCard;
        const nameStyle =
            variant === 'white' ? styles.darkName : styles.playerName;
        const detailsStyle =
            variant === 'white' ? styles.darkDetails : styles.playerDetails;

        return (
            <View
                style={[
                    cardStyle,
                    isCurrentUser && styles.selectedCard,
                    alignRight && styles.alignRight,
                ]}
            >
                {!alignRight && (
                    <Image
                        source={
                            player?.avatar
                                ? { uri: player.avatar }
                                : DEFAULT_AVATAR
                        }
                        style={styles.avatar}
                    />
                )}

                <View style={alignRight ? styles.rightTextWrap : undefined}>
                    <Text style={nameStyle}>
                        {player?.name ?? 'Waiting...'}
                    </Text>
                    <Text style={detailsStyle}>
                        {player
                            ? player.isAi
                                ? 'AI opponent'
                                : isCurrentUser
                                    ? 'You'
                                    : `${house} house`
                            : 'Searching for player...'}
                    </Text>
                </View>

                {alignRight && (
                    <Image
                        source={
                            player?.avatar
                                ? { uri: player.avatar }
                                : DEFAULT_AVATAR
                        }
                        style={styles.avatar}
                    />
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Loading match...</Text>
            </View>
        );
    }

    return (
        <ImageBackground
            source={require('../assets/images/team-bg.png')}
            style={styles.container}
        >
            <View style={styles.statusBanner}>
                <Text style={styles.statusText}>
                    {statusText}
                </Text>
            </View>

            <View style={styles.topSection}>
                <Text style={styles.teamTitle}>Team A</Text>
                {renderPlayerCard('red', 'red')}
                {renderPlayerCard('white', 'white')}
            </View>

            <View style={styles.centerContainer}>
                <Text style={styles.vsText}>VS</Text>
            </View>

            <View style={styles.bottomSection}>
                <Text style={styles.teamTitle}>Team B</Text>
                {renderPlayerCard('blue', 'dark', true)}
                {renderPlayerCard('black', 'dark', true)}
            </View>
        </ImageBackground>
    );
};

export default TeamScreen;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00146D',
    },
    loadingText: {
        color: '#fff',
        marginTop: 12,
        fontSize: 14,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    statusBanner: {
        marginTop: 50,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusText: {
        color: '#FFD700',
        fontWeight: '700',
        fontSize: 13,
    },
    topSection: {
        marginTop: 24,
        alignItems: 'center',
    },
    bottomSection: {
        marginBottom: 40,
        alignItems: 'center',
    },
    teamTitle: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vsText: {
        color: '#fff',
        fontSize: 70,
        fontWeight: '900',
    },
    redCard: {
        width: 220,
        height: 55,
        backgroundColor: '#E61C23',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 8,
        borderRadius: 8,
    },
    whiteCard: {
        width: 220,
        height: 55,
        backgroundColor: '#F2F2F2',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    darkCard: {
        width: 220,
        height: 55,
        backgroundColor: '#0A1C4D',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
        borderRadius: 8,
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    alignRight: {
        justifyContent: 'space-between',
    },
    rightTextWrap: {
        flex: 1,
        marginRight: 8,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 18,
        marginRight: 8,
    },
    playerName: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    playerDetails: {
        color: '#ddd',
        fontSize: 10,
    },
    darkName: {
        color: '#000',
        fontWeight: '700',
        fontSize: 13,
    },
    darkDetails: {
        color: '#555',
        fontSize: 10,
    },
});
