import React, { useMemo, useState, useEffect, useContext } from 'react';
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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type ProfileTab = 'statistics' | 'achievements' | 'history';



const TABS: { key: ProfileTab; label: string; icon: string }[] = [
    { key: 'statistics', label: 'Statistics', icon: 'bar-chart-outline' },
    { key: 'achievements', label: 'Achievements', icon: 'medal-outline' },
    { key: 'history', label: 'Match History', icon: 'list-outline' },
];

export default function ProfileScreen() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isCompact = width < 380;


    const [activeTab, setActiveTab] = useState<ProfileTab>('statistics');
    const profile = {
        username: userData?.fullName || "Player",
        email: userData?.email || "",
        phone: userData?.phone || "",
        avatar:
            userData?.avatar ||
            require("../assets/images/avatar2.png"),
    };


    const gamesPlayed = profile?.gamesPlayed || 0;
    const wins = profile?.wins || 0;

    const winRate =
        gamesPlayed > 0
            ? `${Math.round((wins / gamesPlayed) * 100)}%`
            : '0%';


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const uid = auth().currentUser?.uid;

                if (!uid) return;

                const doc = await firestore()
                    .collection('users')
                    .doc(uid)
                    .get();

                if (doc.exists()) {
                    setUserData(doc.data());
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text>Loading...</Text>
            </View>
        );
    }

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
                        <Ionicons name="chevron-back" size={22} color="#FF0000" />
                    </TouchableOpacity>
                    <View style={styles.headerTitles}>
                        <Text style={styles.headerEyebrow}>PLAYER</Text>
                        <Text style={styles.headerTitle}>Profile</Text>
                    </View>
                    <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
                        <Ionicons name="create-outline" size={18} color="#FF0000" />
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
                            colors={['#FF0000', '#FF8C00', '#FF0000']}
                            style={styles.avatarRing}
                        >
                            <Image
                                source={require('../assets/images/avatar2.png')}
                                style={styles.avatar}
                            />
                        </LinearGradient>

                        <View style={styles.heroInfo}>
                            <Text style={styles.username}>{profile.username}</Text>
                            <View style={styles.countryRow}>
                                {/* <View style={styles.flagBadge}>
                                    <Text style={styles.flagText}>
                                        {MOCK_PROFILE.countryCode}
                                    </Text>
                                </View> */}
                                <Text style={styles.country}>
                                    {profile.email}
                                </Text>
                            </View>
                            <View style={styles.rankRow}>
                                <Ionicons name="shield" size={14} color="#FF0000" />
                                <Text style={styles.rankText}>{profile.phone}</Text>
                                {/* <View style={styles.eloChip}>
                                    <Text style={styles.eloChipText}>
                                        {MOCK_PROFILE.elo} ELO
                                    </Text>
                                </View> */}
                            </View>
                        </View>
                    </View>

                    <View style={styles.summaryGrid}>
                        <SummaryStat
                            label="Games"
                            value={String(profile?.gamesPlayed ?? 0)}
                        />

                        <SummaryStat
                            label="Wins"
                            value={String(profile?.wins ?? 0)}
                            accent="#4CAF50"
                        />

                        <SummaryStat
                            label="Losses"
                            value={String(profile?.losses ?? 0)}
                            accent="#E53935"
                        />

                        <SummaryStat
                            label="Win Rate"
                            value={winRate}
                            accent="#FF0000"
                        />
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
                        colors={['#4CAF50', '#FF0000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressFill, { width: `${winPct}%` }]}
                    />
                </View>

            </View>

            {/* <View style={styles.statsGrid}>
                {MOCK_STATS.map((stat) => (
                    <View key={stat.label} style={styles.statCard}>
                        <View style={styles.statIconWrap}>
                            <Ionicons name={stat.icon} size={16} color="#FF0000" />
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
            </View> */}

            <View style={styles.eloCard}>
                <Ionicons name="trending-up" size={20} color="#42A5F5" />
                <View style={styles.eloCardInfo}>
                    <Text style={styles.eloCardTitle}>Current Rating</Text>
                    <Text style={styles.eloCardSub}>
                        Peak ELO: 1524 · Season rank #{128}
                    </Text>
                </View>
            </View>
        </View>
    );
}

function AchievementsTab() {
    return (
        <View style={styles.panel}>
            <Text style={styles.panelTitle}>Achievements</Text>

            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 40,
                }}
            >
                <Ionicons
                    name="trophy-outline"
                    size={60}
                    color="#FF0000"
                />

                <Text
                    style={{
                        color: '#fff',
                        fontSize: 18,
                        marginTop: 15,
                        fontWeight: '600',
                    }}
                >
                    No Achievements Yet
                </Text>

                <Text
                    style={{
                        color: '#9AA4C7',
                        marginTop: 8,
                        textAlign: 'center',
                    }}
                >
                    Play games to unlock achievements.
                </Text>
            </View>
        </View>
    );
}

function MatchHistoryTab() {
    return (
        <View style={styles.panel}>
            <Text style={styles.panelTitle}>Match History</Text>

            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 40,
                }}
            >
                <Ionicons
                    name="game-controller-outline"
                    size={60}
                    color="#FF0000"
                />

                <Text
                    style={{
                        color: '#fff',
                        fontSize: 18,
                        marginTop: 15,
                        fontWeight: '600',
                    }}
                >
                    No Matches Played
                </Text>

                <Text
                    style={{
                        color: '#9AA4C7',
                        marginTop: 8,
                        textAlign: 'center',
                    }}
                >
                    Your recent matches will appear here.
                </Text>
            </View>
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
        color: '#FF0000',
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
        shadowColor: '#FF0000',
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
        color: '#FF0000',
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
        color: '#FF0000',
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
        color: '#FF0000',
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
        backgroundColor: '#FF0000',
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
        color: '#FF0000',
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
        color: '#FF0000',
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
        color: '#FF0000',
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
