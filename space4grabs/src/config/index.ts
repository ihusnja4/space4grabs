import {Construction, Planet, SpacialLocation, Station as ST} from "../models";

export const SYSTEM_NAMES = [
    'Antares',
    'Betelgeuse',
    'Centauri',
    'Dawn',
    'Epsilon',
    'Faust',
    'Geronimo',
    'Hal 3000',
    'Issa',
    'Jedda',
    'Kerberos',
    'Linx',
    'Magna',
    'Netflix',
    'Omega',
    'Planck',
    'Q',
    'Rigel',
    'Solaris',
    'Titus',
    'Utapau',
    'Virgo',
    'Wolf 359',
    'Xirax',
    'Yin',
    'Zedd'
];
export const PLANET_PER_SYSTEM_MIN_SEED = 1;
export const PLANET_PER_SYSTEM_MAX_SEED = 10;
export const PLANET_MIN_SLOTS_SEED = 3;
export const PLANET_MAX_SLOTS_SEED = 12;
export const STATION_INIT_SLOTS = 1;
export const STATION_INIT_POWER_OUTPUT = 100; // Stations have mini-fusion reactor as backup for
export const STATION_INIT_UPKEEP = 100; // Having station isn't cheap!

interface SpacialLocationWithPlanet extends SpacialLocation {
    planet: Planet;
}
interface SpacialLocationWithStation extends SpacialLocation {
    station: ST;
}

export const oppositeOf = <T = void>(f: (...args: T[]) => boolean) => (...args: T[]) => !f(...args);
export const hasPlanet = (l: SpacialLocation): l is SpacialLocationWithPlanet => l.planet !== null;
export const hasStation = (l: SpacialLocation): l is SpacialLocationWithStation => l.station !== null;
export const planetColonized = (l: SpacialLocation): l is SpacialLocationWithPlanet => hasPlanet(l) && l.planet.buildings.includes(Colony);
export const stationConstructed = (l: SpacialLocation) => l.station !== null;
export const maxBuildingOfType = (ofType: string, max: number) => (l: SpacialLocation) => planetColonized(l) && l.planet.buildings.filter(b => b.ofType === ofType).length < max;

export const Colony: Construction = {
    ofType: 'Colony',
    buildCost: 10000,
    buildTime: 5,
    upkeepCost: 0,
    generateIncome: 100,
    powerOutput: 100,
    powerDrain: 0,
    slots: 0,
    requirements: [oppositeOf(planetColonized)]
};
export const LivingCompound: Construction = {
    ofType: 'LivingCompound',
    buildCost: 2500,
    buildTime: 8,
    upkeepCost: 0,
    generateIncome: 250,
    powerOutput: 0,
    powerDrain: 100,
    slots: 1,
    requirements: [planetColonized]
};
export const MiningFacility: Construction = {
    ofType: 'MiningFacility',
    buildCost: 1500,
    buildTime: 4,
    upkeepCost: 100,
    generateIncome: 500,
    powerOutput: 0,
    powerDrain: 100,
    slots: 1,
    requirements: [planetColonized]
};
export const SolarPowerPlant: Construction = {
    ofType: 'SolarPowerPlant',
    buildCost: 1200,
    buildTime: 4,
    upkeepCost: 100,
    generateIncome: 0,
    powerOutput: 500, // max power output
    powerDrain: 0,
    slots: 1,
    requirements: [planetColonized]
};
export const FusionReactor: Construction = {
    ofType: 'FusionReactor',
    buildCost: 5000,
    buildTime: 12,
    upkeepCost: 800,
    generateIncome: 0,
    powerOutput: 2500,
    powerDrain: 0,
    slots: 2,
    requirements: [planetColonized, maxBuildingOfType('FusionReactor', 1)]
};
export const SpacePort: Construction = {
    ofType: 'SpacePort',
    buildCost: 12000,
    buildTime: 24,
    upkeepCost: 0,
    generateIncome: 1000,
    powerOutput: 0,
    powerDrain: 1500,
    slots: 4,
    requirements: [planetColonized, maxBuildingOfType('SpacePort', 1)]
};
export const AssemblyFactory: Construction = {
    ofType: 'AssemblyFactory',
    buildCost: 8000,
    buildTime: 16,
    upkeepCost: 400,
    generateIncome: 0,
    powerOutput: 0,
    powerDrain: 1000,
    slots: 4,
    requirements: [planetColonized, maxBuildingOfType('AssemblyFactory', 1)]
};

export const Station: Construction = {
    ofType: 'Station',
    buildCost: 5000,
    buildTime: 5,
    upkeepCost: STATION_INIT_UPKEEP,
    generateIncome: 0,
    powerOutput: STATION_INIT_POWER_OUTPUT,
    powerDrain: 0,
    slots: 0,
    requirements: [oppositeOf(stationConstructed)]
};
export const LivingModule: Construction = {
    ofType: 'LivingModule',
    buildCost: 4000,
    buildTime: 12,
    upkeepCost: 0,
    generateIncome: 250,
    powerOutput: 0,
    powerDrain: 100,
    slots: 1,
    requirements: [stationConstructed]
};
export const SolarArrayModule: Construction = {
    ofType: 'SolarArrayModule',
    buildCost: 1200,
    buildTime: 4,
    upkeepCost: 0,
    generateIncome: 0,
    powerOutput: 1000,
    powerDrain: 0,
    slots: 1,
    requirements: [stationConstructed]
};
export const FusionModule: Construction = {
    ofType: 'FusionModule',
    buildCost: 7500,
    buildTime: 18,
    upkeepCost: 800,
    generateIncome: 0,
    powerOutput: 2500,
    powerDrain: 0,
    slots: 2,
    requirements: [stationConstructed, maxBuildingOfType('FusionModule', 1)]
};
export const SpaceDocks: Construction = {
    ofType: 'SpaceDocks',
    buildCost: 12000,
    buildTime: 24,
    upkeepCost: 0,
    generateIncome: 1000,
    powerOutput: 0,
    powerDrain: 1500,
    slots: 4,
    requirements: [stationConstructed, maxBuildingOfType('SpaceDocks', 1)]
};

export const PLANET_CONSTRUCTION_LIST: Construction[] = [
    Colony,
    LivingCompound, // increases income by providing place to live and work so commerce can evolve
    MiningFacility, // increases income
    SolarPowerPlant, // cheap 1st level energy source, works well on inner planets
    FusionReactor, // expensive but effective for distant planets, and can be upgraded
    SpacePort, // increases commerce and allows building ships
    AssemblyFactory, // speeds up construction on planet and increases income
];
export const STATION_CONSTRUCTION_LIST: Construction[] = [
    LivingModule,
    SolarArrayModule,
    FusionModule,
    SpaceDocks, // increases commerce and allows building ships
];
