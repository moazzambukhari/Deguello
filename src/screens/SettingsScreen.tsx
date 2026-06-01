import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const SettingsScreen = () => {
    return (
        <LinearGradient
            colors={['#00084D', '#0010A0']}
            style={styles.container}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Logo */}
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                />

                {/* Profile Card */}
                <LinearGradient
                    colors={['#FF0000', '#B30020']}
                    style={styles.profileCard}
                >
                    <View style={styles.profileRow}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={require('../assets/images/avatar2.png')}
                                style={styles.logo}
                            />

                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.title}>Personal Info</Text>

                            <Text style={styles.description}>
                                Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit.
                            </Text>

                            <TouchableOpacity style={styles.editBtn}>
                                <Text style={styles.editText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

                {/* History Card */}
                <LinearGradient
                    colors={['#009DFF', '#005FB9']}
                    style={styles.historyCard}
                >
                    <View style={styles.historyHeader}>
                        <View>
                            <Text style={styles.historyTitle}>History</Text>
                            <Text style={styles.historySub}>
                                Dolor sit amet{'\n'}
                                consectete adipiscing...
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.viewBtn}>
                            <View style={styles.innerShadow} />
                            <Text style={styles.viewText}>View</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.historyImages}>
                        <Image
                            source={require('../assets/images/one.png')}
                            style={styles.historyImage}
                        />

                        <Image
                            source={require('../assets/images/two.png')}
                            style={styles.historyImage}
                        />
                    </View>
                </LinearGradient>

                {/* About Card */}
                <LinearGradient
                    colors={['#009DFF', '#005FB9']}
                    style={styles.aboutCard}
                >
                    <View style={styles.aboutRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.aboutTitle}>
                                About{'\n'}Deguello
                            </Text>
                        </View>

                        <Image
                            source={require('../assets/images/chess-board.png')}
                            style={styles.boardImage}
                        />
                    </View>
                </LinearGradient>

                <View style={{ height: 100 }} />
            </ScrollView>
        </LinearGradient>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    logo: {
        width: 120,
        height: 80,
        alignSelf: 'center',
        marginTop: 15,
        resizeMode: 'contain',
    },

    profileCard: {
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 25,
        padding: 12,
    },

    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        width: 95,
        height: 95,
        borderRadius: 20,
        backgroundColor: '#fff',
    },

    infoContainer: {
        flex: 1,
        marginLeft: 15,
    },

    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
    },

    description: {
        color: '#fff',
        fontSize: 12,
        marginTop: 5,
    },

    editBtn: {
        backgroundColor: '#0087FF',
        width: 100,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },

    editText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },

    historyCard: {
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 25,
        padding: 15,
    },

    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    historyTitle: {
        color: '#fff',
        fontSize: 21,
        fontWeight: 'bold',
    },

    historySub: {
        color: '#fff',
        fontSize: 14,
    },

    viewBtn: {
        width: 90,
        height: 40,
        backgroundColor: '#FF0000',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,

        elevation: 8,
    },

    innerShadow: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '70%',
        height: '50%',
        backgroundColor: 'rgba(0,0,0,0.18)',
        borderBottomRightRadius: 12,
        borderTopLeftRadius: 12,
    },

    viewText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },

    historyImages: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },

    historyImage: {
        width: '48%',
        height: 170,
        borderRadius: 20,
        resizeMode: 'cover',
    },

    aboutCard: {
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 25,
        padding: 15,
    },

    aboutRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    aboutTitle: {
        color: '#7E90C8',
        fontSize: 21,
        fontWeight: 'bold',
    },

    boardImage: {
        width: 120,
        height: 80,
        resizeMode: 'contain',
    },
    avatarContainer: {
        width: 95,
        height: 95,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});