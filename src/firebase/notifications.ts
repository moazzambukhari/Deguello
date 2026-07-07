import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';

import type { AppNotification } from './types';

const notificationsCollection = () => firestore().collection('notifications');

export const subscribeToNotifications = (
  userId: string,
  onUpdate: (notifications: AppNotification[]) => void,
  onError?: (error: Error) => void,
) =>
  notificationsCollection()
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(25)
    .onSnapshot(
      (snapshot) => {
        const notifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<AppNotification, 'id'>),
        }));
        onUpdate(notifications);
      },
      (error) => onError?.(error),
    );

export const createNotification = async (
  notification: Omit<AppNotification, 'id' | 'createdAt'>,
) => {
  await notificationsCollection().add({
    ...notification,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const markNotificationRead = async (notificationId: string) => {
  await notificationsCollection().doc(notificationId).update({ read: true });
};

export const formatNotificationTime = (
  timestamp?: FirebaseFirestoreTypes.Timestamp,
) => {
  if (!timestamp) {
    return 'Just now';
  }

  const diffMs = Date.now() - timestamp.toDate().getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};
