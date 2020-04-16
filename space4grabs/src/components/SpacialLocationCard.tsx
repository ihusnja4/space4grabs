import React from "react";
import {SpacialLocation} from "../models";
import {hasPlanet, hasStation, planetColonized} from "../config";
import { Card } from "react-bootstrap";
import planetImg from "../assets/stock-images/planet-a-640x440.jpg";
import emptyImg from "../assets/stock-images/empty_space_640x440.jpg";

export interface SpacialLocationCardProps {
    location: SpacialLocation;
}

export const SpacialLocationCard = ({location}: SpacialLocationCardProps) => {
    const c = ['spacial-location-card'];
    const planet = hasPlanet(location) ? location.planet : null;
    const station = hasStation(location) ? location.station : null;
    const isPlanetColonized = planetColonized(location);
    if (planet) {
        c.push('has-planet');
    }
    if (isPlanetColonized) {
        c.push('has-planet-colonized');
    }
    if (station) {
        c.push('has-station');
    }
    return (
        <Card className={c.join(' ')} title={location.name}>
            <Card.Img variant="top" src={planet ? planetImg : emptyImg}/>
            <Card.Body>
                <Card.Title>{planet ? <span className={isPlanetColonized ? 'text-success' : 'text-info'}>{planet.name}</span> : location.name}</Card.Title>
                <Card.Text as="div">
                    <table>
                        <tbody>
                        <tr>
                            <td>Status</td>
                            <td>
                                {isPlanetColonized ? <span className="text-success">Colonized</span> : planet ? <span className="text-info">Habitable</span> : 'Empty'}
                            </td>
                        </tr>
                        <tr>
                            <td>Station</td>
                            <td>{station ? <p className="text-success">Yes</p> : 'No'}</td>
                        </tr>
                        </tbody>
                    </table>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};
