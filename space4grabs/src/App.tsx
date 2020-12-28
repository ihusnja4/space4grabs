import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import {generateGalaxy} from "./generator";
import {ErrorView, GalaxyView, GameConceptsView, StarSystemView} from "./views";
import {BrowserRouter, Route, Switch} from 'react-router-dom';

export default function App() {
    const galaxy = generateGalaxy('Milky Way');
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact>
                    <GalaxyView galaxy={galaxy}/>
                </Route>
                <Route path="/game-concepts">
                    <GameConceptsView/>
                </Route>
                <Route path="/system/:index">
                    <StarSystemView galaxy={galaxy}/>
                </Route>
                <Route path="*">
                    <ErrorView message="Not Found" code={404}/>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}
