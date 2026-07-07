import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
    DEFAULT_TUTORIAL_VIDEOS,
    subscribeToTutorialVideos,
} from '../firebase/videos';
import type { TutorialVideo } from '../firebase/types';
import type { MainStackParamList } from '../navigation/types';

let VideoComponent: React.ComponentType<any> | null = null;

try {
    VideoComponent = require('react-native-video').default;
} catch {
    VideoComponent = null;
}

const TutorialScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const [videos, setVideos] = useState<TutorialVideo[]>(DEFAULT_TUTORIAL_VIDEOS);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [paused, setPaused] = useState(true);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<any>(null);

    useEffect(() => {
        const unsubscribe = subscribeToTutorialVideos(
            (nextVideos) => {
                if (nextVideos.length > 0) {
                    setVideos(nextVideos);
                    setCurrentIndex(0);
                }
                setLoading(false);
            },
            () => setLoading(false),
        );

        return unsubscribe;
    }, []);

    const currentVideo = videos[currentIndex];

    const handleSkip = useCallback(() => {
        if (currentIndex < videos.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setProgress(0);
            setPaused(true);
            return;
        }

        navigation.navigate('BottomTabs');
    }, [currentIndex, navigation, videos.length]);

    const handlePlayPress = useCallback(async () => {
        if (VideoComponent) {
            setPaused((prev) => !prev);
            return;
        }

        if (currentVideo?.videoUrl) {
            await Linking.openURL(currentVideo.videoUrl);
        }
    }, [currentVideo?.videoUrl]);

    if (loading) {
        return (
            <LinearGradient colors={['#00084D', '#0010A0']} style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#00084D', '#0010A0']} style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>How to Play</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddVideo')}
                >
                    <Ionicons name="add-circle-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
                {currentVideo?.description ?? 'Watch the tutorial to learn Deguello.'}
            </Text>

            <View style={styles.videoContainer}>
                {VideoComponent && currentVideo?.videoUrl ? (
                    <VideoComponent
                        ref={videoRef}
                        source={{ uri: currentVideo.videoUrl }}
                        style={styles.videoPlayer}
                        resizeMode="cover"
                        paused={paused}
                        onProgress={(data: { currentTime: number; playableDuration: number }) => {
                            if (data.playableDuration > 0) {
                                setProgress(data.currentTime / data.playableDuration);
                            }
                        }}
                        onEnd={() => {
                            setPaused(true);
                            setProgress(1);
                        }}
                    />
                ) : (
                    <Image
                        source={require('../assets/images/video.png')}
                        style={styles.videoImage}
                    />
                )}

                <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
                    <Ionicons
                        name={paused ? 'play' : 'pause'}
                        size={28}
                        color="#fff"
                    />
                </TouchableOpacity>

                <View style={styles.controls}>
                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${Math.min(progress * 100, 100)}%` },
                            ]}
                        />
                        <View
                            style={[
                                styles.progressDot,
                                { left: `${Math.min(progress * 100, 100)}%` },
                            ]}
                        />
                    </View>
                    <Text style={styles.videoCounter}>
                        {currentIndex + 1}/{videos.length}
                    </Text>
                </View>
            </View>

            <Text style={styles.videoTitle}>{currentVideo?.title}</Text>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>
                    {currentIndex < videos.length - 1 ? 'Next Tutorial' : 'Skip'}
                </Text>
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addButton: {
        padding: 4,
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
        backgroundColor: '#000',
    },
    videoPlayer: {
        width: '100%',
        height: '100%',
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
        height: 4,
        backgroundColor: '#ff2d2d',
        borderRadius: 2,
    },
    progressDot: {
        position: 'absolute',
        top: -3,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ff2d2d',
        marginLeft: -5,
    },
    videoCounter: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    videoTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 12,
    },
    skipButton: {
        height: 55,
        borderRadius: 12,
        backgroundColor: '#E30016',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
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
