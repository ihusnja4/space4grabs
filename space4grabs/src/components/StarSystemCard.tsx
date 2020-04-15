import * as React from "react";
import {StarSystem} from "../models";
import {StarSystemStats} from "./StarSystemStats";
import {Link} from "react-router-dom";

export interface StarSystemCardProps {
    system: StarSystem;
    index: number;
}

export const StarSystemCard = ({system, index}: StarSystemCardProps) => (
    <div className="star-system-card">
        <StarSystemStats system={system}/>
        <h3><Link to={'/system/' + index}>{system.name}</Link></h3>
    </div>
);
