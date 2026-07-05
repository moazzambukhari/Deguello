import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Team'>;

const TeamScreen = ({ navigation }: Props) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Game');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigation]);
    return (
        <ImageBackground
            source={require('../assets/images/team-bg.png')}
            style={styles.container}
        >
            {/* Team A */}
            <View style={styles.topSection}>
                <Text style={styles.teamTitle}>Team A</Text>

                <View style={styles.redCard}>
                    <Image
                        source={require('../assets/images/avatar2.png')}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.playerName}>Player Name</Text>
                        <Text style={styles.playerDetails}>Details here...</Text>
                    </View>
                </View>

                <View style={styles.whiteCard}>
                    <Image
                        source={require('../assets/images/avatar2.png')}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.darkName}>Player Name</Text>
                        <Text style={styles.darkDetails}>Details here...</Text>
                    </View>
                </View>
            </View>

            {/* VS */}
            <View style={styles.centerContainer}>
                <Text style={styles.vsText}>VS</Text>
            </View>

            {/* Team B */}
            <View style={styles.bottomSection}>
                <Text style={styles.teamTitle}>Team B</Text>

                <View style={styles.darkCard}>
                    <View>
                        <Text style={styles.playerName}>Player Name</Text>
                        <Text style={styles.playerDetails}>Details here...</Text>
                    </View>

                    <Image
                        source={require('../assets/images/avatar2.png')}
                        style={styles.avatar}
                    />
                </View>

                <View style={styles.darkCard}>
                    <View>
                        <Text style={styles.playerName}>Player Name</Text>
                        <Text style={styles.playerDetails}>Details here...</Text>
                    </View>

                    <Image
                        source={require('../assets/images/avatar2.png')}
                        style={styles.avatar}
                    />
                </View>
            </View>
        </ImageBackground>
    );
};

export default TeamScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },

    topSection: {
        marginTop: 40,
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
        width: 180,
        height: 55,
        backgroundColor: '#E61C23',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 8,
    },

    whiteCard: {
        width: 180,
        height: 55,
        backgroundColor: '#F2F2F2',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },

    darkCard: {
        width: 180,
        height: 55,
        backgroundColor: '#0A1C4D',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
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