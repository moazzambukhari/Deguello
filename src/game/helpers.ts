// game/helpers.ts

import { BoardMove } from './types';
import { Move } from '../components/board/types';
import { House } from '../components/board/types';

export function boardMoveToFirestoreMove(move: BoardMove, house: House): Move {
  return {
    pieceId: move.pieceId,

    from: {
      file: move.from[0],
      rank: Number(move.from.slice(1)),
    },

    to: {
      file: move.to[0],
      rank: Number(move.to.slice(1)),
    },

    house,

    capturedPieceId: move.capturedPieceId,

    createdAt: Date.now(),
  };
}
