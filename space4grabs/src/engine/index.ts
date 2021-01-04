import {
    Buildable,
    BuildRequirement,
    BuildTask,
    Construction,
    isConstruction,
    isShip,
    QueueableTask,
    QueueableTaskStatus,
    SpacialLocation,
} from '../models';
import {hasPlanet, hasStation} from '../config';
import { flow } from 'lodash';

export function createBuildTask(forPlanet: boolean, buildable: Buildable, quantity: number = 1): BuildTask {
    return {
        ofType: 'Build',
        progress: 0,
        buildable,
        quantity,
        status: QueueableTaskStatus.Pending,
        statusMsg: 'Not Started Yet',
        next: (task: BuildTask, location: SpacialLocation) => {
            const {buildable, quantity} = task;
            let {status, statusMsg, progress} = task;
            switch (task.status) {
                // @ts-ignore
                case QueueableTaskStatus.Waiting:
                // @ts-ignore
                case QueueableTaskStatus.Pending:
                    if (!hasMetRequirements(location, buildable.requirements)) {
                        status = QueueableTaskStatus.Waiting;
                        statusMsg = 'Missing Requirements'; // TODO make it more intelligible i.e. add list of requirements not met
                        break;
                    }
                    const maxToBuild = Math.min(maxBuild(location, buildable.buildCost), quantity);
                    if (maxToBuild < 1) {
                        status = QueueableTaskStatus.Waiting;
                        statusMsg = 'Not Enough Credits';
                        break;
                    }
                    if (isConstruction(buildable)) {
                        if(
                            (hasPlanet(location) && !hasPlanetSlotsToBuild(location, buildable.slots)) ||
                            (hasStation(location) && !hasStationSlotsToBuild(location, buildable.slots))
                        ) {
                            status = QueueableTaskStatus.Waiting;
                            statusMsg = 'Not Enough Construction Slots';
                            break;
                        }
                        location[forPlanet ? 'planet' : 'station']!.reservedSlots = buildable.slots * maxToBuild;
                    }
                    location.credits -= buildable.buildCost * maxToBuild;
                    status = QueueableTaskStatus.InProgress;
                    statusMsg = 'Building';
                case QueueableTaskStatus.InProgress:
                    progress = Math.min(progress + (1 / buildable.buildTime), 1); // TODO possible division with 0
                    if (progress < 1) {
                        break;
                    }
                    status = QueueableTaskStatus.Completed;
                    statusMsg = 'Done';
                    if (isConstruction(buildable)) {
                        location[forPlanet ? 'planet' : 'station']!.constructions.push(buildable); // this building is now complete and available
                        location[forPlanet ? 'planet' : 'station']!.reservedSlots = 0;
                    }
                    else if (isShip(buildable)) {
                        location.ships.push(buildable);
                    }
                    break
                default:
                // do nothing: if cancelled or paused
            }
            return [
                {...task, status, statusMsg, progress},
                location
            ];
        }
    };
}

export const hasCreditsToConstruct = (location: SpacialLocation, amount: number) => location.credits >= amount;
export const getAvailableStationSlots = (location: SpacialLocation) => hasStation(location) ? availableSlots(location.station.slots, location.station.constructions) : 0;
export const hasStationSlotsToBuild = (location: SpacialLocation, amount: number) => flow(
    () => getAvailableStationSlots(location),
    slots => slots >= amount
)();
export const getAvailablePlanetSlots = (location: SpacialLocation) => hasPlanet(location) ? availableSlots(location.planet.slots, location.planet.constructions) : 0;
export const hasPlanetSlotsToBuild = (location: SpacialLocation, amount: number) => flow(
    () => getAvailablePlanetSlots(location),
    slots => slots >= amount
)();
export const hasPowerToRun = (location: SpacialLocation, amount: number) => flow(
    () => getPower(location),
    (power: number) => power >= amount
)();
export const getPower = (location: SpacialLocation) => flow(
    (power: number) => hasPlanet(location) ? availablePower(power, location.planet.constructions) : power,
    (power: number) => hasStation(location) ? availablePower(power, location.station.constructions) : power
)(0);
export const maxBuild = (location: SpacialLocation, costOfUnit: number) => Math.floor(location.credits / costOfUnit);
export const hasMetRequirements = (resources: SpacialLocation, requirements: BuildRequirement[]) =>
    requirements.every(req => req(resources));
export const availableSlots = (initial: number, constructions: Construction[]) =>
    constructions.reduce((r, c) => r - c.slots, initial);
export const totalSlots = (initial: number, constructions: Construction[]) =>
    constructions.filter(r => r.slots < 0).reduce((r, c) => r - c.slots, initial);
export const availablePower = (initial: number, constructions: Construction[]) =>
    constructions.reduce((r, c) => r + c.power, initial);

/**
 * Run single task in the queue
 */
export function tickOne<T extends QueueableTask>(queue: T[], location: SpacialLocation) {
    const [task, ...rest] = queue;
    if (!task) { // nothing to run
        return [queue, location] as [T[], SpacialLocation];
    }
    const [nextTask, nextLocation] = task.next(task, location);
    if (nextTask.status === QueueableTaskStatus.Completed) { // task completed - remove it from queue
        return [rest, nextLocation] as [T[], SpacialLocation];
    }
    return [[nextTask, ...rest], nextLocation] as [T[], SpacialLocation];
}
