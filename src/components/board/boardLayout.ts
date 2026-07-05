import {
    BOARD_SIZE,
    BoardCoordinate,
    BoardPiece,
    BoardZone,
    BoundaryEdges,
    CheckerPalette,
    FILES,
    House,
    PlayerInfo,
} from './types';

export { DEMO_PIECES, INITIAL_PIECES, createInitialSetup } from './initialSetup';

export const HOUSE_COLORS: Record<
    House,
    { primary: string; secondary: string; accent: string; label: string }
> = {
    white: {
        primary: '#F5F0E8',
        secondary: '#C0392B',
        accent: '#FFD700',
        label: 'White',
    },
    red: {
        primary: '#E74C3C',
        secondary: '#F5F0E8',
        accent: '#FFD700',
        label: 'Red',
    },
    blue: {
        primary: '#2980B9',
        secondary: '#1A1A2E',
        accent: '#FFD700',
        label: 'Blue',
    },
    black: {
        primary: '#1A1A2E',
        secondary: '#2980B9',
        accent: '#FFD700',
        label: 'Black',
    },
};

export const ZONE_LABELS: Partial<Record<BoardZone, string>> = {
    nomansland: "No Man's Land",
    house_white: 'House White',
    house_red: 'House Red',
    house_blue: 'House Blue',
    house_black: 'House Black',
    island_bl: 'Island',
    island_br: 'Island',
    island_tl: 'Island',
    island_tr: 'Island',
};

export const QUEEN_THRONE_SQUARES = new Set(['h14', 'a7', 'g1', 'n7']);

export const THRONE_HOUSE: Record<string, House> = {
    h14: 'black',
    a7: 'blue',
    g1: 'white',
    n7: 'red',
};

export function rankToRow(rank: number): number {
    return BOARD_SIZE - rank;
}

export function rowToRank(row: number): number {
    return BOARD_SIZE - row;
}

export function colToFile(col: number): string {
    return FILES[col] ?? 'a';
}

export function fileToCol(file: string): number {
    return FILES.indexOf(file);
}

export function toCoordinate(row: number, col: number): BoardCoordinate {
    const rank = rowToRank(row);
    const file = colToFile(col);
    return { file, rank, row, col, label: `${file}${rank}` };
}

export function getZone(row: number, col: number): BoardZone {
    const rank = rowToRank(row);

    if (col <= 2 && rank <= 3) return 'island_bl';
    if (col >= 11 && rank >= 12) return 'island_tr';
    if (col <= 2 && rank >= 12) return 'island_tl';
    if (col >= 11 && rank <= 3) return 'island_br';

    if (rank <= 3 && col >= 3 && col <= 10) return 'house_white';
    if (rank >= 12 && col >= 3 && col <= 10) return 'house_black';
    if (col <= 2 && rank >= 4 && rank <= 11) return 'house_blue';
    if (col >= 11 && rank >= 4 && rank <= 11) return 'house_red';

    return 'nomansland';
}

export function getZonePalette(zone: BoardZone): CheckerPalette {
    switch (zone) {
        case 'house_white':
        case 'house_red':
        case 'island_br':
            return 'red_white';
        case 'house_black':
        case 'house_blue':
        case 'island_tl':
            return 'blue_black';
        default:
            return 'classic';
    }
}

export function getHouseForZone(zone: BoardZone): House | null {
    switch (zone) {
        case 'house_white':
            return 'white';
        case 'house_red':
            return 'red';
        case 'house_blue':
            return 'blue';
        case 'house_black':
            return 'black';
        default:
            return null;
    }
}

export function isLightSquare(row: number, col: number): boolean {
    return (row + col) % 2 === 0;
}

export function getSquareColors(
    row: number,
    col: number,
): { light: string; dark: string; palette: CheckerPalette } {
    const palette = getZonePalette(getZone(row, col));

    switch (palette) {
        case 'red_white':
            return {
                palette,
                light: '#F5F0E8',
                dark: '#C0392B',
            };
        case 'blue_black':
            return {
                palette,
                light: '#3498DB',
                dark: '#1A1A2E',
            };
        default:
            return {
                palette,
                light: '#E8E4DC',
                dark: '#2C2416',
            };
    }
}

export function getBoundaryEdges(row: number, col: number): BoundaryEdges {
    const zone = getZone(row, col);

    const neighborZone = (r: number, c: number) => {
        if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
            return null;
        }
        return getZone(r, c);
    };

    return {
        top: neighborZone(row - 1, col) !== zone,
        bottom: neighborZone(row + 1, col) !== zone,
        left: neighborZone(row, col - 1) !== zone,
        right: neighborZone(row, col + 1) !== zone,
    };
}

export function isQueenThrone(row: number, col: number): boolean {
    return QUEEN_THRONE_SQUARES.has(toCoordinate(row, col).label);
}

export const DEFAULT_PLAYERS: PlayerInfo[] = [
    { id: 'p-white', name: 'Player 1', house: 'white' },
    { id: 'p-red', name: 'Player 2', house: 'red' },
    { id: 'p-blue', name: 'Player 3', house: 'blue' },
    { id: 'p-black', name: 'Player 4', house: 'black' },
];

export function pieceAtSquare(
    pieces: BoardPiece[],
    label: string,
): BoardPiece | undefined {
    return pieces.find((piece) => `${piece.file}${piece.rank}` === label);
}
