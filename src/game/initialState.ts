import { INITIAL_PIECES } from '../components/board/boardLayout';
import { BoardPiece } from '../components/board/types';
import { SerializableGameState } from './types';

export function createInitialPieces(): BoardPiece[] {
    return INITIAL_PIECES.map((piece) => ({ ...piece }));
}

export function createInitialGameState(): SerializableGameState {
    return {
        pieces: createInitialPieces(),
        turnIndex: 0,
        moveHistory: [],
        version: 0,
    };
}
