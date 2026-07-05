import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ScrollView,
} from 'react-native';

const RulesScreen = () => {
    return (
        <ImageBackground
            source={require('../assets/images/bg-login2.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Game Rules</Text>

                <Text style={styles.rule}>
                    1. Each player takes turns making a move on the board.
                </Text>

                <Text style={styles.rule}>
                    2. Players must make a valid move within the allotted time.
                </Text>

                <Text style={styles.rule}>
                    3. If a player disconnects, the game may be paused or forfeited.
                </Text>

                <Text style={styles.rule}>
                    4. Respect other players and avoid inappropriate language.
                </Text>

                <Text style={styles.rule}>
                    5. Using cheats, hacks, or exploits is strictly prohibited.
                </Text>

                <Text style={styles.rule}>
                    6. The winner is determined according to the game objective.
                </Text>

                <Text style={styles.rule}>
                    7. In case of a draw, both players receive equal rewards.
                </Text>

                <Text style={styles.rule}>
                    8. Repeated violations may result in account suspension.
                </Text>

                <Text style={styles.rule}>
                    9. Ensure a stable internet connection for the best experience.
                </Text>

                <Text style={styles.rule}>
                    10. Have fun and play fairly!
                </Text>
            </ScrollView>
        </ImageBackground>
    );
};

export default RulesScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        padding: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 25,
    },
    rule: {
        fontSize: 16,
        color: '#fff',
        lineHeight: 26,
        marginBottom: 12,
        backgroundColor: 'rgba(0,0,0,0.35)',
        padding: 12,
        borderRadius: 10,
    },
});