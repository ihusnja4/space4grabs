import React from "react";
import {Galaxy} from "../models";
import {arrayCountAggregate} from "../util";
import {hasPlanet, hasStation, planetColonized} from "../config";
import {Table} from "react-bootstrap";

export interface GalaxyStatsProps {
    galaxy: Galaxy;
}

export const GalaxyStats = ({galaxy}: GalaxyStatsProps) => (
    <>
        <Table bordered className="galaxy-stats my-2 d-sm-none" responsive size="sm">
            <thead>
            <tr>
                <th>Systems</th>
                <th>Planets</th>
                <th>Stations</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{galaxy.systems.length}</td>
                <td>{arrayCountAggregate(galaxy.systems, (s) => s.contains.filter(planetColonized).length)}
                    {' / '}
                    {arrayCountAggregate(galaxy.systems, (s) => s.contains.filter(hasPlanet).length)}</td>
                <td>{arrayCountAggregate(galaxy.systems, (s) => s.contains.filter(hasStation).length)}
                    {' / '}
                    {arrayCountAggregate(galaxy.systems, (s) => s.contains.length)}</td>
            </tr>
            </tbody>
        </Table>
        <Table hover bordered className="galaxy-stats my-2 d-none d-sm-table" responsive size="sm">
            <tbody>
            <tr>
                <th>Systems</th>
                <td>{galaxy.systems.length}</td>
            </tr>
            <tr>
                <th>Planets</th>
                <td>{arrayCountAggregate(galaxy.systems, (s) => s.contains.filter(planetColonized).length)}
                    {' / '}
                    {arrayCountAggregate(galaxy.systems, (s) => s.contains.filter(hasPlanet).length)}</td>
            </tr>
            <tr>
                <th>Stations</th>
                <td>{arrayCountAggregate(galaxy.systems, (s) => s.contains.filter(hasStation).length)}
                    {' / '}
                    {arrayCountAggregate(galaxy.systems, (s) => s.contains.length)}</td>
            </tr>
            </tbody>
        </Table>
    </>
);
