import React from 'react';
import './App.scss';
import {generateGalaxy} from "./generator";
import {GalaxyView} from "./views/GalaxyView";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {StarSystemView} from "./views/StarSystemView";

export default function App() {
    const galaxy = generateGalaxy('Milky Way');
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact>
                    <GalaxyView galaxy={galaxy}/>
                </Route>
                <Route path="/system/:index">
                    <StarSystemView galaxy={galaxy}/>
                </Route>
                <Route path="*">
                    <p>Not found</p>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}
