import { BoardPiece, House } from '../../components/board/types';
import { toCoordinate } from '../../components/board/boardLayout';
import { getCaptureTarget } from '../capture';
import {
    isOnBoard,
    isSquareEmpty,
    parseSquareLabel,
    pieceAt,
} from '../boardUtils';
import { classifyMoveKind } from '../promotion';
import { BoardMove, MoveContext } from '../types';

type Delta = { dRow: number; dCol: number };

function getForwardDelta(house: House): Delta {
    switch (house) {
        case 'white':
            return { dRow: -1, dCol: 0 };
        case 'black':
            return { dRow: 1, dCol: 0 };
        case 'blue':
            return { dRow: 0, dCol: 1 };
        case 'red':
            return { dRow: 0, dCol: -1 };
    }
}

function getDiagonalDeltas(house: House): Delta[] {
    switch (house) {
        case 'white':
            return [
                { dRow: -1, dCol: -1 },
                { dRow: -1, dCol: 1 },
            ];
        case 'black':
            return [
                { dRow: 1, dCol: -1 },
                { dRow: 1, dCol: 1 },
            ];
        case 'blue':
            return [
                { dRow: -1, dCol: 1 },
                { dRow: 1, dCol: 1 },
            ];
        case 'red':
            return [
                { dRow: -1, dCol: -1 },
                { dRow: 1, dCol: -1 },
            ];
    }
}

function isPawnStartSquare(piece: BoardPiece, row: number, col: number): boolean {
    switch (piece.house) {
        case 'white':
            return piece.rank === 2;
        case 'black':
            return piece.rank === 13;
        case 'blue':
            return col === 1;
        case 'red':
            return col === 12;
    }
}

function buildMove(
    piece: BoardPiece,
    fromLabel: string,
    row: number,
    col: number,
    captured?: BoardPiece,
): BoardMove {
    const toLabel = toCoordinate(row, col).label;
    const kind = classifyMoveKind(piece, toLabel, Boolean(captured));

    return {
        from: fromLabel,
        to: toLabel,
        pieceId: piece.id,
        kind,
        capturedPieceId: captured?.id,
    };
}

function tryQuietStep(
    context: MoveContext,
    piece: BoardPiece,
    fromLabel: string,
    row: number,
    col: number,
    forward: Delta,
): BoardMove[] {
    const nextRow = row + forward.dRow;
    const nextCol = col + forward.dCol;

    if (!isOnBoard(nextRow, nextCol)) return [];
    if (!isSquareEmpty(context.pieces, nextRow, nextCol)) return [];

    const moves: BoardMove[] = [
        buildMove(piece, fromLabel, nextRow, nextCol),
    ];

    if (isPawnStartSquare(piece, row, col)) {
        const doubleRow = row + forward.dRow * 2;
        const doubleCol = col + forward.dCol * 2;

        if (
            isOnBoard(doubleRow, doubleCol) &&
            isSquareEmpty(context.pieces, doubleRow, doubleCol)
        ) {
            moves.push(buildMove(piece, fromLabel, doubleRow, doubleCol));
        }
    }

    return moves;
}

function tryCaptureSteps(
    context: MoveContext,
    piece: BoardPiece,
    fromLabel: string,
    row: number,
    col: number,
    diagonals: Delta[],
): BoardMove[] {
    const moves: BoardMove[] = [];

    for (const delta of diagonals) {
        const targetRow = row + delta.dRow;
        const targetCol = col + delta.dCol;

        if (!isOnBoard(targetRow, targetCol)) continue;

        const captureTarget = getCaptureTarget(
            context.pieces,
            piece.house,
            targetRow,
            targetCol,
        );

        if (captureTarget) {
            moves.push(
                buildMove(piece, fromLabel, targetRow, targetCol, captureTarget),
            );
        }
    }

    return moves;
}

export function getPawnMoves(
    context: MoveContext,
    piece: BoardPiece,
): BoardMove[] {
    if (piece.type !== 'pawn') return [];

    const fromLabel = `${piece.file}${piece.rank}`;
    const origin = parseSquareLabel(fromLabel);
    if (!origin) return [];

    const { row, col } = origin;
    const forward = getForwardDelta(piece.house);
    const diagonals = getDiagonalDeltas(piece.house);

    return [
        ...tryQuietStep(context, piece, fromLabel, row, col, forward),
        ...tryCaptureSteps(context, piece, fromLabel, row, col, diagonals),
    ];
}

/** Exported for tests and future en-passant logic. */
export function getPawnForwardDelta(house: House): Delta {
    return getForwardDelta(house);
}

export function getOccupantAt(
    pieces: BoardPiece[],
    row: number,
    col: number,
): BoardPiece | undefined {
    return pieceAt(pieces, row, col);
}
