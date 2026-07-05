export type House = 'white' | 'red' | 'blue' | 'black';

export type BoardZone =
    | 'nomansland'
    | 'house_white'
    | 'house_red'
    | 'house_blue'
    | 'house_black'
    | 'island_bl'
    | 'island_br'
    | 'island_tl'
    | 'island_tr';

export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export type CheckerPalette = 'classic' | 'red_white' | 'blue_black';

export type BoardCoordinate = {
    file: string;
    rank: number;
    row: number;
    col: number;
    label: string;
};

export type BoardPiece = {
    id: string;
    house: House;
    type: PieceType;
    file: string;
    rank: number;
};

export type PlayerInfo = {
    id: string;
    name: string;
    house: House;
    avatar?: number;
};

export type BoundaryEdges = {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
};

export const BOARD_SIZE = 14;
export const FILES = 'abcdefghijklmn'.split('');
export const ROMAN_CORNERS = {
    bottomLeft: 'I',
    topRight: 'II',
    bottomRight: 'III',
    topLeft: 'IV',
} as const;
