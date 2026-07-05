import React from 'react';
import {
    Alert,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    ZoomIn,
} from 'react-native-reanimated';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type MatchResultParams = {
    outcome?: 'victory' | 'defeat';
};

type MatchOutcome = 'victory' | 'defeat';

const VICTORY_DATA = {
    headline: 'VICTORY',
    subheadline: 'Your alliance claims the battlefield',
    winningTeam: 'Team White & Blue',
    teamHouses: ['White', 'Blue'] as const,
    mvp: {
        name: 'Commander',
        house: 'White House',
        stat: '9 captures · 2 promotions',
    },
    duration: '31:42',
    totalCaptures: 47,
    kingsSaved: 3,
    pawnPromotions: 5,
    eloChange: '+18 ELO',
};

const DEFEAT_DATA = {
    headline: 'DEFEAT',
    subheadline: 'The rival alliance holds the field',
    winningTeam: 'Team Red & Black',
    teamHouses: ['Red', 'Black'] as const,
    mvp: {
        name: 'ShadowKing',
        house: 'Red House',
        stat: '11 captures · 3 promotions',
    },
    duration: '31:42',
    totalCaptures: 47,
    kingsSaved: 3,
    pawnPromotions: 5,
    eloChange: '-12 ELO',
};

const HOUSE_COLORS: Record<string, { primary: string; secondary: string }> = {
    White: { primary: '#F5F0E8', secondary: '#C0392B' },
    Blue: { primary: '#2980B9', secondary: '#1A1A2E' },
    Red: { primary: '#E74C3C', secondary: '#F5F0E8' },
    Black: { primary: '#1A1A2E', secondary: '#2980B9' },
};

export default function MatchResultScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isCompact = width < 380;

    const params = (route.params ?? {}) as MatchResultParams;
    const outcome: MatchOutcome = params.outcome ?? 'victory';
    const isVictory = outcome === 'victory';
    const data = isVictory ? VICTORY_DATA : DEFEAT_DATA;

    const accentColor = isVictory ? '#FFD700' : '#E53935';

    const glowColors = isVictory
        ? ['rgba(255,215,0,0.45)', 'rgba(255,140,0,0.15)', 'transparent']
        : ['rgba(229,57,53,0.4)', 'rgba(183,28,28,0.12)', 'transparent'];

    const handlePlayAgain = () => {
        navigation.replace('Game');
    };

    const handleViewReplay = () => {
        Alert.alert('Replay', 'Match replay viewer coming soon.');
    };

    const handleHome = () => {
        navigation.navigate('BottomTabs');
    };

    return (
        <View style={styles.root}>
            <ImageBackground
                source={require('../assets/images/bg-game2.png')}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
            />

            <LinearGradient
                colors={[
                    'rgba(0,0,0,0.88)',
                    'rgba(0,8,45,0.82)',
                    'rgba(0,0,0,0.92)',
                ]}
                style={StyleSheet.absoluteFill}
            />

            <LinearGradient
                colors={glowColors as [string, string, ...string[]]}
                style={styles.topGlow}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingTop: insets.top + 16,
                        paddingBottom: insets.bottom + 20,
                    },
                ]}
            >
                <Animated.View entering={ZoomIn.duration(700)} style={styles.heroBlock}>
                    <View style={[styles.resultIconRing, { borderColor: accentColor }]}>
                        <LinearGradient
                            colors={
                                isVictory
                                    ? ['#FFD700', '#FF8C00']
                                    : ['#E53935', '#7B0000']
                            }
                            style={styles.resultIconInner}
                        >
                            <Ionicons
                                name={isVictory ? 'trophy' : 'skull'}
                                size={36}
                                color={isVictory ? '#00146D' : '#FFFFFF'}
                            />
                        </LinearGradient>
                    </View>

                    <Text style={[styles.headline, { color: accentColor }]}>
                        {data.headline}
                    </Text>
                    <Text style={styles.subheadline}>{data.subheadline}</Text>
                    <View style={[styles.eloBadge, { borderColor: accentColor }]}>
                        <Text style={[styles.eloBadgeText, { color: accentColor }]}>
                            {data.eloChange}
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.12)', 'rgba(0,20,109,0.55)']}
                        style={styles.teamCard}
                    >
                        <Text style={styles.sectionEyebrow}>WINNING TEAM</Text>
                        <Text style={styles.teamName}>{data.winningTeam}</Text>
                        <View style={styles.teamHouseRow}>
                            {data.teamHouses.map((house) => {
                                const colors = HOUSE_COLORS[house];
                                return (
                                    <LinearGradient
                                        key={house}
                                        colors={[colors.primary, colors.secondary]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.houseChip}
                                    >
                                        <Text style={styles.houseChipText}>{house}</Text>
                                    </LinearGradient>
                                );
                            })}
                        </View>
                    </LinearGradient>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(350).duration(600)}>
                    <LinearGradient
                        colors={['rgba(255,215,0,0.22)', 'rgba(0,0,0,0.55)']}
                        style={styles.mvpCard}
                    >
                        <View style={styles.mvpHeader}>
                            <Ionicons name="ribbon" size={16} color="#FFD700" />
                            <Text style={styles.sectionEyebrow}>MVP PLAYER</Text>
                        </View>

                        <View style={styles.mvpRow}>
                            <View style={styles.mvpAvatarWrap}>
                                <LinearGradient
                                    colors={['#FFD700', '#FF8C00', '#FFD700']}
                                    style={styles.mvpAvatarRing}
                                >
                                    <Image
                                        source={require('../assets/images/avatar2.png')}
                                        style={styles.mvpAvatar}
                                    />
                                </LinearGradient>
                                <View style={styles.crownBadge}>
                                    <Ionicons name="star" size={10} color="#00146D" />
                                </View>
                            </View>

                            <View style={styles.mvpInfo}>
                                <Text style={styles.mvpName}>{data.mvp.name}</Text>
                                <Text style={styles.mvpHouse}>{data.mvp.house}</Text>
                                <Text style={styles.mvpStat}>{data.mvp.stat}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                <Animated.View
                    entering={FadeIn.delay(500).duration(600)}
                    style={styles.statsGrid}
                >
                    <StatTile
                        label="Match Duration"
                        value={data.duration}
                        icon="time"
                        accent={accentColor}
                        compact={isCompact}
                    />
                    <StatTile
                        label="Total Captures"
                        value={String(data.totalCaptures)}
                        icon="flash"
                        accent={accentColor}
                        compact={isCompact}
                    />
                    <StatTile
                        label="Kings Saved"
                        value={String(data.kingsSaved)}
                        icon="shield-checkmark"
                        accent={accentColor}
                        compact={isCompact}
                    />
                    <StatTile
                        label="Pawn Promotions"
                        value={String(data.pawnPromotions)}
                        icon="arrow-up-circle"
                        accent={accentColor}
                        compact={isCompact}
                    />
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(650).duration(600)}
                    style={styles.actions}
                >
                    <TouchableOpacity
                        onPress={handlePlayAgain}
                        activeOpacity={0.9}
                        style={styles.primaryActionWrap}
                    >
                        <LinearGradient
                            colors={['#FFD700', '#FF8C00']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.primaryAction}
                        >
                            <Ionicons name="refresh" size={20} color="#00146D" />
                            <Text style={styles.primaryActionText}>Play Again</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.secondaryRow}>
                        <TouchableOpacity
                            style={styles.secondaryAction}
                            onPress={handleViewReplay}
                            activeOpacity={0.85}
                        >
                            <Ionicons
                                name="play-circle-outline"
                                size={18}
                                color="#FFD700"
                            />
                            <Text style={styles.secondaryActionText}>View Replay</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryAction}
                            onPress={handleHome}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="home-outline" size={18} color="#FFD700" />
                            <Text style={styles.secondaryActionText}>Home</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

function StatTile({
    label,
    value,
    icon,
    accent,
    compact,
}: {
    label: string;
    value: string;
    icon: string;
    accent: string;
    compact?: boolean;
}) {
    return (
        <View style={styles.statTile}>
            <View style={[styles.statIconWrap, { borderColor: `${accent}55` }]}>
                <Ionicons name={icon} size={compact ? 16 : 18} color={accent} />
            </View>
            <Text style={[styles.statValue, compact && styles.statValueCompact]}>
                {value}
            </Text>
            <Text style={styles.statLabel} numberOfLines={2}>
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#000',
    },
    topGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 280,
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    heroBlock: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 4,
    },
    resultIconRing: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 2,
        padding: 3,
        marginBottom: 14,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 10,
    },
    resultIconInner: {
        flex: 1,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headline: {
        fontSize: 42,
        fontWeight: '900',
        letterSpacing: 4,
        textShadowColor: 'rgba(255,215,0,0.35)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 12,
    },
    subheadline: {
        color: 'rgba(255,255,255,0.72)',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 20,
        paddingHorizontal: 12,
    },
    eloBadge: {
        marginTop: 12,
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    eloBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    sectionEyebrow: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
    },
    teamCard: {
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        gap: 8,
    },
    teamName: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '900',
    },
    teamHouseRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    houseChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    houseChipText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    mvpCard: {
        borderRadius: 20,
        padding: 18,
        borderWidth: 1.5,
        borderColor: 'rgba(255,215,0,0.4)',
    },
    mvpHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    mvpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    mvpAvatarWrap: {
        position: 'relative',
    },
    mvpAvatarRing: {
        width: 72,
        height: 72,
        borderRadius: 36,
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mvpAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#00146D',
    },
    crownBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#FFD700',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#00146D',
    },
    mvpInfo: {
        flex: 1,
        minWidth: 0,
    },
    mvpName: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
    },
    mvpHouse: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 2,
    },
    mvpStat: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 6,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'space-between',
    },
    statTile: {
        width: '48%',
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 6,
    },
    statIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    statValue: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
    },
    statValueCompact: {
        fontSize: 18,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.3,
        lineHeight: 13,
    },
    actions: {
        gap: 12,
        marginTop: 4,
    },
    primaryActionWrap: {
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        borderRadius: 18,
    },
    primaryActionText: {
        color: '#00146D',
        fontSize: 17,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    secondaryRow: {
        flexDirection: 'row',
        gap: 10,
    },
    secondaryAction: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,215,0,0.35)',
    },
    secondaryActionText: {
        color: '#FFD700',
        fontSize: 13,
        fontWeight: '800',
    },
});
