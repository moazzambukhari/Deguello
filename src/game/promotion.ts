import { BoardPiece, House } from '../components/board/types';
import { parseSquareLabel } from './boardUtils';
import { MoveKind } from './types';

/** Future: present promotion UI and upgrade pawn type. */
export function resolvePromotion(
    piece: BoardPiece,
    _promotionType?: BoardPiece['type'],
): BoardPiece {
    return piece;
}

export function getPromotionRank(house: House): number | null {
    switch (house) {
        case 'white':
            return 14;
        case 'black':
            return 1;
        default:
            return null;
    }
}

export function getPromotionFile(house: House): string | null {
    switch (house) {
        case 'blue':
            return 'n';
        case 'red':
            return 'a';
        default:
            return null;
    }
}

export function classifyMoveKind(
    piece: BoardPiece,
    toLabel: string,
    hasCapture: boolean,
): MoveKind {
    if (hasCapture) return 'capture';

    const coord = parseSquareLabel(toLabel);
    if (!coord || piece.type !== 'pawn') return 'quiet';

    const promotionRank = getPromotionRank(piece.house);
    const promotionFile = getPromotionFile(piece.house);

    if (promotionRank !== null && coord.rank === promotionRank) {
        return 'promotion';
    }
    if (promotionFile !== null && coord.file === promotionFile) {
        return 'promotion';
    }

    return 'quiet';
}
