import { pieceAtLabel } from './boardUtils';
import { getValidMoves as getValidMovesForPiece } from './moves';
import { BoardMove, MoveContext } from './types';

export function getValidMovesForSquare(
    context: MoveContext,
    squareLabel: string,
): BoardMove[] {
    const piece = pieceAtLabel(context.pieces, squareLabel);
    if (!piece) return [];
    if (piece.house !== context.activeHouse) return [];

    return getValidMovesForPiece(context, piece);
}

export function getHighlightSquares(moves: BoardMove[]): string[] {
    return moves.map((move) => move.to);
}

export function findMoveToSquare(
    moves: BoardMove[],
    squareLabel: string,
): BoardMove | undefined {
    return moves.find((move) => move.to === squareLabel);
}
