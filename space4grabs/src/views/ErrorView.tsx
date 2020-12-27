import React from "react";
import {Alert, Col, Row} from "reactstrap";
import {MainLayout} from "../layouts";
import {BackToGalaxyViewButton} from "../components";

export interface ErrorViewProps {
    message?: string;
    code?: number;
    error?: Error;
}

export const ErrorView = ({message = 'Unknown Error', code = 599}: ErrorViewProps) => (
    <MainLayout>
        <Row>
            <Col className="pt-2">
                <BackToGalaxyViewButton/>
                <Alert color="danger" className="mt-2">{code} {message}</Alert>
            </Col>
        </Row>
    </MainLayout>
);
