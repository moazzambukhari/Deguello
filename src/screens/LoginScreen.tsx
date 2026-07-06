import React, { useState, useContext } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../navigation/AuthStack';
import { AuthContext } from '../navigation/AuthContext';
import auth from '@react-native-firebase/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email.trim(),
        password,
      );

      console.log('Logged in:', userCredential.user.uid);

      // Update AuthContext
      // signIn();

      Alert.alert('Success', 'Login Successful!');
    } catch (error: any) {
      console.log(error);

      switch (error.code) {
        case 'auth/invalid-email':
          Alert.alert('Error', 'Invalid email address.');
          break;

        case 'auth/user-not-found':
          Alert.alert('Error', 'No account found with this email.');
          break;

        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          Alert.alert('Error', 'Incorrect email or password.');
          break;

        case 'auth/too-many-requests':
          Alert.alert(
            'Error',
            'Too many login attempts. Please try again later.',
          );
          break;

        default:
          Alert.alert('Login Failed', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg-login2.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top,
              paddingBottom: Math.max(insets.bottom, 24),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces>
          <Image
            source={require('../assets/images/chees2.png')}
            style={styles.topImage}
            resizeMode="cover"
          />

          <View style={styles.contentContainer}>
            <Text style={styles.title}>Sign In</Text>

            <Text style={styles.subtitle}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut cursus
              a diam.
            </Text>

            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#8C90B8" />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#8C90B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#8C90B8" />
              <TextInput
                secureTextEntry={!showPassword}
                placeholder="Password"
                placeholderTextColor="#8C90B8"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(prev => !prev)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#8C90B8"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogin} activeOpacity={0.85} disabled={isLoading}>
              <LinearGradient
                colors={['#FF0000', '#B00000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signinBtn}>
                <Text style={styles.signinText}>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
              <MaterialIcons name="g-mobiledata" size={35} color="#EA4335" />
              <Text style={styles.googleText}>Continue with google</Text>
              <Icon name="arrow-right" size={22} color="red" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.footer}>
                Don&apos;t have an account?{'\n'}
                <Text style={styles.createNow}>Create Now</Text>
              </Text>
            </TouchableOpacity>

            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <ImageBackground
            source={require('../assets/images/bg-login2.png')}
            style={styles.bgImage}
            resizeMode="cover"
          >


          </ImageBackground>

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topImage: {
    width: '100%',
    height: 210,
  },
  contentContainer: {
    // backgroundColor: '#1A1D5D',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 16,
  },
  title: {
    fontSize: 27,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#D3D5EA',
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 25,
    fontSize: 16,
  },
  inputContainer: {
    height: 57,
    // borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8B8DB6',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: '#fff',
    fontSize: 16,
  },
  forgot: {
    color: '#fff',
    alignSelf: 'flex-end',
    marginBottom: 25,
    fontSize: 14,
    fontWeight: 500,
  },
  signinBtn: {
    height: 57,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 21,
  },
  googleBtn: {
    height: 57,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  googleText: {
    flex: 1,
    marginHorizontal: 12,
    color: '#111',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    color: '#fff',
    lineHeight: 20,
    fontSize: 16,
  },
  createNow: {
    fontWeight: '700',
  },
  logo: {
    width: 112,
    height: 83,
    alignSelf: 'center',
    marginTop: 20,
  },
});
