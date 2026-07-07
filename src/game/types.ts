import { BoardPiece, House } from '../components/board/types';

/** Practice = offline/local state. Multiplayer = Firestore-synchronized. */
export type GameMode = 'practice' | 'multiplayer';

export type GameRouteParams = {
  matchId?: string;
  mode?: GameMode;
};

/** Infer mode from navigation params — matchId implies multiplayer. */
export function resolveGameMode(params?: GameRouteParams): GameMode {
  if (params?.mode) return params.mode;
  return params?.matchId ? 'multiplayer' : 'practice';
}

export type MoveKind = 'quiet' | 'capture' | 'promotion';

export type BoardMove = {
  from: string;
  to: string;
  pieceId: string;
  kind: MoveKind;
  capturedPieceId?: string;
};

/** Context passed to move generators — extend for alliances, en passant, etc. */
export type MoveContext = {
  pieces: BoardPiece[];
  activeHouse: House;
};

/** Serializable snapshot for local state and future Socket.IO sync */
export type SerializableGameState = {
  pieces: BoardPiece[];
  turnIndex: number;
  moveHistory: BoardMove[];
  version: number;
};

export type GameSyncAdapter = {
  emitState: (state: SerializableGameState) => void;
  subscribe: (handler: (state: SerializableGameState) => void) => () => void;
};

export const HOUSE_TURN_ORDER: House[] = ['white', 'black', 'red', 'blue'];

export function getActiveHouse(turnIndex: number): House {
  return HOUSE_TURN_ORDER[turnIndex % HOUSE_TURN_ORDER.length];
}
