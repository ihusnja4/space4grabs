import {Construction} from '../models';
import {maxBuildingOfType, oppositeOf, planetColonized, stationConstructed} from './helpers';
import {STATION_INIT_POWER_OUTPUT, STATION_INIT_UPKEEP} from './seeds';

export const Colony: Construction = {
    ofType: 'Colony',
    buildCost: 10000,
    buildTime: 5,
    upkeepCost: 0,
    generateIncome: 100,
    power: 100,
    slots: 0,
    requirements: [oppositeOf(planetColonized)]
};

export const LivingCompound: Construction = {
    ofType: 'LivingCompound',
    buildCost: 2500,
    buildTime: 8,
    upkeepCost: 0,
    generateIncome: 250,
    power: -100,
    slots: 1,
    requirements: [planetColonized]
};

export const MiningFacility: Construction = {
    ofType: 'MiningFacility',
    buildCost: 1500,
    buildTime: 4,
    upkeepCost: 100,
    generateIncome: 500,
    power: -100,
    slots: 1,
    requirements: [planetColonized]
};

export const SolarPowerPlant: Construction = {
    ofType: 'SolarPowerPlant',
    buildCost: 1200,
    buildTime: 4,
    upkeepCost: 100,
    generateIncome: 0,
    power: 500, // TODO max power output
    slots: 1,
    requirements: [planetColonized]
};

export const FusionReactor: Construction = {
    ofType: 'FusionReactor',
    buildCost: 5000,
    buildTime: 12,
    upkeepCost: 800,
    generateIncome: 0,
    power: 2500,
    slots: 2,
    requirements: [planetColonized, maxBuildingOfType('FusionReactor', 1)]
};

export const SpacePort: Construction = {
    ofType: 'SpacePort',
    buildCost: 12000,
    buildTime: 24,
    upkeepCost: 0,
    generateIncome: 1000,
    power: -1500,
    slots: 4,
    requirements: [planetColonized, maxBuildingOfType('SpacePort', 1)]
};

export const AssemblyFactory: Construction = {
    ofType: 'AssemblyFactory',
    buildCost: 8000,
    buildTime: 16,
    upkeepCost: 400,
    generateIncome: 0,
    power: -1000,
    slots: 4,
    requirements: [planetColonized, maxBuildingOfType('AssemblyFactory', 1)]
};

export const Station: Construction = {
    ofType: 'Station',
    buildCost: 5000,
    buildTime: 5,
    upkeepCost: STATION_INIT_UPKEEP,
    generateIncome: 0,
    power: STATION_INIT_POWER_OUTPUT, // TODO max power output
    slots: 0,
    requirements: [oppositeOf(stationConstructed)]
};

export const LivingModule: Construction = {
    ofType: 'LivingModule',
    buildCost: 4000,
    buildTime: 12,
    upkeepCost: 0,
    generateIncome: 250,
    power: -100,
    slots: 1,
    requirements: [stationConstructed]
};

export const SolarArrayModule: Construction = {
    ofType: 'SolarArrayModule',
    buildCost: 1200,
    buildTime: 4,
    upkeepCost: 0,
    generateIncome: 0,
    power: 1000, // TODO max power output
    slots: 1,
    requirements: [stationConstructed]
};

export const FusionModule: Construction = {
    ofType: 'FusionModule',
    buildCost: 7500,
    buildTime: 18,
    upkeepCost: 800,
    generateIncome: 0,
    power: 2500,
    slots: 2,
    requirements: [stationConstructed, maxBuildingOfType('FusionModule', 1)]
};

export const SpaceDocks: Construction = {
    ofType: 'SpaceDocks',
    buildCost: 12000,
    buildTime: 24,
    upkeepCost: 0,
    generateIncome: 1000,
    power: -1500,
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
