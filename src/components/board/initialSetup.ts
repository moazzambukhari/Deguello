import { BoardPiece, House, PieceType } from './types';

/**
 * Physical Deguello board layout (14×14 cross, 8-wide extensions):
 *
 *   White (bottom): ranks 1–2, files d–k  — faces UP
 *   Black (top):    ranks 13–14, files d–k — faces DOWN (mirrored back rank)
 *   Blue (left):    files a–b, ranks 4–11  — faces RIGHT
 *   Red (right):    files m–n, ranks 4–11  — faces LEFT (mirrored back rank)
 *
 * Back-rank order from each player's view (left → right):
 *   White / Blue: R · N · B · Q · K · B · N · R  (queen on throne g1 / a7 / n7)
 *   Black / Red:  R · N · B · K · Q · B · N · R  (Black only — mirrored horizontal)
 */

const CENTER_FILES = ['d', 'e', 'f', 'g', 'h', 'i', 'j', 'k'] as const;
const SIDE_RANKS = [4, 5, 6, 7, 8, 9, 10, 11] as const;

/** White & Blue — queen left of king (standard from player's perspective). */
const BACK_RANK_QK: PieceType[] = [
    'rook',
    'knight',
    'bishop',
    'queen',
    'king',
    'bishop',
    'knight',
    'rook',
];

/** Black & Red — king left of queen (mirror so kings face the center arena). */
const BACK_RANK_KQ: PieceType[] = [
    'rook',
    'knight',
    'bishop',
    'king',
    'queen',
    'bishop',
    'knight',
    'rook',
];

function placeBackRank(
    house: House,
    idPrefix: string,
    slots: { file: string; rank: number }[],
    order: PieceType[],
): BoardPiece[] {
    return order.map((type, index) => ({
        id: `${idPrefix}-${type}-${index}`,
        house,
        type,
        file: slots[index].file,
        rank: slots[index].rank,
    }));
}

function placePawns(
    house: House,
    idPrefix: string,
    slots: { file: string; rank: number }[],
): BoardPiece[] {
    return slots.map((slot, index) => ({
        id: `${idPrefix}-pawn-${index}`,
        house,
        type: 'pawn' as const,
        file: slot.file,
        rank: slot.rank,
    }));
}

function createWhiteHouse(): BoardPiece[] {
    const backSlots = CENTER_FILES.map((file) => ({ file, rank: 1 }));
    const pawnSlots = CENTER_FILES.map((file) => ({ file, rank: 2 }));

    return [
        ...placeBackRank('white', 'w', backSlots, BACK_RANK_QK),
        ...placePawns('white', 'w', pawnSlots),
    ];
}

function createBlackHouse(): BoardPiece[] {
    const backSlots = CENTER_FILES.map((file) => ({ file, rank: 14 }));
    const pawnSlots = CENTER_FILES.map((file) => ({ file, rank: 13 }));

    return [
        ...placeBackRank('black', 'b', backSlots, BACK_RANK_KQ),
        ...placePawns('black', 'b', pawnSlots),
    ];
}

function createBlueHouse(): BoardPiece[] {
    const backSlots = SIDE_RANKS.map((rank) => ({ file: 'a', rank }));
    const pawnSlots = SIDE_RANKS.map((rank) => ({ file: 'b', rank }));

    return [
        ...placeBackRank('blue', 'bl', backSlots, BACK_RANK_QK),
        ...placePawns('blue', 'bl', pawnSlots),
    ];
}

function createRedHouse(): BoardPiece[] {
    const backSlots = SIDE_RANKS.map((rank) => ({ file: 'n', rank }));
    const pawnSlots = SIDE_RANKS.map((rank) => ({ file: 'm', rank }));

    return [
        ...placeBackRank('red', 'r', backSlots, BACK_RANK_QK),
        ...placePawns('red', 'r', pawnSlots),
    ];
}

/** Full opening position matching the physical Deguello board. */
export function createInitialSetup(): BoardPiece[] {
    return [
        ...createWhiteHouse(),
        ...createBlackHouse(),
        ...createBlueHouse(),
        ...createRedHouse(),
    ];
}

export const INITIAL_PIECES: BoardPiece[] = createInitialSetup();

/** @deprecated Use INITIAL_PIECES */
export const DEMO_PIECES = INITIAL_PIECES;

/**
 * Throne squares — queens start here:
 *   White Q g1 · Black Q h14 · Blue Q a7 · Red Q n7
 * (Black/Red use mirrored back rank; queen sits one file/rank inward from king.)
 */
export const QUEEN_START_SQUARES: Record<House, string> = {
    white: 'g1',
    black: 'h14',
    blue: 'a7',
    red: 'n7',
};

export const KING_START_SQUARES: Record<House, string> = {
    white: 'h1',
    black: 'g14',
    blue: 'a8',
    red: 'n8',
};
