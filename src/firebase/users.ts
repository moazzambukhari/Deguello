import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import type { UserDocument } from './types';

const usersCollection = () => firestore().collection('users');

export const getCurrentUserId = () => auth().currentUser?.uid ?? null;

export const getUserDocument = async (
  uid: string,
): Promise<UserDocument | null> => {
  const doc = await usersCollection().doc(uid).get();
  if (!doc.exists) {
    return null;
  }

  return { uid, ...(doc.data() as Omit<UserDocument, 'uid'>) };
};

export const subscribeToUser = (
  uid: string,
  onUpdate: (user: UserDocument | null) => void,
  onError?: (error: Error) => void,
) =>
  usersCollection()
    .doc(uid)
    .onSnapshot(
      (doc) => {
        if (!doc.exists) {
          onUpdate(null);
          return;
        }

        onUpdate({ uid, ...(doc.data() as Omit<UserDocument, 'uid'>) });
      },
      (error) => onError?.(error),
    );

export const updateUserStatus = async (
  uid: string,
  status: UserDocument['status'],
) => {
  await usersCollection().doc(uid).update({
    status,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const updateUserStats = async (
  uid: string,
  stats: Partial<Pick<UserDocument, 'gamesPlayed' | 'wins' | 'losses' | 'elo'>>,
) => {
  await usersCollection().doc(uid).update({
    ...stats,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};
