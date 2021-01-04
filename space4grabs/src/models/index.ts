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
    readonly index: number; // TODO distance from the center of system, has influence on solar station power output!
    readonly system: StarSystem; // parent ref
    readonly planet: Planet | null;
    station: Station | null; // stations can be built but also destroyed
    // TODO Easter eggs: rare or common phenomena like a comet, derelict ship or station, interesting plasma discharge,
    // And on planets also cave system, volcano, ruins, lake or fauna etc...
    credits: number; // credits are shared between all planets and stations
    // TODO credits are used to simplify "generation of consumable resource", as using "construction parts" would also
    //  require transferring such resource from planet to planet via vessel, but this ides will probably come in later
    ships: Ship[]; // ships resting at this location
}

export interface Planet extends ConstructionSpace {
    ofType: 'Planet'
}

export interface Station extends ConstructionSpace {
    ofType: 'Station'
}

export type ConstructionSpaceQueueable = BuildTask | IdleTask; // TODO DestroyTask
export interface ConstructionSpace {
    name: string;
    readonly ofType: string;
    readonly location: SpacialLocation; // parent ref
    queue: ConstructionSpaceQueueable[];
    slots: number;
    reservedSlots: number;
    constructions: Construction[]; // built on the planet or attached to station
    availableConstructionList: Construction[]; // list of available constructions to build from,
    // Also adds benefit of modding the particular planets i.e. capture the planet and build a "special construction"
}

export interface Buildable {
    readonly ofType: string;
    readonly upkeepCost: number; // upgrades can decrease upkeep cost
    readonly buildCost: number; // upgrades can decrease build cost
    readonly buildTime: number; // upgrades can decrease build time
    readonly requirements: BuildRequirement[];
}
export type BuildRequirement = (l: SpacialLocation) => boolean;

export enum QueueableTaskStatus {
    Pending, // Not yet started
    InProgress,
    Waiting, // Missing resources i.e. workers
    Paused, // Manually paused, it requires putting it back to InProgress to continue, or Cancelled to discard it
    Cancelled,
    Failed, // ATM not sure which tasks should ever fail... it would probably those that cannot restore resources
    Completed
}

export type QueueableTaskNextFn<T extends QueueableTask = any> =
    (task: T, location: SpacialLocation) => [T, SpacialLocation];

export interface QueueableTask {
    readonly ofType: string;
    status: QueueableTaskStatus;
    statusMsg: string;
    next: QueueableTaskNextFn;
    [name: string]: any;
}

export interface TravelTask extends QueueableTask {
    readonly ofType: 'Travel';
    next: QueueableTaskNextFn<TravelTask>;
    origin: SpacialLocation | null;
    target: SpacialLocation | null;
    designation: string | null; // when processing travel in queue designation keeps record of progress
}
export interface IdleTask extends QueueableTask {
    readonly ofType: 'Idle';
    next: QueueableTaskNextFn<IdleTask>;
    remaining: number;
}
export interface BuildTask extends QueueableTask {
    readonly ofType: 'Build';
    next: QueueableTaskNextFn<BuildTask>;
    buildable: Buildable;
    quantity: number;
    progress: number; // 0 to 1 on a scale of completeness
    // ^^ This is "calculation-safe" when upgrades to the build time are applied, it will simply add new "faster"
    // percentage amount to it.
    // i.e. if build time was 10, then decreased to 8, if previous progress of 4 turns made 40% (0.4), it will take 5 more
    // turns to complete (12.5% per turn) instead of 6 (10% per turn) if without the upgrade.
}
// TODO DestroyTask, InvadeTask, ColonizeTask, AbandonTask

export const InTransit = 'InTransit';
export type ShipQueueable = TravelTask | IdleTask;
export interface Ship extends Buildable {
    location: SpacialLocation | typeof InTransit;
    queue: ShipQueueable[];
    history: ShipQueueable[];
}

export interface Construction extends Buildable {
    slots: number;
    generateIncome: number;
    power: number;
}

export function isConstruction(buildable: Buildable): buildable is Construction {
    return typeof (buildable as Construction).slots === 'number';
}

export function isShip(buildable: Buildable): buildable is Ship {
    return (buildable as Ship).history instanceof Array;
}

export function isBuildTask(task: QueueableTask): task is BuildTask {
    return task.ofType === 'Build';
}
