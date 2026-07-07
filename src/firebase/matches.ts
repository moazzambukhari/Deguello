import firestore from '@react-native-firebase/firestore';

import {
  BoardPiece,
  Move,
  TURN_ORDER,
  type House,
  type PlayerInfo,
} from '../components/board/types';
import type {
  MatchDocument,
  MatchMode,
  MatchPlayer,
  UserDocument,
} from './types';
import { createInitialSetup } from '../components/board/initialSetup';

const matchesCollection = () => firestore().collection('matches');

const HOUSES: House[] = ['white', 'black', 'red', 'blue'];

const AI_NAMES = ['AI Strategist', 'AI Commander', 'AI Tactician'];

const generateRoomCode = () =>
  Math.random().toString(36).slice(2, 8).toUpperCase();

const toMatchPlayer = (
  user: Pick<UserDocument, 'uid' | 'fullName' | 'avatar'>,
  house: House,
  isAi = false,
): MatchPlayer => ({
  uid: user.uid,
  name: user.fullName,
  avatar: user.avatar,
  house,
  isAi,
});

const createAiPlayer = (house: House, index: number): MatchPlayer => ({
  uid: `ai-${house}-${Date.now()}`,
  name: AI_NAMES[index % AI_NAMES.length],
  avatar: '',
  house,
  isAi: true,
});

export const matchPlayersToPlayerInfo = (
  players: MatchPlayer[],
): PlayerInfo[] =>
  players.map(player => ({
    id: player.uid,
    name: player.name,
    house: player.house,
    avatar: player.avatar
      ? { uri: player.avatar }
      : require('../assets/images/avatar2.png'),
  }));

export const createMatch = async (
  host: UserDocument,
  mode: MatchMode,
  options: {
    visibility?: MatchDocument['visibility'];
    aiDifficulty?: string;
    fillWithAi?: boolean;
  } = {},
) => {
  const visibility = options.visibility ?? 'public';
  const fillWithAi = options.fillWithAi ?? mode !== 'quick';
  const hostPlayer = toMatchPlayer(host, 'white');
  const players: MatchPlayer[] = [hostPlayer];

  if (fillWithAi) {
    HOUSES.slice(1).forEach((house, index) => {
      players.push(createAiPlayer(house, index));
    });
  }

  const docRef = await matchesCollection().add({
    hostId: host.uid,
    status: players.length === 4 ? 'ready' : 'waiting',
    players,
    visibility,
    aiDifficulty: options.aiDifficulty ?? 'medium',
    mode,
    roomCode: visibility === 'private' ? generateRoomCode() : null,
    currentTurn: TURN_ORDER[0],
    turnOrder: TURN_ORDER,
    boardState: createInitialSetup(),
    winner: null,
    moveHistory: [],
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
};

export const makeMove = async (
  matchId: string,
  boardState: BoardPiece[],
  move: Move,
) => {
  const ref = matchesCollection().doc(matchId);

  await firestore().runTransaction(async transaction => {
    const snap = await transaction.get(ref);

    if (!snap.exists) {
      throw new Error('Match not found');
    }

    const match = snap.data() as MatchDocument;

    // Sirf jis player ki turn hai woh move kar sakta hai
    if (match.currentTurn !== move.house) {
      throw new Error("It's not your turn.");
    }

    const currentIndex = match.turnOrder.indexOf(match.currentTurn);

    const nextTurn =
      match.turnOrder[(currentIndex + 1) % match.turnOrder.length];

    transaction.update(ref, {
      boardState,
      currentTurn: nextTurn,
      moveHistory: firestore.FieldValue.arrayUnion(move),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  });
};

export const findOrJoinQuickMatch = async (user: UserDocument) => {
  const waitingMatches = await matchesCollection()
    .where('status', '==', 'waiting')
    .where('visibility', '==', 'public')
    .where('mode', '==', 'quick')
    .limit(5)
    .get();

  for (const doc of waitingMatches.docs) {
    const data = doc.data() as MatchDocument;
    const alreadyJoined = data.players.some(player => player.uid === user.uid);
    if (alreadyJoined) {
      return doc.id;
    }

    if (data.players.length >= 4) {
      continue;
    }

    const takenHouses = new Set(data.players.map(player => player.house));
    const nextHouse = HOUSES.find(house => !takenHouses.has(house));
    if (!nextHouse) {
      continue;
    }

    const updatedPlayers = [...data.players, toMatchPlayer(user, nextHouse)];

    await doc.ref.update({
      players: updatedPlayers,
      status: updatedPlayers.length === 4 ? 'ready' : 'waiting',
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return doc.id;
  }

  return createMatch(user, 'quick', { fillWithAi: false });
};

export const joinMatchByCode = async (user: UserDocument, roomCode: string) => {
  const snapshot = await matchesCollection()
    .where('roomCode', '==', roomCode.trim().toUpperCase())
    .where('status', 'in', ['waiting', 'ready'])
    .limit(1)
    .get();

  if (snapshot.empty) {
    throw new Error('Room not found. Check the code and try again.');
  }

  const doc = snapshot.docs[0];
  const data = doc.data() as MatchDocument;

  if (data.players.some(player => player.uid === user.uid)) {
    return doc.id;
  }

  if (data.players.length >= 4) {
    throw new Error('This room is already full.');
  }

  const takenHouses = new Set(data.players.map(player => player.house));
  const nextHouse = HOUSES.find(house => !takenHouses.has(house));
  if (!nextHouse) {
    throw new Error('No open slots in this room.');
  }

  const updatedPlayers = [...data.players, toMatchPlayer(user, nextHouse)];

  await doc.ref.update({
    players: updatedPlayers,
    status: updatedPlayers.length === 4 ? 'ready' : 'waiting',
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  return doc.id;
};

export const createOrJoinMatch = async (
  user: UserDocument,
  mode: MatchMode = 'quick',
  options: {
    visibility?: MatchDocument['visibility'];
    aiDifficulty?: string;
  } = {},
) => {
  switch (mode) {
    case 'quick':
      return await findOrJoinQuickMatch(user);

    case 'public':
      return await createMatch(user, 'public', {
        visibility: 'public',
        aiDifficulty: options.aiDifficulty,
      });

    case 'private':
      return await createMatch(user, 'private', {
        visibility: 'private',
        aiDifficulty: options.aiDifficulty,
      });

    default:
      return await findOrJoinQuickMatch(user);
  }
};

export const subscribeToMatch = (
  matchId: string,
  onUpdate: (match: MatchDocument | null) => void,
  onError?: (error: Error) => void,
) =>
  matchesCollection()
    .doc(matchId)
    .onSnapshot(
      doc => {
        if (!doc.exists) {
          onUpdate(null);
          return;
        }

        onUpdate(doc.data() as MatchDocument);
      },
      error => onError?.(error),
    );

export const startMatch = async (matchId: string) => {
  await matchesCollection().doc(matchId).update({
    status: 'in_progress',
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const resetMatch = async (matchId: string) => {
  await matchesCollection().doc(matchId).update({
    boardState: createInitialSetup(),
    currentTurn: TURN_ORDER[0],
    winner: null,
    moveHistory: [],
    status: 'in_progress',
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const getPlayerForHouse = (
  players: MatchPlayer[],
  house: House,
): MatchPlayer | undefined => players.find(player => player.house === house);
