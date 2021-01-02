import React from "react";
import {Alert, Col, Row} from 'reactstrap';
import {MainLayout} from "../layouts";
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {NavigationView} from './game-concepts';
import {Link} from 'react-router-dom';
import {ChevronLeft} from 'react-bootstrap-icons';

export const GameConceptsView = () => {
    const match = useRouteMatch();
    return (
        <MainLayout>
            <Row>
                <Col>
                    <h1>Game Concepts</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Switch>
                        <Route path={match.path} exact>
                            <NavigationView/>
                        </Route>
                        <Route path={`${match.path}/navigation`} exact>
                            <NavigationView/>
                        </Route>
                        <Route path="**">
                            <Link to={match.path} className="btn btn-secondary"><ChevronLeft/> Back to Game Concepts</Link>
                            <Alert color="danger" className="mt-3">404 Not Found</Alert>
                        </Route>
                    </Switch>
                </Col>
            </Row>
        </MainLayout>
    );
}
