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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={['#00146D', '#001A80', '#00146D']}
      style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />

          <TouchableOpacity onPress={() => { navigation.navigate("Settings") }}>
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
              <TouchableOpacity style={styles.playBtn}>
                <Text style={styles.playText}>Play Now</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Cards */}
        <View style={styles.cardsRow}>
          <LinearGradient
            colors={['#FF0000', '#A8002A']}
            style={styles.actionCard}>

            <View style={{ height: 100 }}>
              <Text style={styles.cardTitle}>Play vs AI</Text>
              <Text style={styles.cardSubtitle}>
                Challenge the{'\n'}Computer
              </Text>
            </View>


            <TouchableOpacity style={styles.arrowBtn}>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </TouchableOpacity>

            <Image
              source={require('../assets/images/robot.png')}
              style={styles.heroImage1}
            />
          </LinearGradient>

          <LinearGradient
            colors={['#FF0000', '#A8002A']}
            style={styles.actionCard}>

            <View style={{ height: 100 }}>
              <Text style={styles.cardTitle}>Practice{'\n'}Mode</Text>
              <Text style={styles.cardSubtitle}>Improve Your Skills</Text>
            </View>


            <TouchableOpacity style={styles.arrowBtn}>
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
    paddingBottom: 100
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 30,
  },

  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  heroCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden', // important
    minHeight: 180,
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
    width: 100,
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
    fontSize: 16,
  },

  heroImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  heroImage1: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    marginTop: 20
  },

  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 15,
  },

  actionCard: {
    width: '48%',
    height: 320,
    borderRadius: 30,
    padding: 18,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 21,
    fontWeight: 'bold',
  },

  cardSubtitle: {
    color: '#fff',
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'regular',

  },

  arrowBtn: {
    marginTop: 20,
    width: 60,
    height: 28,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },


});