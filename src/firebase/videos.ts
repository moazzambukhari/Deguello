import firestore from '@react-native-firebase/firestore';

import type { TutorialVideo } from './types';

const tutorialsCollection = () => firestore().collection('tutorials');

export const subscribeToTutorialVideos = (
  onUpdate: (videos: TutorialVideo[]) => void,
  onError?: (error: Error) => void,
) =>
  tutorialsCollection()
    .orderBy('order', 'asc')
    .onSnapshot(
      (snapshot) => {
        const videos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<TutorialVideo, 'id'>),
        }));
        onUpdate(videos);
      },
      (error) => onError?.(error),
    );

export const addTutorialVideo = async (
  video: Omit<TutorialVideo, 'id' | 'createdAt'>,
) => {
  const existing = await tutorialsCollection().orderBy('order', 'desc').limit(1).get();
  const nextOrder =
    existing.empty ? 0 : (existing.docs[0].data().order ?? 0) + 1;

  await tutorialsCollection().add({
    ...video,
    order: video.order ?? nextOrder,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const DEFAULT_TUTORIAL_VIDEOS: TutorialVideo[] = [
  {
    id: 'default-1',
    title: 'How to Play Deguello',
    description: 'Learn the basics of 4-player chess and house alliances.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    order: 0,
  },
  {
    id: 'default-2',
    title: 'House Movement Rules',
    description: 'Understand how each house moves across the shared board.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    order: 1,
  },
];
