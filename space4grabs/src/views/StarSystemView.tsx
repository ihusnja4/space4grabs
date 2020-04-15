import * as React from "react";
import {Galaxy} from "../models";
import {StarSystemStats} from "../components/StarSystemStats";
import {SpacialLocationCard} from "../components/SpacialLocationCard";
import {Link, useParams} from "react-router-dom";

export interface StarSystemViewProps {
    galaxy: Galaxy;
}

export const StarSystemView = ({galaxy}: StarSystemViewProps) => {
    const { index } = useParams<{ index: string; }>();
    const i = parseInt(index, 10);
    if (isNaN(i)) {
        return (<div className="error">Invalid argument {index}</div>); // TODO turn into error 400
    }
    const system = galaxy.systems[i];
    if (undefined === system) {
        return (<div className="error">System {i} does not exist</div>); // TODO turn into error 404
    }
    console.log('System', i, system, galaxy);
    return (
        <div className="galaxy-view">
            <Link to='/'>Back to Galaxy</Link>
            <StarSystemStats system={system}/>
            {system.contains.map((location, index) => <SpacialLocationCard key={index} location={location}/>)}
        </div>
    );
};
