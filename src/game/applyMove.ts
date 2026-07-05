import { BoardPiece } from '../components/board/types';
import { parseSquareLabel, updatePiecePosition } from './boardUtils';
import { resolvePromotion } from './promotion';
import { BoardMove } from './types';

export function applyMove(
    pieces: BoardPiece[],
    move: BoardMove,
): BoardPiece[] {
    const destination = parseSquareLabel(move.to);
    if (!destination) return pieces;

    const withoutCaptured = move.capturedPieceId
        ? pieces.filter((piece) => piece.id !== move.capturedPieceId)
        : pieces;

    return withoutCaptured.map((piece) => {
        if (piece.id !== move.pieceId) return piece;

        let moved = updatePiecePosition(piece, destination.row, destination.col);

        if (move.kind === 'promotion') {
            moved = resolvePromotion(moved);
        }

        return moved;
    });
}
