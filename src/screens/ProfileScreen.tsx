import React, { useMemo, useState } from 'react';
import {
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
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProfileTab = 'statistics' | 'achievements' | 'history';

const MOCK_PROFILE = {
    username: 'Commander',
    country: 'United States',
    countryCode: 'US',
    rank: 'Gold III',
    elo: 1487,
    gamesPlayed: 60,
    wins: 42,
    losses: 18,
};

const MOCK_STATS = [
    { label: 'Avg. Game Length', value: '24 min', icon: 'time-outline' as const },
    { label: 'Best Streak', value: '7 wins', icon: 'flame-outline' as const },
    { label: 'Favorite House', value: 'White', icon: 'home-outline' as const },
    { label: 'Captures / Game', value: '12.4', icon: 'skull-outline' as const },
    { label: 'Alliances Formed', value: '18', icon: 'people-outline' as const },
    { label: 'Checkmates', value: '31', icon: 'trophy-outline' as const },
];

const MOCK_ACHIEVEMENTS = [
    { id: '1', title: 'First Blood', desc: 'Win your first match', unlocked: true, icon: 'flag' as const },
    { id: '2', title: 'Four Corners', desc: 'Control all house zones', unlocked: true, icon: 'grid' as const },
    { id: '3', title: 'Unstoppable', desc: 'Win 5 games in a row', unlocked: true, icon: 'flash' as const },
    { id: '4', title: 'Grandmaster', desc: 'Reach 1800 ELO', unlocked: false, icon: 'diamond' as const },
    { id: '5', title: 'Diplomat', desc: 'Form 10 alliances', unlocked: false, icon: 'hand-left' as const },
    { id: '6', title: 'Deguello Legend', desc: 'Win 100 ranked games', unlocked: false, icon: 'star' as const },
];

const MOCK_MATCHES = [
    {
        id: 'm1',
        result: 'win' as const,
        mode: 'Ranked 4P',
        opponents: 'ShadowKing, AzureWolf, CrimsonBlade',
        date: 'Jun 22, 2026',
        eloChange: +18,
        duration: '31 min',
    },
    {
        id: 'm2',
        result: 'loss' as const,
        mode: 'Quick Match',
        opponents: 'IronPawn, NightRook, StormKnight',
        date: 'Jun 20, 2026',
        eloChange: -12,
        duration: '19 min',
    },
    {
        id: 'm3',
        result: 'win' as const,
        mode: 'Private Room',
        opponents: 'VortexQueen, FrostBishop, EmberKnight',
        date: 'Jun 18, 2026',
        eloChange: +14,
        duration: '27 min',
    },
    {
        id: 'm4',
        result: 'win' as const,
        mode: 'Ranked 4P',
        opponents: 'StoneGuard, PhantomMate, SolarRook',
        date: 'Jun 15, 2026',
        eloChange: +22,
        duration: '35 min',
    },
];

const TABS: { key: ProfileTab; label: string; icon: string }[] = [
    { key: 'statistics', label: 'Statistics', icon: 'bar-chart-outline' },
    { key: 'achievements', label: 'Achievements', icon: 'medal-outline' },
    { key: 'history', label: 'Match History', icon: 'list-outline' },
];

export default function ProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isCompact = width < 380;

    const [activeTab, setActiveTab] = useState<ProfileTab>('statistics');

    const winRate = useMemo(() => {
        if (MOCK_PROFILE.gamesPlayed === 0) return '0%';
        return `${Math.round((MOCK_PROFILE.wins / MOCK_PROFILE.gamesPlayed) * 100)}%`;
    }, []);

    return (
        <ImageBackground
            source={require('../assets/images/bg-login2.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingTop: insets.top + 12,
                        paddingBottom: insets.bottom + 32,
                    },
                ]}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="chevron-back" size={22} color="#FFD700" />
                    </TouchableOpacity>
                    <View style={styles.headerTitles}>
                        <Text style={styles.headerEyebrow}>PLAYER</Text>
                        <Text style={styles.headerTitle}>Profile</Text>
                    </View>
                    <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
                        <Ionicons name="create-outline" size={18} color="#FFD700" />
                    </TouchableOpacity>
                </View>

                <LinearGradient
                    colors={['rgba(255,215,0,0.2)', 'rgba(0,20,109,0.9)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroCard}
                >
                    <View style={styles.heroTop}>
                        <LinearGradient
                            colors={['#FFD700', '#FF8C00', '#FFD700']}
                            style={styles.avatarRing}
                        >
                            <Image
                                source={require('../assets/images/avatar2.png')}
                                style={styles.avatar}
                            />
                        </LinearGradient>

                        <View style={styles.heroInfo}>
                            <Text style={styles.username}>{MOCK_PROFILE.username}</Text>
                            <View style={styles.countryRow}>
                                <View style={styles.flagBadge}>
                                    <Text style={styles.flagText}>
                                        {MOCK_PROFILE.countryCode}
                                    </Text>
                                </View>
                                <Text style={styles.country}>{MOCK_PROFILE.country}</Text>
                            </View>
                            <View style={styles.rankRow}>
                                <Ionicons name="shield" size={14} color="#FFD700" />
                                <Text style={styles.rankText}>{MOCK_PROFILE.rank}</Text>
                                <View style={styles.eloChip}>
                                    <Text style={styles.eloChipText}>
                                        {MOCK_PROFILE.elo} ELO
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.summaryGrid}>
                        <SummaryStat label="Games" value={String(MOCK_PROFILE.gamesPlayed)} />
                        <SummaryStat label="Wins" value={String(MOCK_PROFILE.wins)} accent="#4CAF50" />
                        <SummaryStat label="Losses" value={String(MOCK_PROFILE.losses)} accent="#E53935" />
                        <SummaryStat label="Win Rate" value={winRate} accent="#FFD700" />
                    </View>
                </LinearGradient>

                <View style={styles.tabBar}>
                    {TABS.map((tab) => {
                        const selected = activeTab === tab.key;
                        return (
                            <TouchableOpacity
                                key={tab.key}
                                style={[styles.tabBtn, selected && styles.tabBtnActive]}
                                onPress={() => setActiveTab(tab.key)}
                                activeOpacity={0.85}
                            >
                                <Ionicons
                                    name={tab.icon}
                                    size={isCompact ? 14 : 16}
                                    color={selected ? '#00146D' : 'rgba(255,255,255,0.65)'}
                                />
                                <Text
                                    style={[
                                        styles.tabLabel,
                                        selected && styles.tabLabelActive,
                                        isCompact && styles.tabLabelCompact,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.tabContent}>
                    {activeTab === 'statistics' && (
                        <StatisticsTab isCompact={isCompact} winRate={winRate} />
                    )}
                    {activeTab === 'achievements' && (
                        <AchievementsTab isCompact={isCompact} />
                    )}
                    {activeTab === 'history' && <MatchHistoryTab />}
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

function SummaryStat({
    label,
    value,
    accent = '#FFFFFF',
}: {
    label: string;
    value: string;
    accent?: string;
}) {
    return (
        <View style={styles.summaryStat}>
            <Text style={[styles.summaryValue, { color: accent }]}>{value}</Text>
            <Text style={styles.summaryLabel}>{label}</Text>
        </View>
    );
}

function StatisticsTab({
    isCompact,
    winRate,
}: {
    isCompact: boolean;
    winRate: string;
}) {
    const winPct = parseInt(winRate, 10) || 0;

    return (
        <View style={styles.panel}>
            <Text style={styles.panelTitle}>Performance Overview</Text>

            <View style={styles.winRateCard}>
                <View style={styles.winRateHeader}>
                    <Text style={styles.winRateLabel}>Win Rate</Text>
                    <Text style={styles.winRateValue}>{winRate}</Text>
                </View>
                <View style={styles.progressTrack}>
                    <LinearGradient
                        colors={['#4CAF50', '#FFD700']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressFill, { width: `${winPct}%` }]}
                    />
                </View>
                <View style={styles.progressLegend}>
                    <Text style={styles.legendText}>
                        {MOCK_PROFILE.wins}W · {MOCK_PROFILE.losses}L ·{' '}
                        {MOCK_PROFILE.gamesPlayed} total
                    </Text>
                </View>
            </View>

            <View style={styles.statsGrid}>
                {MOCK_STATS.map((stat) => (
                    <View key={stat.label} style={styles.statCard}>
                        <View style={styles.statIconWrap}>
                            <Ionicons name={stat.icon} size={16} color="#FFD700" />
                        </View>
                        <Text
                            style={[
                                styles.statCardValue,
                                isCompact && styles.statCardValueCompact,
                            ]}
                            numberOfLines={1}
                        >
                            {stat.value}
                        </Text>
                        <Text style={styles.statCardLabel} numberOfLines={2}>
                            {stat.label}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.eloCard}>
                <Ionicons name="trending-up" size={20} color="#42A5F5" />
                <View style={styles.eloCardInfo}>
                    <Text style={styles.eloCardTitle}>Current Rating</Text>
                    <Text style={styles.eloCardSub}>
                        Peak ELO: 1524 · Season rank #{128}
                    </Text>
                </View>
                <Text style={styles.eloCardValue}>{MOCK_PROFILE.elo}</Text>
            </View>
        </View>
    );
}

function AchievementsTab({ isCompact }: { isCompact: boolean }) {
    const unlockedCount = MOCK_ACHIEVEMENTS.filter((a) => a.unlocked).length;

    return (
        <View style={styles.panel}>
            <View style={styles.achievementHeader}>
                <Text style={styles.panelTitle}>Achievements</Text>
                <Text style={styles.achievementCount}>
                    {unlockedCount}/{MOCK_ACHIEVEMENTS.length} unlocked
                </Text>
            </View>

            <View style={styles.achievementGrid}>
                {MOCK_ACHIEVEMENTS.map((achievement) => (
                    <View
                        key={achievement.id}
                        style={[
                            styles.achievementCard,
                            !achievement.unlocked && styles.achievementLocked,
                            isCompact && styles.achievementCardCompact,
                        ]}
                    >
                        <LinearGradient
                            colors={
                                achievement.unlocked
                                    ? ['rgba(255,215,0,0.35)', 'rgba(0,20,109,0.6)']
                                    : ['rgba(255,255,255,0.06)', 'rgba(0,0,0,0.35)']
                            }
                            style={styles.achievementGradient}
                        >
                            <View
                                style={[
                                    styles.achievementIcon,
                                    achievement.unlocked
                                        ? styles.achievementIconUnlocked
                                        : styles.achievementIconLocked,
                                ]}
                            >
                                <Ionicons
                                    name={achievement.icon}
                                    size={22}
                                    color={
                                        achievement.unlocked
                                            ? '#FFD700'
                                            : 'rgba(255,255,255,0.35)'
                                    }
                                />
                            </View>
                            <Text
                                style={[
                                    styles.achievementTitle,
                                    !achievement.unlocked &&
                                        styles.achievementTitleLocked,
                                ]}
                                numberOfLines={1}
                            >
                                {achievement.title}
                            </Text>
                            <Text
                                style={styles.achievementDesc}
                                numberOfLines={2}
                            >
                                {achievement.desc}
                            </Text>
                            {!achievement.unlocked && (
                                <Ionicons
                                    name="lock-closed"
                                    size={12}
                                    color="rgba(255,255,255,0.4)"
                                    style={styles.lockIcon}
                                />
                            )}
                        </LinearGradient>
                    </View>
                ))}
            </View>
        </View>
    );
}

function MatchHistoryTab() {
    return (
        <View style={styles.panel}>
            <Text style={styles.panelTitle}>Recent Matches</Text>

            {MOCK_MATCHES.map((match) => {
                const isWin = match.result === 'win';
                return (
                    <View key={match.id} style={styles.matchCard}>
                        <View
                            style={[
                                styles.matchResultBadge,
                                isWin
                                    ? styles.matchWinBadge
                                    : styles.matchLossBadge,
                            ]}
                        >
                            <Ionicons
                                name={isWin ? 'checkmark' : 'close'}
                                size={16}
                                color="#fff"
                            />
                        </View>

                        <View style={styles.matchInfo}>
                            <View style={styles.matchTopRow}>
                                <Text style={styles.matchMode}>{match.mode}</Text>
                                <Text style={styles.matchDate}>{match.date}</Text>
                            </View>
                            <Text style={styles.matchOpponents} numberOfLines={2}>
                                vs {match.opponents}
                            </Text>
                            <Text style={styles.matchDuration}>{match.duration}</Text>
                        </View>

                        <View style={styles.matchEloWrap}>
                            <Text
                                style={[
                                    styles.matchElo,
                                    isWin ? styles.matchEloWin : styles.matchEloLoss,
                                ]}
                            >
                                {match.eloChange > 0 ? '+' : ''}
                                {match.eloChange}
                            </Text>
                            <Text style={styles.matchEloLabel}>ELO</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 14,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitles: {
        flex: 1,
        alignItems: 'center',
    },
    headerEyebrow: {
        color: '#FFD700',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '900',
        marginTop: 2,
    },
    editBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroCard: {
        borderRadius: 22,
        padding: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(255,215,0,0.45)',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    heroTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
    },
    avatarRing: {
        width: 86,
        height: 86,
        borderRadius: 43,
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 78,
        height: 78,
        borderRadius: 39,
        borderWidth: 2,
        borderColor: '#00146D',
    },
    heroInfo: {
        flex: 1,
        minWidth: 0,
    },
    username: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '900',
    },
    countryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    flagBadge: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    flagText: {
        color: '#FFD700',
        fontSize: 10,
        fontWeight: '800',
    },
    country: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 13,
        fontWeight: '600',
        flex: 1,
    },
    rankRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
        flexWrap: 'wrap',
    },
    rankText: {
        color: '#FFD700',
        fontSize: 13,
        fontWeight: '800',
    },
    eloChip: {
        backgroundColor: 'rgba(0,0,0,0.35)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
    },
    eloChipText: {
        color: '#FFD700',
        fontSize: 11,
        fontWeight: '800',
    },
    summaryGrid: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: 16,
        paddingVertical: 12,
    },
    summaryStat: {
        flex: 1,
        alignItems: 'center',
        gap: 2,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '900',
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: 16,
        padding: 4,
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tabBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingVertical: 10,
        borderRadius: 12,
    },
    tabBtnActive: {
        backgroundColor: '#FFD700',
    },
    tabLabel: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 11,
        fontWeight: '800',
    },
    tabLabelActive: {
        color: '#00146D',
    },
    tabLabelCompact: {
        fontSize: 9,
    },
    tabContent: {
        minHeight: 200,
    },
    panel: {
        backgroundColor: 'rgba(0,20,109,0.72)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 14,
    },
    panelTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    winRateCard: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 14,
        padding: 14,
        gap: 8,
    },
    winRateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    winRateLabel: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 12,
        fontWeight: '700',
    },
    winRateValue: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: '900',
    },
    progressTrack: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressLegend: {
        marginTop: 2,
    },
    legendText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    statCard: {
        width: '48%',
        backgroundColor: 'rgba(0,0,0,0.28)',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        gap: 4,
    },
    statIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: 'rgba(255,215,0,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statCardValue: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
        marginTop: 4,
    },
    statCardValueCompact: {
        fontSize: 14,
    },
    statCardLabel: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 10,
        fontWeight: '600',
        lineHeight: 13,
    },
    eloCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(66,165,245,0.12)',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(66,165,245,0.3)',
    },
    eloCardInfo: {
        flex: 1,
    },
    eloCardTitle: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
    },
    eloCardSub: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    eloCardValue: {
        color: '#42A5F5',
        fontSize: 22,
        fontWeight: '900',
    },
    achievementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    achievementCount: {
        color: '#FFD700',
        fontSize: 11,
        fontWeight: '700',
    },
    achievementGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'space-between',
    },
    achievementCard: {
        width: '48%',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.35)',
    },
    achievementCardCompact: {
        width: '48%',
    },
    achievementLocked: {
        borderColor: 'rgba(255,255,255,0.12)',
        opacity: 0.85,
    },
    achievementGradient: {
        padding: 12,
        minHeight: 130,
        justifyContent: 'flex-start',
    },
    achievementIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    achievementIconUnlocked: {
        backgroundColor: 'rgba(255,215,0,0.2)',
    },
    achievementIconLocked: {
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    achievementTitle: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
    },
    achievementTitleLocked: {
        color: 'rgba(255,255,255,0.5)',
    },
    achievementDesc: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 10,
        fontWeight: '600',
        marginTop: 4,
        lineHeight: 13,
    },
    lockIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    matchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(0,0,0,0.28)',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    matchResultBadge: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    matchWinBadge: {
        backgroundColor: '#2E7D32',
    },
    matchLossBadge: {
        backgroundColor: '#C62828',
    },
    matchInfo: {
        flex: 1,
        minWidth: 0,
    },
    matchTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    matchMode: {
        color: '#FFD700',
        fontSize: 11,
        fontWeight: '800',
    },
    matchDate: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 10,
        fontWeight: '600',
    },
    matchOpponents: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    matchDuration: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 10,
        fontWeight: '600',
        marginTop: 3,
    },
    matchEloWrap: {
        alignItems: 'center',
        minWidth: 44,
    },
    matchElo: {
        fontSize: 16,
        fontWeight: '900',
    },
    matchEloWin: {
        color: '#4CAF50',
    },
    matchEloLoss: {
        color: '#E53935',
    },
    matchEloLabel: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 9,
        fontWeight: '700',
        marginTop: 2,
    },
});
