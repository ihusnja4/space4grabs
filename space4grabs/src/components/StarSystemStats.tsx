import React from "react";
import {StarSystem} from "../models";
import {hasPlanet, hasStation, planetColonized} from "../config";

export interface StarSystemStatsProps {
    system: StarSystem;
}

export const StarSystemStats = ({system}: StarSystemStatsProps) => {
    return (
        <div className="star-system-stats">
            <table>
                <tbody>
                    <tr>
                        <td>Planets</td>
                        <td>
                            {system.contains.filter(l => planetColonized(l)).length} {' / '}
                            {system.contains.filter(l => hasPlanet(l)).length}</td>
                    </tr>
                    <tr>
                        <td>Stations</td>
                        <td>{system.contains.filter(l => hasStation(l)).length} {' / '}
                            {system.contains.length}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
