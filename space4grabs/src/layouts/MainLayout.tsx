import React, {PropsWithChildren} from "react";
import { Link } from "react-router-dom";
import {Col, Container, Nav, Navbar, NavItem, Row} from "reactstrap";

export interface MainLayoutProps {
    containerProps?: {[name: string]: any;}; // Some views may require additional customization of container node
}

export const MainLayout = ({children, containerProps = {}}: PropsWithChildren<MainLayoutProps>) => (
    <>
        <Navbar color="dark">
            <Nav>
                <NavItem className="py-1 px-3">
                    <Link to="/" className="text-white">Home</Link>
                </NavItem>
                <NavItem className="py-1 px-3">
                    <Link to="/game-concepts" className="text-white">Game Concepts</Link>
                </NavItem>
            </Nav>
        </Navbar>
        <Container {...containerProps}>
            <Row>
                <Col>
                    {children}
                </Col>
            </Row>
        </Container>
    </>
);
