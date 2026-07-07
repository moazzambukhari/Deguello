import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import type { BoardPiece, House, Move } from '../components/board/types';

export type UserDocument = {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'online' | 'offline' | 'in_game';
  gamesPlayed: number;
  wins: number;
  losses: number;
  elo: number;
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

export type TutorialVideo = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  order: number;
  duration?: number;
  createdAt?: FirebaseFirestoreTypes.Timestamp;
};

export type MatchPlayer = {
  uid: string;
  name: string;
  avatar: string;
  house: House;
  isAi?: boolean;
};

export type MatchStatus = 'waiting' | 'ready' | 'in_progress' | 'finished';

// export type MatchMode = 'quick' | 'ai' | 'practice' | 'private';
export type MatchMode = 'quick' | 'public' | 'private';

export type MatchDocument = {
  hostId: string;
  status: MatchStatus;
  players: MatchPlayer[];
  visibility: 'public' | 'private';
  aiDifficulty?: string;
  mode: MatchMode;
  roomCode?: string;
  currentTurn: House;
  turnOrder: House[];
  boardState: BoardPiece[];
  winner: House | null;
  moveHistory: Move[];
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
};

export type AppNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'reward' | 'friend' | 'tournament' | 'system';
  read: boolean;
  createdAt: FirebaseFirestoreTypes.Timestamp;
};
