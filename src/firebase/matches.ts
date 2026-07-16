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

/** Firestore rejects `undefined` — strip optional fields so payloads stay JSON-safe. */
const toSerializableMove = (move: Move): Move => {
  const serialized: Move = {
    pieceId: move.pieceId,
    from: { file: move.from.file, rank: move.from.rank },
    to: { file: move.to.file, rank: move.to.rank },
    house: move.house,
    createdAt: move.createdAt,
  };

  if (move.capturedPieceId !== undefined) {
    serialized.capturedPieceId = move.capturedPieceId;
  }

  return serialized;
};

const toSerializableBoardState = (boardState: BoardPiece[]): BoardPiece[] =>
  boardState.map(piece => {
    const serialized: BoardPiece = {
      id: piece.id,
      house: piece.house,
      type: piece.type,
      file: piece.file,
      rank: piece.rank,
    };

    if (piece.hasMoved !== undefined) {
      serialized.hasMoved = piece.hasMoved;
    }

    if (piece.isCaptured !== undefined) {
      serialized.isCaptured = piece.isCaptured;
    }

    if (piece.promoted !== undefined) {
      serialized.promoted = piece.promoted;
    }

    return serialized;
  });

const getNextTurn = (turnOrder: House[], currentTurn: House): House => {
  const currentIndex = turnOrder.indexOf(currentTurn);

  if (currentIndex === -1 || turnOrder.length === 0) {
    throw new Error('Invalid turn order.');
  }

  return turnOrder[(currentIndex + 1) % turnOrder.length];
};

const buildInitialBoardState = (): BoardPiece[] =>
  toSerializableBoardState(createInitialSetup());

const toMatchPlayer = (
  user: Pick<UserDocument, 'uid' | 'fullName' | 'avatar'>,
  house: House,
  isAi = false,
): MatchPlayer => ({
  uid: user.uid,
  // Firestore rejects `undefined` — fall back to safe defaults if the user
  // document is missing a name or avatar.
  name: user.fullName ?? 'Player',
  avatar: user.avatar ?? '',
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

export const createAiMatch = async (
  host: UserDocument,
  availableUsers: UserDocument[] = [],
  options: {
    aiDifficulty?: string;
  } = {},
) => {
  const hostPlayer = toMatchPlayer(host, 'white');
  const players: MatchPlayer[] = [hostPlayer];
  const openHouses = HOUSES.slice(1);

  availableUsers.slice(0, 3).forEach((opponent, index) => {
    players.push(toMatchPlayer(opponent, openHouses[index]));
  });

  openHouses.slice(availableUsers.length).forEach((house, index) => {
    players.push(createAiPlayer(house, availableUsers.length + index));
  });

  const docRef = await matchesCollection().add({
    hostId: host.uid,
    status: 'ready',
    players,
    visibility: 'private',
    aiDifficulty: options.aiDifficulty ?? 'medium',
    mode: 'private',
    roomCode: generateRoomCode(),
    currentTurn: TURN_ORDER[0],
    turnOrder: TURN_ORDER,
    boardState: buildInitialBoardState(),
    winner: null,
    moveHistory: [],
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
};

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
    boardState: buildInitialBoardState(),
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
  const serializedMove = toSerializableMove(move);
  const serializedBoardState = toSerializableBoardState(boardState);

  await firestore().runTransaction(async transaction => {
    const snap = await transaction.get(ref);

    if (!snap.exists) {
      throw new Error('Match not found');
    }

    const match = snap.data() as MatchDocument;

    if (match.status !== 'in_progress') {
      throw new Error('Match is not in progress.');
    }

    // Authoritative turn check — rejects stale or out-of-order moves.
    if (match.currentTurn !== move.house) {
      throw new Error("It's not your turn.");
    }

    const nextTurn = getNextTurn(match.turnOrder, match.currentTurn);
    const nextMoveHistory = [...(match.moveHistory ?? []), serializedMove];

    transaction.update(ref, {
      boardState: serializedBoardState,
      currentTurn: nextTurn,
      moveHistory: nextMoveHistory,
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
  const ref = matchesCollection().doc(matchId);

  await firestore().runTransaction(async transaction => {
    const snap = await transaction.get(ref);

    if (!snap.exists) {
      throw new Error('Match not found');
    }

    // Reset game state only — players and turnOrder are left unchanged.
    transaction.update(ref, {
      boardState: buildInitialBoardState(),
      currentTurn: TURN_ORDER[0],
      winner: null,
      moveHistory: [],
      status: 'in_progress',
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  });
};

export const getPlayerForHouse = (
  players: MatchPlayer[],
  house: House,
): MatchPlayer | undefined => players.find(player => player.house === house);
