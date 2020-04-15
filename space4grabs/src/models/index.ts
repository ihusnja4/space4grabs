/*
A planet or orbital station are construction spaces. In order to deploy a construction to that space it is necessary to
have enough construction slots available.
By default planets have >1 slots already available while stations when first deployed only provide exactly one slot, so
to extend a station it is required to extend the number of slots.

Once slot has been prepared (either on planet or station), it can be used only once to construct some improvement.
I.e. a mining facility can be built on the planet or solar array module attached to station.

Some constructions require more than 1 slot to be build upon them. It is not possible to build such constructions unless
there is enough available slots.

Constructions can also be re-purposed by deconstructing them for certain amount of credits returned and the occupied slots
become available again after deconstruction.

Constructions provide one or more of following:
- income increase per turn like living accommodation and commerce
- power output increase per turn like power plants and modules
- abilities like planet or station to construct ships, improve build times, or efficient use of resources
 */
export interface Galaxy {
    name: string;
    readonly systems: StarSystem[];
}
export interface StarSystem {
    name: string;
    readonly directLinks: StarSystem[]; // doubly linked list
    readonly contains: SpacialLocation[];
}
export interface SpacialLocation {
    name: string;
    readonly index: number; // distance from the center of system, has influence on solar station power output!
    readonly system: StarSystem; // parent ref
    readonly planet: Planet | null;
    station: Station | null; // stations can be built but also destroyed
    // TODO Easter eggs: rare or common phenomena like a comet, derelict ship or station, interesting plasma discharge,
    // And on planets also cave system, volcano, ruins, lake or fauna etc...
}
export interface Planet extends ConstructionSpace {
    ofType: 'Planet'
}
export interface Station extends ConstructionSpace {
    ofType: 'Station'
}

export const ConstructionSlot = 'construction_slot';
export interface ConstructionSpace {
    name: string;
    readonly ofType: string;
    readonly location: SpacialLocation; // parent ref
    slots: number;
    buildings: Construction[];
    queue: (Construction | typeof ConstructionSlot)[];
    constructionList: Construction[];
}

export interface Buildable {
    readonly ofType: string;
    readonly upkeepCost: number; // upgrades can decrease upkeep cost
    readonly buildCost: number; // upgrades can decrease build cost
    readonly buildTime: number; // upgrades can decrease build time
    readonly requirements: BuildRequirement[];
}
export type BuildRequirement = (l: SpacialLocation) => boolean;

export interface Travel {
    origin: SpacialLocation | null;
    target: SpacialLocation | null;
    designation: string | null; // when processing travel in queue designation keeps record of progress
}
export interface Idle {
    time: number;
}
export type Queueable = Travel | Idle; // TODO transfer, invade and colonize

export const InTransit = 'InTransit';
export interface Ship extends Buildable {
    location: SpacialLocation | typeof InTransit;
    queue: Queueable[];
    history: Queueable[];
}

export interface Construction extends Buildable {
    slots: number;
    generateIncome: number;
    powerOutput: number;
    powerDrain: number;
}
