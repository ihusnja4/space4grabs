import * as React from "react";
import {Galaxy} from "../models";
import {BackToGalaxyViewButton, SpacialLocationCard, StarSystemStats} from "../components";
import {useParams} from "react-router-dom";
import {MainLayout} from "../layouts";
import {ErrorView} from "./ErrorView";
import { Row, Col, Image } from "react-bootstrap";
import systemImg from '../assets/stock-images/sun-1515503_1920.jpg';

export interface StarSystemViewProps {
    galaxy: Galaxy;
}

export const StarSystemView = ({galaxy}: StarSystemViewProps) => {
    const { index } = useParams<{ index: string; }>();
    const i = parseInt(index, 10);
    if (isNaN(i)) {
        return <ErrorView message={`Invalid argument "${index}"`} code={400}/>;
    }
    const system = galaxy.systems[i];
    if (undefined === system) {
        return <ErrorView message={`System "${i}" does not exist`} code={404}/>;
    }
    return (
        <MainLayout containerProps={{className: 'galaxy-view'}}>
            <Row>
                <Col>
                    <BackToGalaxyViewButton/>
                </Col>
            </Row>
            <Row>
                <Col sm={6}><Image rounded fluid src={systemImg} alt={system.name} className="my-3"/></Col>
                <Col sm={6}>
                    <h1 className="my-3">{system.name}</h1>
                    <StarSystemStats system={system}/>
                </Col>
            </Row>
            <hr />
            <Row>
                {system.contains.map((location, index) => (
                    <Col key={index} lg={3} md={4} sm={6} className="py-3 px-3 px-sm-1">
                        <SpacialLocationCard location={location}/>
                    </Col>
                ))}
            </Row>
        </MainLayout>
    );
};
