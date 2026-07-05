import { House } from '../components/board/types';

/** Future: return true when houses are allied and cannot capture each other. */
export function areAllied(_a: House, _b: House): boolean {
    return false;
}

export function isCaptureAllowed(attacker: House, defender: House): boolean {
    if (attacker === defender) return false;
    return !areAllied(attacker, defender);
}
