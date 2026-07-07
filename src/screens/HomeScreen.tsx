import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createOrJoinMatch } from '../firebase/matches';
import { getCurrentUserId, getUserDocument } from '../firebase/users';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  // Play vs AI: create a room filled with AI opponents (host + 3 AI = ready),
  // then hand off to the Team screen with the real matchId.
  const handlePlayVsAi = async () => {
    try {
      const uid = getCurrentUserId();
      if (!uid) {
        Alert.alert('Error', 'Please login first.');
        return;
      }

      const user = await getUserDocument(uid);
      if (!user) {
        Alert.alert('Error', 'User profile not found.');
        return;
      }

      const matchId = await createOrJoinMatch(user, 'private', {
        visibility: 'private',
        aiDifficulty: 'medium',
      });

      navigation.navigate('Team', { matchId });
    } catch (e: any) {
      console.log('AI MATCH ERROR:', e);
      console.log('AI MATCH ERROR MESSAGE:', e?.message);

      Alert.alert('AI Error', e?.message ?? JSON.stringify(e));
    }
  };

  return (
    <LinearGradient
      colors={['#00146D', '#001A80', '#00146D']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <Image
              source={require('../assets/images/avatar2.png')}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <TouchableOpacity
          // colors={['#00B5FF', '#0072CE']}
          style={styles.heroCard}
        >
          <ImageBackground
            source={require('../assets/images/cover.png')}
            style={styles.heroBackground}
            imageStyle={styles.heroBackgroundImage}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.playBtn}
                onPress={() => navigation.navigate('Lobby' as never)}
              >
                <Text style={styles.playText}>Play Now</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Cards */}
        <View style={styles.cardsRow}>
          <LinearGradient
            colors={['#FF0000', '#A8002A']}
            style={styles.actionCard}
          >
            <View
              style={{
                minHeight: width < 350 ? 80 : 100,
                justifyContent: 'flex-start',
              }}
            >
              <Text style={styles.cardTitle}>Play vs AI</Text>
              <Text style={styles.cardSubtitle}>
                Challenge the{'\n'}Computer
              </Text>
            </View>

            <TouchableOpacity style={styles.arrowBtn} onPress={handlePlayVsAi}>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </TouchableOpacity>

            <Image
              source={require('../assets/images/robot.png')}
              style={styles.heroImage1}
            />
          </LinearGradient>

          <LinearGradient
            colors={['#FF0000', '#A8002A']}
            style={styles.actionCard}
          >
            <View
              style={{
                minHeight: width < 350 ? 80 : 100,
                justifyContent: 'flex-start',
              }}
            >
              <Text style={styles.cardTitle}>Practice{'\n'}Mode</Text>
              <Text style={styles.cardSubtitle}>Improve Your Skills</Text>
            </View>

            <TouchableOpacity
              style={styles.arrowBtn}
              onPress={() =>
                (navigation as any).navigate('Game', { mode: 'practice' })
              }
            >
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </TouchableOpacity>

            <Image
              source={require('../assets/images/wire.png')}
              style={styles.heroImage1}
            />
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width < 350 ? 12 : 20,
    marginTop: 30,
  },

  logo: {
    width: width < 350 ? 70 : 90,
    height: width < 350 ? 70 : 90,
    resizeMode: 'contain',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  heroCard: {
    marginHorizontal: width < 350 ? 12 : 20,
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden', // important
    minHeight: width < 350 ? 150 : 180,
  },

  heroBackground: {
    flex: 1,
    padding: 18,
    flexDirection: 'row',
  },

  heroBackgroundImage: {
    borderRadius: 30,
    resizeMode: 'cover',
  },

  heroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },

  playBtn: {
    marginTop: 15,
    backgroundColor: '#E60012',
    width: width < 350 ? 80 : 100,
    height: 40,
    borderRadius: 15,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  playText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: width < 350 ? 13 : 16,
  },

  heroImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  heroImage1: {
    width: width < 350 ? 90 : 120,
    height: width < 350 ? 90 : 120,
    resizeMode: 'cover',
    marginTop: 10,
  },

  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width < 350 ? 12 : 20,
    marginTop: 15,
    gap: width < 350 ? 8 : 12,
  },

  actionCard: {
    width: '48%',
    height: width < 350 ? 280 : 320,
    borderRadius: 30,
    padding: width < 350 ? 12 : 18,
  },

  cardTitle: {
    color: '#fff',
    fontSize: width < 350 ? 16 : width < 380 ? 18 : 21,
    fontWeight: 'bold',
    flexShrink: 1,
  },

  cardSubtitle: {
    color: '#fff',
    marginTop: 5,
    fontSize: width < 350 ? 12 : width < 380 ? 13 : 15,
    fontWeight: '500',
    flexShrink: 1,
    lineHeight: width < 350 ? 16 : width < 380 ? 17 : 20,
  },

  arrowBtn: {
    marginTop: 20,
    width: width < 350 ? 50 : 60,
    height: 28,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
