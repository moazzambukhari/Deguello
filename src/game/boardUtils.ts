import {
    BOARD_SIZE,
    BoardCoordinate,
    BoardPiece,
} from '../components/board/types';
import {
    fileToCol,
    rankToRow,
    rowToRank,
    toCoordinate,
} from '../components/board/boardLayout';

export function parseSquareLabel(label: string): BoardCoordinate | null {
    const match = label.match(/^([a-n])(\d+)$/);
    if (!match) return null;

    const file = match[1];
    const rank = parseInt(match[2], 10);
    const col = fileToCol(file);
    const row = rankToRow(rank);

    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
        return null;
    }

    return toCoordinate(row, col);
}

export function isOnBoard(row: number, col: number): boolean {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function pieceAt(
    pieces: BoardPiece[],
    row: number,
    col: number,
): BoardPiece | undefined {
    if (!isOnBoard(row, col)) return undefined;
    const label = toCoordinate(row, col).label;
    return pieces.find((piece) => `${piece.file}${piece.rank}` === label);
}

export function pieceAtLabel(
    pieces: BoardPiece[],
    label: string,
): BoardPiece | undefined {
    return pieces.find((piece) => `${piece.file}${piece.rank}` === label);
}

export function isSquareEmpty(
    pieces: BoardPiece[],
    row: number,
    col: number,
): boolean {
    return !pieceAt(pieces, row, col);
}

export function updatePiecePosition(
    piece: BoardPiece,
    row: number,
    col: number,
): BoardPiece {
    return {
        ...piece,
        file: toCoordinate(row, col).file,
        rank: rowToRank(row),
    };
}
