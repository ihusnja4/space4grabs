import {Galaxy, Planet, SpacialLocation, StarSystem} from "../models";
import {
    PLANET_MAX_SLOTS_SEED,
    PLANET_MIN_SLOTS_SEED,
    PLANET_PER_SYSTEM_MAX_SEED,
    PLANET_PER_SYSTEM_MIN_SEED,
    PLANET_CONSTRUCTION_LIST,
    SYSTEM_NAMES
} from "../config";
import {arrayShuffle, arrayWithSize} from "../util";

function generatePlanet(location: SpacialLocation): Planet {
    return {
        name: `${location.system.name} ${['b', 'c', 'd', 'e', 'f', 'g', 'i', 'j', 'k', 'l'][location.index]}`,
        ofType: 'Planet',
        location,
        slots: Math.floor(Math.random() * (PLANET_MAX_SLOTS_SEED - PLANET_MIN_SLOTS_SEED)) + PLANET_MIN_SLOTS_SEED,
        constructionList: PLANET_CONSTRUCTION_LIST,
        buildings: [],
        queue: []
    };
}
function generateSpacialLocation(system: StarSystem, index: number): SpacialLocation {
    return  {
        name: `Orbit ${index + 1}`,
        index,
        system,
        planet: null,
        station: null
    };
}
function generateSpacialLocationWithPlanet(system: StarSystem, index: number) {
    const location = generateSpacialLocation(system, index);
    return { ...location, planet: generatePlanet(location) };
}
function generateStarSystem(name: string = 'Unknown System') {
        const system: StarSystem = {
            name,
            directLinks: [],
            contains: []
        };
        const range = PLANET_PER_SYSTEM_MAX_SEED - PLANET_PER_SYSTEM_MIN_SEED;
        const planetsCount = Math.floor(Math.random() * range) + PLANET_PER_SYSTEM_MIN_SEED;
        const emptySlots = arrayWithSize(PLANET_PER_SYSTEM_MAX_SEED - planetsCount, false);
        const slotsWithPlanets = arrayWithSize(planetsCount, true);

        system.contains.push(
            ...arrayShuffle([...emptySlots, ...slotsWithPlanets])
                .map((isPlanet, index) => isPlanet ? generateSpacialLocationWithPlanet(system, index) : generateSpacialLocation(system, index))
        );
        return system;
}

export function generateGalaxy(name: string, numberOfSystems = 10): Galaxy {
    const names = arrayShuffle(SYSTEM_NAMES);
    return {
        name,
        systems: arrayWithSize(numberOfSystems).map(() => generateStarSystem(names.shift()))
    }
}
