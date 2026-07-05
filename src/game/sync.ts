import { SerializableGameState, GameSyncAdapter } from './types';

/** Local-only adapter — replace with Socket.IO implementation later. */
export function createLocalSyncAdapter(): GameSyncAdapter {
    return {
        emitState: (_state: SerializableGameState) => {
            // no-op for offline play
        },
        subscribe: (_handler) => () => {
            // no-op unsubscribe
        },
    };
}

/**
 * Future Socket.IO integration sketch:
 * - emit `game:move` with SerializableGameState after applyMove
 * - listen for remote state patches and merge by version
 * - reconcile conflicts with server authority
 */
