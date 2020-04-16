import React, {PropsWithChildren} from "react";
import {Col, Container, Row} from "react-bootstrap";

export interface MainLayoutProps {
    containerProps?: {[name: string]: any;}; // Some views may require additional customization of container node
}

export const MainLayout = ({children, containerProps = []}: PropsWithChildren<MainLayoutProps>) => (
    <Container {...containerProps}>
        <Row>
            <Col>
                {children}
            </Col>
        </Row>
    </Container>
);
