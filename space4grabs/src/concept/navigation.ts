import {numberRange} from '../util';

export function calculateInSystemTravel(srcOrbit: number, destOrbit: number) {
    return Math.abs(srcOrbit - destOrbit);
}

export function calculateInterStellarTravel(distance: number) {
    return numberRange(1, distance).reduce((r, step) => r + pdCostPerSystem(step), 0);
}

/**
 * Bigger the distance Phase Drive needs to traverse, cost of traversing a system drops.
 */
export function pdCostPerSystem(distance: number) {
    return distance > 12 ? 1 : distance > 1 ? 2 : 3;
}
