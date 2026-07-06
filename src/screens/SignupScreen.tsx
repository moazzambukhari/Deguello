import React, { useState, useContext } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../navigation/AuthStack';
import { AuthContext } from '../navigation/AuthContext';
import { signUp } from '../firebase/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { signIn } = useContext(AuthContext);

  const handleSignup = async () => {
    if (!fullName || !email || !phone || !password) {
      Alert.alert('Missing Fields', 'Please fill all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password should be at least 6 characters.',
      );
      return;
    }

    setIsLoading(true);

    try {
      const user = await signUp(
        fullName,
        email.trim(),
        phone.trim(),
        password,
      );

      console.log('Firebase User:', user.uid);

      // If your AuthContext manages authentication state,
      // call signIn() or update it here.
      signIn();

      Alert.alert('Success', 'Account created successfully.');
    } catch (error: any) {
      console.log(error);

      switch (error.code) {
        case 'auth/email-already-in-use':
          Alert.alert(
            'Email Already Exists',
            'This email is already registered.',
          );
          break;

        case 'auth/invalid-email':
          Alert.alert('Invalid Email', 'Please enter a valid email.');
          break;

        case 'auth/weak-password':
          Alert.alert(
            'Weak Password',
            'Password should be at least 6 characters.',
          );
          break;

        default:
          Alert.alert('Signup Failed', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../assets/images/bg-login2.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces>
          <Image
            source={require('../assets/images/chees.png')}
            style={styles.topImage}
            resizeMode="cover"
          />
          <ImageBackground
            source={require('../assets/images/bg-login2.png')}
            style={styles.bgImage}
            resizeMode="cover"
          >
            <View style={styles.content}>
              <Text style={styles.title}>Create Account</Text>

              <Text style={styles.subtitle}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut cursus
                a diam.
              </Text>

              <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#9EA1C4" />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="#9EA1C4"
                  value={fullName}
                  onChangeText={setFullName}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="mail" size={20} color="#9EA1C4" />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#9EA1C4"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="phone" size={20} color="#9EA1C4" />
                <TextInput
                  placeholder="Phone"
                  placeholderTextColor="#9EA1C4"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#9EA1C4" />
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!showPass}
                  placeholderTextColor="#9EA1C4"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowPass(prev => !prev)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Icon
                    name={showPass ? 'eye' : 'eye-off'}
                    size={20}
                    color="#9EA1C4"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleSignup} activeOpacity={0.85} disabled={isLoading}>
                <LinearGradient
                  colors={['#FF0000', '#C70000']}
                  style={styles.signupBtn}>
                  <Text style={styles.signupText}>{isLoading ? 'Creating Account...' : 'Create Account'}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
                <MaterialIcons name="g-mobiledata" size={35} color="#EA4335" />
                <Text style={styles.googleText}>Continue with google</Text>
                <Icon name="arrow-right" size={22} color="red" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerText}>
                  Already have an account?{'\n'}
                  <Text style={styles.signin}>Sign In Now</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </ScrollView>
      </ImageBackground>

    </KeyboardAvoidingView>
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
    height: 250,
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
  },
  content: {
    // backgroundColor: '#1A1D5D',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 16,
  },
  title: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '700',
  },
  subtitle: {
    color: '#D1D2E5',
    marginTop: 10,
    marginBottom: 25,
    lineHeight: 22,
  },
  inputContainer: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8B8DB6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 12,
    fontSize: 16,
  },
  signupBtn: {
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  googleBtn: {
    backgroundColor: '#fff',
    height: 58,
    borderRadius: 16,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  googleText: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  footerText: {
    marginTop: 35,
    textAlign: 'center',
    color: '#D5D5E8',
    lineHeight: 28,
    fontSize: 16,
  },
  signin: {
    fontWeight: '700',
    color: '#fff',
  },
});
