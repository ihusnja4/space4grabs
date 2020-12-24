import React from "react";
import {StarSystem} from "../models";
import {StarSystemStats} from "./StarSystemStats";
import {Link} from "react-router-dom";
import {Card, CardImg, CardBody, CardTitle, CardText} from "reactstrap";
import img from '../assets/stock-images/sun-1515503_1920.jpg';

export interface StarSystemCardProps {
    system: StarSystem;
    index: number;
}

export const StarSystemCard = ({system, index}: StarSystemCardProps) => (
    <Card className="star-system-card">
        <Link to={'/system/' + index}><CardImg variant="top" src={img}/></Link>
        <CardBody>
            <CardTitle><Link to={'/system/' + index}>{system.name}</Link></CardTitle>
            <CardText as="div">
                <StarSystemStats system={system}/>
            </CardText>
        </CardBody>
    </Card>
);
