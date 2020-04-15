import React from "react";
import {Galaxy} from "../models";
import {arrayCountAggregate} from "../util";
import {hasPlanet, hasStation, planetColonized} from "../config";

export interface GalaxyStatsProps {
    galaxy: Galaxy;
}

export const GalaxyStats = ({galaxy}: GalaxyStatsProps) => (
    <div className="galaxy-stats">
        <table>
            <thead>
            <tr>
                <th>Systems</th>
                <th>Planets</th>
                <th>Colonized</th>
                <th>Stations</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{galaxy.systems.length}</td>
                <td>{arrayCountAggregate(galaxy.systems, (s) => s.contains.filter(hasPlanet).length)}</td>
                <td>{arrayCountAggregate(galaxy.systems, (s) => s.contains.filter(planetColonized).length)}</td>
                <td>{arrayCountAggregate(galaxy.systems, (s) => s.contains.filter(hasStation).length)}</td>
            </tr>
            </tbody>
        </table>
    </div>
);
