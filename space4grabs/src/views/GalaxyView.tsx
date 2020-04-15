import * as React from "react";
import {Galaxy} from "../models";
import {StarSystemCard} from "../components/StarSystemCard";
import {GalaxyStats} from "../components/GalaxyStats";

export interface GalaxyViewProps {
    galaxy: Galaxy;
}

export const GalaxyView = ({galaxy}: GalaxyViewProps) => {
    return (
        <div className="galaxy-view">
            <GalaxyStats galaxy={galaxy}/>
            {galaxy.systems.map((system, index) => <StarSystemCard key={index} index={index} system={system}/>)}
        </div>
    );
};
