import { BoardPiece, House } from '../components/board/types';

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

export const HOUSE_TURN_ORDER: House[] = ['white', 'red', 'blue', 'black'];

export function getActiveHouse(turnIndex: number): House {
    return HOUSE_TURN_ORDER[turnIndex % HOUSE_TURN_ORDER.length];
}
