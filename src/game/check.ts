import { BoardPiece } from '../components/board/types';
import { BoardMove, MoveContext } from './types';

/**
 * Future: filter moves that leave the active king in check.
 * Currently passes all candidate moves through unchanged.
 */
export function filterLegalMoves(
    _context: MoveContext,
    _piece: BoardPiece,
    moves: BoardMove[],
): BoardMove[] {
    return moves;
}

/** Future: detect if a house's king is in check. */
export function isHouseInCheck(
    _pieces: BoardPiece[],
    _house: BoardPiece['house'],
): boolean {
    return false;
}
