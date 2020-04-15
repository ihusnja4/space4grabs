import React from "react";
import {SpacialLocation, Planet, Station} from "../models";
import {hasPlanet, hasStation, planetColonized} from "../config";

export interface SpacialLocationCardProps {
    location: SpacialLocation;
}

const PlanetCard = ({planet}: {planet: Planet}) => (
    <div className="planet-card">{planet.name}</div>
);
const EmptyCard = () => (<div className="empty-card"/>);
const StationCard = ({station}: {station: Station}) => (
    <div className="station-card" title={station.name}/>
);
const NoStationCard = () => (<div className="station-card empty"/>);

export const SpacialLocationCard = ({location}: SpacialLocationCardProps) => {
    const c = ['spacial-location-card'];
    const isPlanet = hasPlanet(location);
    const isPlanetColonized = planetColonized(location);
    const isStation = hasStation(location);
    if (isPlanet) {
        c.push('has-planet');
    }
    if (isPlanetColonized) {
        c.push('has-planet-colonized');
    }
    if (isStation) {
        c.push('has-station');
    }
    return (
        <div className={c.join(' ')} title={location.name}>
            {hasPlanet(location) ? <PlanetCard planet={location.planet}/> : <EmptyCard />}
            {hasStation(location) ? <StationCard station={location.station}/> : <NoStationCard />}
        </div>
    );
};
