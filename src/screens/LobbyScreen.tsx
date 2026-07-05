import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type MatchVisibility = 'public' | 'private';
type AiDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

const MOCK_PLAYER = {
    name: 'Commander',
    rank: 'Gold III',
    wins: 42,
    losses: 18,
    elo: 1487,
};

const VISIBILITY_OPTIONS: { key: MatchVisibility; label: string; icon: string }[] =
    [
        { key: 'public', label: 'Public', icon: 'globe-outline' },
        { key: 'private', label: 'Private', icon: 'lock-closed-outline' },
    ];

const AI_DIFFICULTY_OPTIONS: { key: AiDifficulty; label: string }[] = [
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
    { key: 'expert', label: 'Expert' },
];

export default function LobbyScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isCompact = width < 380;

    const [visibility, setVisibility] = useState<MatchVisibility>('public');
    const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>('medium');

    const showLobbyToast = (title: string, message: string) => {
        Alert.alert(title, message);
    };

    const handleCreateMatch = () => {
        showLobbyToast(
            'Match Created',
            `${visibility === 'public' ? 'Public' : 'Private'} room is ready. Waiting for players…`,
        );
    };

    const handleJoinMatch = () => {
        showLobbyToast('Join Match', 'Enter a room code to join (coming soon).');
    };

    const handleQuickMatch = () => {
        navigation.navigate('Team');
    };

    const handleInviteFriends = () => {
        showLobbyToast(
            'Invite Sent',
            'Your friends will receive a Deguello invite link.',
        );
    };

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
                        paddingBottom: insets.bottom + 24,
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
                        <Text style={styles.headerEyebrow}>MULTIPLAYER</Text>
                        <Text style={styles.headerTitle}>Battle Lobby</Text>
                    </View>
                    <View style={styles.headerSpacer} />
                </View>

                <LinearGradient
                    colors={['rgba(255,215,0,0.18)', 'rgba(0,20,109,0.85)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.profileCard}
                >
                    <View style={styles.profileTop}>
                        <View style={styles.avatarWrap}>
                            <LinearGradient
                                colors={['#FFD700', '#FF8C00', '#FFD700']}
                                style={styles.avatarRing}
                            >
                                <Image
                                    source={require('../assets/images/avatar2.png')}
                                    style={styles.avatar}
                                />
                            </LinearGradient>
                            <View style={styles.rankBadge}>
                                <Ionicons name="shield" size={10} color="#00146D" />
                                <Text style={styles.rankBadgeText}>
                                    {MOCK_PLAYER.rank}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.playerName}>{MOCK_PLAYER.name}</Text>
                            <Text style={styles.playerSubtitle}>
                                Deguello Strategist
                            </Text>
                            <View style={styles.eloPill}>
                                <Ionicons name="trophy" size={12} color="#FFD700" />
                                <Text style={styles.eloText}>
                                    {MOCK_PLAYER.elo} ELO
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <StatBlock
                            label="Rank"
                            value={MOCK_PLAYER.rank}
                            icon="ribbon-outline"
                            accent="#FFD700"
                        />
                        <View style={styles.statDivider} />
                        <StatBlock
                            label="Wins"
                            value={String(MOCK_PLAYER.wins)}
                            icon="checkmark-circle-outline"
                            accent="#4CAF50"
                        />
                        <View style={styles.statDivider} />
                        <StatBlock
                            label="Losses"
                            value={String(MOCK_PLAYER.losses)}
                            icon="close-circle-outline"
                            accent="#E53935"
                        />
                        <View style={styles.statDivider} />
                        <StatBlock
                            label="ELO"
                            value={String(MOCK_PLAYER.elo)}
                            icon="trending-up-outline"
                            accent="#42A5F5"
                        />
                    </View>
                </LinearGradient>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="settings-outline" size={18} color="#FFD700" />
                        <Text style={styles.sectionTitle}>Match Settings</Text>
                    </View>

                    <Text style={styles.settingLabel}>Room Visibility</Text>
                    <View style={styles.segmentRow}>
                        {VISIBILITY_OPTIONS.map((option) => (
                            <SegmentButton
                                key={option.key}
                                label={option.label}
                                icon={option.icon}
                                selected={visibility === option.key}
                                onPress={() => setVisibility(option.key)}
                                compact={isCompact}
                            />
                        ))}
                    </View>

                    <Text style={[styles.settingLabel, styles.settingLabelSpaced]}>
                        AI Difficulty
                    </Text>
                    <View style={styles.difficultyRow}>
                        {AI_DIFFICULTY_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.key}
                                style={[
                                    styles.difficultyChip,
                                    aiDifficulty === option.key &&
                                        styles.difficultyChipActive,
                                ]}
                                onPress={() => setAiDifficulty(option.key)}
                                activeOpacity={0.85}
                            >
                                <Text
                                    style={[
                                        styles.difficultyText,
                                        aiDifficulty === option.key &&
                                            styles.difficultyTextActive,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.actionsGrid}>
                    <LobbyActionButton
                        title="Create Match"
                        subtitle="Host a 4-player room"
                        icon="add-circle"
                        colors={['#FFD700', '#FF8C00']}
                        textColor="#00146D"
                        onPress={handleCreateMatch}
                        compact={isCompact}
                    />
                    <LobbyActionButton
                        title="Join Match"
                        subtitle="Enter room code"
                        icon="enter-outline"
                        colors={['#1E88E5', '#0D47A1']}
                        onPress={handleJoinMatch}
                        compact={isCompact}
                    />
                    <LobbyActionButton
                        title="Quick Match"
                        subtitle="Find players instantly"
                        icon="flash"
                        colors={['#E53935', '#B71C1C']}
                        onPress={handleQuickMatch}
                        compact={isCompact}
                    />
                    <LobbyActionButton
                        title="Invite Friends"
                        subtitle="Share battle link"
                        icon="people"
                        colors={['#7B1FA2', '#4A148C']}
                        onPress={handleInviteFriends}
                        compact={isCompact}
                    />
                </View>

                <View style={styles.footerNote}>
                    <Ionicons
                        name="information-circle-outline"
                        size={14}
                        color="rgba(255,255,255,0.5)"
                    />
                    <Text style={styles.footerNoteText}>
                        Lobby is UI preview only — no live matchmaking yet.
                    </Text>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

function StatBlock({
    label,
    value,
    icon,
    accent,
}: {
    label: string;
    value: string;
    icon: string;
    accent: string;
}) {
    return (
        <View style={styles.statBlock}>
            <Ionicons name={icon} size={14} color={accent} />
            <Text style={styles.statValue} numberOfLines={1}>
                {value}
            </Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

function SegmentButton({
    label,
    icon,
    selected,
    onPress,
    compact,
}: {
    label: string;
    icon: string;
    selected: boolean;
    onPress: () => void;
    compact?: boolean;
}) {
    return (
        <TouchableOpacity
            style={[styles.segmentBtn, selected && styles.segmentBtnActive]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Ionicons
                name={icon}
                size={compact ? 16 : 18}
                color={selected ? '#00146D' : 'rgba(255,255,255,0.75)'}
            />
            <Text
                style={[
                    styles.segmentText,
                    selected && styles.segmentTextActive,
                    compact && styles.segmentTextCompact,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

function LobbyActionButton({
    title,
    subtitle,
    icon,
    colors,
    textColor = '#FFFFFF',
    onPress,
    compact,
}: {
    title: string;
    subtitle: string;
    icon: string;
    colors: [string, string];
    textColor?: string;
    onPress: () => void;
    compact?: boolean;
}) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.actionTouchable}>
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.actionBtn, compact && styles.actionBtnCompact]}
            >
                <View style={styles.actionIconWrap}>
                    <Ionicons name={icon} size={compact ? 22 : 26} color={textColor} />
                </View>
                <Text style={[styles.actionTitle, { color: textColor }]}>{title}</Text>
                <Text
                    style={[
                        styles.actionSubtitle,
                        { color: textColor === '#FFFFFF' ? 'rgba(255,255,255,0.8)' : 'rgba(0,20,109,0.75)' },
                    ]}
                >
                    {subtitle}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
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
    headerSpacer: {
        width: 40,
    },
    profileCard: {
        borderRadius: 22,
        padding: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(255,215,0,0.45)',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },
    profileTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
    },
    avatarWrap: {
        alignItems: 'center',
    },
    avatarRing: {
        width: 78,
        height: 78,
        borderRadius: 39,
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#00146D',
    },
    rankBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: -10,
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#00146D',
    },
    rankBadgeText: {
        color: '#00146D',
        fontSize: 9,
        fontWeight: '800',
    },
    profileInfo: {
        flex: 1,
        minWidth: 0,
    },
    playerName: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
    },
    playerSubtitle: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    eloPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 5,
        marginTop: 8,
        backgroundColor: 'rgba(0,0,0,0.35)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.35)',
    },
    eloText: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '800',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    statBlock: {
        flex: 1,
        alignItems: 'center',
        gap: 3,
        minWidth: 0,
    },
    statValue: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.4,
        textTransform: 'uppercase',
    },
    statDivider: {
        width: 1,
        height: 36,
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    sectionCard: {
        backgroundColor: 'rgba(0,20,109,0.72)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    settingLabel: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    settingLabelSpaced: {
        marginTop: 16,
    },
    segmentRow: {
        flexDirection: 'row',
        gap: 10,
    },
    segmentBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    segmentBtnActive: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
    },
    segmentText: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 14,
        fontWeight: '800',
    },
    segmentTextActive: {
        color: '#00146D',
    },
    segmentTextCompact: {
        fontSize: 12,
    },
    difficultyRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    difficultyChip: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    difficultyChipActive: {
        backgroundColor: 'rgba(255,215,0,0.2)',
        borderColor: '#FFD700',
    },
    difficultyText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '700',
    },
    difficultyTextActive: {
        color: '#FFD700',
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    actionTouchable: {
        width: '48%',
    },
    actionBtn: {
        borderRadius: 18,
        padding: 14,
        minHeight: 118,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    actionBtnCompact: {
        minHeight: 108,
        padding: 12,
    },
    actionIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionTitle: {
        fontSize: 15,
        fontWeight: '900',
        marginTop: 10,
    },
    actionSubtitle: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
        lineHeight: 14,
    },
    footerNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 4,
    },
    footerNoteText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        fontWeight: '500',
    },
});
