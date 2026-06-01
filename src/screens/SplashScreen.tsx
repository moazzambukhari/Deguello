import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
} from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/splash.jpg')}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.overlay} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});