import { BoardPiece, House } from '../components/board/types';
import { isCaptureAllowed } from './alliance';
import { pieceAt } from './boardUtils';

/** Resolve a capture target on a square, if any. */
export function getCaptureTarget(
    pieces: BoardPiece[],
    attackerHouse: House,
    row: number,
    col: number,
): BoardPiece | undefined {
    const occupant = pieceAt(pieces, row, col);
    if (!occupant) return undefined;
    if (!isCaptureAllowed(attackerHouse, occupant.house)) return undefined;
    return occupant;
}
