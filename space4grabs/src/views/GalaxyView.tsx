import * as React from "react";
import {Galaxy} from "../models";
import {GalaxyStats, StarSystemCard} from "../components";
import {MainLayout} from "../layouts";
import { Row, Col, Image } from "react-bootstrap";
import img from '../assets/stock-images/galaxy-11139_1920.jpg';

export interface GalaxyViewProps {
    galaxy: Galaxy;
}

export const GalaxyView = ({galaxy}: GalaxyViewProps) => {
    return (
        <MainLayout containerProps={{className: 'galaxy-view'}}>
            <Row>
                <Col sm={6}><Image fluid rounded alt={galaxy.name} src={img} className="my-3"/></Col>
                <Col sm={6}>
                    <h1 className="my-3">{galaxy.name}</h1>
                    <GalaxyStats galaxy={galaxy}/>
                </Col>
            </Row>
            <hr />
            <Row>
                {galaxy.systems.map((system, index) => (
                    <Col key={index} lg={3} md={4} sm={6} className="py-3 px-3 px-sm-1">
                        <StarSystemCard index={index} system={system}/>
                    </Col>
                ))}
            </Row>
        </MainLayout>
    );
};
