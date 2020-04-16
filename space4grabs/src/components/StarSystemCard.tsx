import * as React from "react";
import {StarSystem} from "../models";
import {StarSystemStats} from "./StarSystemStats";
import {Link} from "react-router-dom";
import {Card} from "react-bootstrap";
import img from '../assets/stock-images/sun-1515503_1920.jpg';

export interface StarSystemCardProps {
    system: StarSystem;
    index: number;
}

export const StarSystemCard = ({system, index}: StarSystemCardProps) => (
    <Card className="star-system-card">
        <Link to={'/system/' + index}><Card.Img variant="top" src={img}/></Link>
        <Card.Body>
            <Card.Title><Link to={'/system/' + index}>{system.name}</Link></Card.Title>
            <Card.Text as="div">
                <StarSystemStats system={system}/>
            </Card.Text>
        </Card.Body>
    </Card>
);
