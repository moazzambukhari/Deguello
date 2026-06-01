import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TutorialScreen = () => {
    return (
        <LinearGradient
            colors={['#00084D', '#0010A0']}
            style={styles.container}
        >
            <Text style={styles.title}>How to Play</Text>

            <Text style={styles.subtitle}>
                Consectetur adipiscing elit ut cursus diam.
            </Text>

            <View style={styles.videoContainer}>
                <Image
                    source={require('../assets/images/video.png')}
                    style={styles.videoImage}
                />

                {/* Play Button */}
                <TouchableOpacity style={styles.playButton}>
                    <Ionicons
                        name="play"
                        size={28}
                        color="#fff"
                    />
                </TouchableOpacity>

                {/* Progress Bar */}
                <View style={styles.controls}>
                    <View style={styles.progressTrack}>
                        <View style={styles.progressFill} />
                        <View style={styles.progressDot} />
                    </View>

                    <Ionicons
                        name="ellipsis-horizontal"
                        size={20}
                        color="#fff"
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default TutorialScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 18,
        paddingTop: 30,
    },

    title: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#D0D0D0',
        fontSize: 12,
        marginTop: 4,
        marginBottom: 15,
    },

    videoContainer: {
        flex: 1,
        borderRadius: 25,
        overflow: 'hidden',
        position: 'relative',
    },

    videoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    playButton: {
        position: 'absolute',
        top: '45%',
        alignSelf: 'center',
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: 'rgba(255,120,120,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    controls: {
        position: 'absolute',
        bottom: 20,
        left: 15,
        right: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },

    progressTrack: {
        flex: 1,
        height: 4,
        backgroundColor: '#fff',
        borderRadius: 2,
        marginRight: 10,
    },

    progressFill: {
        width: '55%',
        height: 4,
        backgroundColor: '#ff2d2d',
        borderRadius: 2,
    },

    progressDot: {
        position: 'absolute',
        left: '55%',
        top: -3,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ff2d2d',
    },

    skipButton: {
        height: 55,
        borderRadius: 12,
        backgroundColor: '#E30016',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },

    skipText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});