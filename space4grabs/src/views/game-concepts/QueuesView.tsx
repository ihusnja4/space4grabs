import React, {useCallback, useMemo, useState} from 'react';
import {
    Buildable,
    Construction,
    ConstructionSpaceQueueable,
    isBuildTask,
    Planet,
    QueueableTaskStatus,
    SpacialLocation,
    StarSystem
} from '../../models';
import {Colony, LivingCompound, PLANET_CONSTRUCTION_LIST} from '../../config';
import {createBuildTask, getAvailablePlanetSlots, getPower, hasMetRequirements, tickOne, totalSlots} from '../../engine';
import {Button, Progress, Table} from 'reactstrap';
import {Plus, X} from 'react-bootstrap-icons';

interface BuildablesGrouped<T extends Buildable> {
    [name: string]: T & {quantity: number;};
}

function groupByType<T extends Buildable>(r: BuildablesGrouped<T>, item: T) {
    if (r[item.ofType]) {
        r[item.ofType].quantity++;
        return r;
    }
    return {...r, [item.ofType]: {...item, quantity: 1}};
}

export const QueuesView = () => {
    const [a, b] = useMemo(
        () => {
            const queue: ConstructionSpaceQueueable[] = [createBuildTask(true, LivingCompound)];
            const SystemUrus: StarSystem = {
                name: 'Urus',
                directLinks: [],
                contains: []
            };
            const Orbit1: SpacialLocation = {
                name: 'Orbit 1',
                index: 0,
                system: SystemUrus,
                planet: null,
                station: null,
                credits: 5000,
                ships: [],
            };
            const PlanetX: Planet = {
                location: Orbit1,
                name: 'Planet X',
                ofType: 'Planet',
                queue,
                slots: 14,
                reservedSlots: 0,
                constructions: [Colony],
                availableConstructionList: PLANET_CONSTRUCTION_LIST
            };
            (Orbit1 as any).planet = PlanetX;
            SystemUrus.contains.push(Orbit1);

            return [queue, Orbit1];
        },
        []
    );
    const [[turn, planetQueue, location], setState] = useState([1, a, b]);
    const tick = useCallback(
        () => {
            setState([turn + 1, ...tickOne(planetQueue, location)]);
        },
        [turn, planetQueue, location]
    );
    const add = useCallback(
        (item: Construction) => () => {
            setState(([t, q, l]) => [
                t,
                [...q, createBuildTask(true, item)],
                l
            ]);
        },
        [turn, planetQueue, location]
    );
    const remove = useCallback(
        (ix: number) => () => {
            setState(([t, q, l]) => [
                t,
                [...q.slice(0, ix), ...q.slice(ix + 1)],
                l
            ]);
        },
        [turn, planetQueue, location]
    );
    const destroy = (ofType: string) => () => alert(`Cannot destroy ${ofType}: Not supported yet!`);

    return (
        <>
            <h1>Queuing System</h1>
            Queues make this game run, literally! Building a planet or station, or ship, traveling... all made possible
            by queues.
            <br />
            <h2>Example of a queue</h2>
            <Button color="primary" onClick={tick}>Next Turn</Button>
            <Table hover bordered className="mt-3" size="sm">
                <tbody>
                <tr>
                    <th>Turn</th>
                    <td>{turn}</td>
                </tr>
                <tr>
                    <th>Location</th>
                    <td>{location.name}</td>
                </tr>
                <tr>
                    <th>Credits</th>
                    <td>{location.credits}</td>
                </tr>
                <tr>
                    <th>Power</th>
                    <td>{getPower(location)}</td>
                </tr>
                {location.planet? (
                    <>
                        <tr>
                            <th>Planet</th>
                            <td>{location.planet.name}</td>
                        </tr>
                        <tr>
                            <td>Slots</td>
                            <td>{getAvailablePlanetSlots(location)} / {totalSlots(location.planet.slots, location.planet.constructions)}</td>
                        </tr>
                        <tr>
                            <td>Constructions</td>
                            <td>
                                <Table hover bordered striped size="sm">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Item</th>
                                            <th className="text-right">Quantity</th>
                                            <th className="text-right" title="+Income/-Upkeep per turn">Credits/T</th>
                                            <th className="text-right" title="+Provides/+Claims slots (one-time)">Slots</th>
                                            <th className="text-right" title="+Generate/-Consume per turn">Power/T</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values(
                                            location.planet.constructions.reduce(groupByType, {} as BuildablesGrouped<Construction>)
                                        ).map(({ofType, quantity, slots, power, upkeepCost, buildCost, generateIncome}, ix) => (
                                            <tr key={`${ix}-${ofType}`}>
                                                <td>#{ix + 1}</td>
                                                <td>{ofType}</td>
                                                <td className="text-right">{quantity}</td>
                                                <td className={`text-${upkeepCost ? 'danger': 'success'} text-right`}>
                                                    {`${upkeepCost ? '-': '+'}${(upkeepCost || generateIncome) * quantity}`}
                                                </td>
                                                <td className={`text-${slots >= 0 ? 'danger': 'success'} text-right`}>
                                                    {`${slots >= 0 ? '-': '+'}${Math.abs(slots * quantity)}`}
                                                </td>
                                                <td className={`text-${power < 0 ? 'danger': 'success'} text-right`}>
                                                    {`${power >= 0 ? '+': '-'}${Math.abs(power * quantity)}`}
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        disabled={ofType === 'Colony'}
                                                        title="Destroy the building"
                                                        className="p-0 px-1"
                                                        size="sm"
                                                        onClick={destroy(ofType)}>
                                                        <X />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </td>
                        </tr>
                        <tr>
                            <td>Build Queue</td>
                            <td>
                                <Table hover bordered striped size="sm">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Item</th>
                                            <th>Status</th>
                                            <th>Progress</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {planetQueue.map((item, ix) => (
                                            <tr key={`${ix}-${item.ofType}`}>
                                                <td>#{ix + 1}</td>
                                                <td>{item.buildable.ofType}</td>
                                                <td>{item.statusMsg}</td>
                                                <td className="position-relative">{isBuildTask(item) ?
                                                    (
                                                        <>
                                                            <div className={`position-absolute text-${item.progress > 0.5 ? 'light': 'dark'} text-center w-100`} style={{fontSize: '0.75rem'}}>
                                                                {Math.round(item.progress * 100)}%
                                                            </div>
                                                            <Progress value={item.progress * 100}/>
                                                        </>
                                                    ) :
                                                    `Complete in ${item.remaining} turns`
                                                }</td>
                                                <td className="text-center">
                                                    <Button
                                                        disabled={item.status === QueueableTaskStatus.InProgress}
                                                        title="Remove from queue"
                                                        className="p-0 px-1"
                                                        size="sm"
                                                        onClick={remove(ix)}>
                                                        <X />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </td>
                        </tr>
                        <tr>
                            <td>Available</td>
                            <td>
                                <Table hover bordered striped size="sm">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th className="text-right" title="One-time cost">Credits</th>
                                            <th className="text-right" title="Build time in turns">Time</th>
                                            <th className="text-right" title="+Income/-Upkeep per turn">Credits/T</th>
                                            <th className="text-right" title="+Provides/+Claims slots (one-time)">Slots</th>
                                            <th className="text-right" title="+Generate/-Consume per turn">Power/T</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {location.planet.availableConstructionList.map((item, ix) => (
                                            <tr
                                                key={`${ix}-${item.ofType}`}
                                                className={hasMetRequirements(location, item.requirements) ? '' : 'text-muted'}>
                                                <td>{item.ofType}</td>
                                                <td className="text-right">{item.buildCost}</td>
                                                <td className="text-right">{item.buildTime}</td>
                                                <td className={`text-${item.upkeepCost ? 'danger': 'success'} text-right`}>
                                                    {`${item.upkeepCost ? '-': '+'}${item.upkeepCost || item.generateIncome}`}
                                                </td>
                                                <td className={`text-${item.slots >= 0 ? 'danger': 'success'} text-right`}>
                                                    {`${item.slots >= 0 ? '-': '+'}${Math.abs(item.slots)}`}
                                                </td>
                                                <td className={`text-${item.power < 0 ? 'danger': 'success'} text-right`}>
                                                    {`${item.power >= 0 ? '+': '-'}${Math.abs(item.power)}`}
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        disabled={!hasMetRequirements(location, item.requirements)}
                                                        title="Add to queue"
                                                        className="p-0 px-1"
                                                        size="sm"
                                                        onClick={add(item)}>
                                                        <Plus />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </td>
                        </tr>
                    </>
                ) : (
                    <tr>
                        <th>Planet</th><td className="text-muted">Uninhabited</td>
                    </tr>
                )}

                </tbody>
            </Table>
        </>
    );
};
