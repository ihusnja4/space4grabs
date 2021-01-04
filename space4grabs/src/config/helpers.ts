import {Planet, SpacialLocation, Station as ST} from '../models';
import {Colony} from './index';

export interface SpacialLocationWithPlanet extends SpacialLocation {
    planet: Planet;
}
export interface SpacialLocationWithStation extends SpacialLocation {
    station: ST;
}

export const oppositeOf = <T = void>(f: (...args: T[]) => boolean) => (...args: T[]) => !f(...args);
export const hasPlanet = (l: SpacialLocation): l is SpacialLocationWithPlanet => l.planet !== null;
export const hasStation = (l: SpacialLocation): l is SpacialLocationWithStation => l.station !== null;
export const planetColonized = (l: SpacialLocation): l is SpacialLocationWithPlanet => hasPlanet(l) && l.planet.constructions.includes(Colony);
export const stationConstructed = (l: SpacialLocation) => l.station !== null;
export const maxBuildingOfType = (ofType: string, max: number) => (l: SpacialLocation) => planetColonized(l) && l.planet.constructions.filter(b => b.ofType === ofType).length < max;
