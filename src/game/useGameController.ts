import { useCallback, useEffect, useState } from 'react';

import {
  BoardPiece,
  House,
  Move,
  TURN_ORDER,
} from '../components/board/types';
import { makeMove, resetMatch, subscribeToMatch } from '../firebase/matches';
import { createInitialPieces } from './initialState';
import { GameMode } from './types';

/**
 * Uniform surface the UI talks to, regardless of mode. `GameScreen` never needs
 * to know whether state lives in local React state or in Firestore.
 */
export type GameController = {
  mode: GameMode;
  pieces: BoardPiece[];
  currentTurn: House;
  moveHistory: Move[];
  /** Persist an already-computed board + move for the active house. */
  commitMove: (nextBoard: BoardPiece[], move: Move) => Promise<void>;
  /** Return the board to its opening position. */
  reset: () => Promise<void>;
};

const nextHouse = (house: House): House =>
  TURN_ORDER[(TURN_ORDER.indexOf(house) + 1) % TURN_ORDER.length];

/**
 * Single controller for both game modes.
 *
 * - Practice: everything stays in local React state, turn order advances
 *   locally, and Firestore is never contacted.
 * - Multiplayer: board, turn, and history are streamed from Firestore and all
 *   writes go through the match transaction (Firestore stays authoritative).
 */
export function useGameController(
  mode: GameMode,
  matchId?: string,
): GameController {
  const isMultiplayer = mode === 'multiplayer' && !!matchId;

  const [pieces, setPieces] = useState<BoardPiece[]>(createInitialPieces);
  const [currentTurn, setCurrentTurn] = useState<House>(TURN_ORDER[0]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  // Real-time sync — multiplayer only. Practice keeps its local defaults.
  useEffect(() => {
    if (!isMultiplayer || !matchId) return;

    const unsubscribe = subscribeToMatch(matchId, match => {
      if (!match) return;
      setPieces(match.boardState);
      setCurrentTurn(match.currentTurn);
      setMoveHistory(match.moveHistory ?? []);
    });

    return unsubscribe;
  }, [isMultiplayer, matchId]);

  const commitMove = useCallback(
    async (nextBoard: BoardPiece[], move: Move) => {
      if (isMultiplayer && matchId) {
        await makeMove(matchId, nextBoard, move);
        return;
      }

      setPieces(nextBoard);
      setMoveHistory(prev => [...prev, move]);
      setCurrentTurn(nextHouse(move.house));
    },
    [isMultiplayer, matchId],
  );

  const reset = useCallback(async () => {
    if (isMultiplayer && matchId) {
      // Firestore update propagates to every connected client via subscribeToMatch.
      await resetMatch(matchId);
      return;
    }

    // Practice — fully local, no Firestore.
    setPieces(createInitialPieces());
    setCurrentTurn(TURN_ORDER[0]);
    setMoveHistory([]);
  }, [isMultiplayer, matchId]);

  return { mode, pieces, currentTurn, moveHistory, commitMove, reset };
}
