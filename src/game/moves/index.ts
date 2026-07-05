import { BoardPiece } from '../../components/board/types';
import { filterLegalMoves } from '../check';
import { BoardMove, MoveContext } from '../types';
import { getPawnMoves } from './pawn';

function getRawMoves(context: MoveContext, piece: BoardPiece): BoardMove[] {
    switch (piece.type) {
        case 'pawn':
            return getPawnMoves(context, piece);
        case 'king':
        case 'queen':
        case 'rook':
        case 'bishop':
        case 'knight':
            return [];
        default:
            return [];
    }
}

export function getValidMoves(
    context: MoveContext,
    piece: BoardPiece,
): BoardMove[] {
    const candidates = getRawMoves(context, piece);
    return filterLegalMoves(context, piece, candidates);
}
