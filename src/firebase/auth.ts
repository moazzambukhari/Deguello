import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const signUp = async (
  fullName: string,
  email: string,
  phone: string,
  password: string,
) => {
  // Create Firebase Auth user
  const credential = await auth().createUserWithEmailAndPassword(
    email,
    password,
  );

  const user = credential.user;

  // Update display name
  await user.updateProfile({
    displayName: fullName,
  });

  // Save extra information in Firestore
  await firestore().collection('users').doc(user.uid).set({
    uid: user.uid,
    fullName,
    email,
    phone,
    avatar: '',
    createdAt: firestore.FieldValue.serverTimestamp(),
    status: 'online',
  });

  return user;
};