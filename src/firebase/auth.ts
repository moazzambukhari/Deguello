import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { createNotification } from './notifications';

export const signUp = async (
  fullName: string,
  email: string,
  phone: string,
  password: string,
) => {
  const credential = await auth().createUserWithEmailAndPassword(
    email,
    password,
  );

  const user = credential.user;

  await user.updateProfile({
    displayName: fullName,
  });

  await firestore().collection('users').doc(user.uid).set({
    uid: user.uid,
    fullName,
    email,
    phone,
    avatar: '',
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    elo: 1200,
    createdAt: firestore.FieldValue.serverTimestamp(),
    status: 'online',
  });

  await createNotification({
    userId: user.uid,
    title: 'Welcome to Deguello',
    message: 'Your account is ready. Jump into a match from the home screen.',
    type: 'system',
    read: false,
  });

  return user;
};

export const signIn = async (email: string, password: string) => {
  const credential = await auth().signInWithEmailAndPassword(
    email.trim(),
    password,
  );

  await firestore().collection('users').doc(credential.user.uid).update({
    status: 'online',
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  return credential;
};

export const signOut = async () => {
  const uid = auth().currentUser?.uid;
  if (uid) {
    await firestore().collection('users').doc(uid).update({
      status: 'offline',
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  await auth().signOut();
};

export const sendPasswordReset = async (email: string) => {
  await auth().sendPasswordResetEmail(email.trim());
};
