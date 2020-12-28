import React, {useState} from "react";
import {Button, Col, Row, Table} from 'reactstrap';
import {Line} from 'react-chartjs-2';
import {MainLayout} from "../layouts";
import {numberRange} from "../util";
import {calculateInSystemTravel, calculateInterStellarTravel} from '../concept/navigation';

const cyan = 'rgba(75,192,192,%f)';
const magenta = 'rgba(192,75,192,%f)';
const yellow = 'rgba(192,192,75,%f)';
const blue = 'rgba(75,75,192,%f)';
const red = 'rgba(192,75,75,%f)';
const green = 'rgba(75,192,75,%f)';
const cyan2 = 'rgba(75,150,150,%f)';
const magenta2 = 'rgba(150,75,150,%f)';
const yellow2 = 'rgba(230,150,75,%f)';
const blue2 = 'rgba(75,75,150,%f)';
const red2 = 'rgba(150,75,75,%f)';
const green2 = 'rgba(75,150,75,%f)';
const orbitalColors = [
    cyan,
    magenta,
    yellow,
    blue,
    red,
    green,
    cyan2,
    magenta2,
    yellow2,
    blue2,
    red2,
    green2,
];

const dataset = (label: string, data: any, color: string) => ({
    label,
    fill: false,
    lineTension: 0.1,
    backgroundColor: color.replace('%f', '0.4'),
    borderColor: color.replace('%f', '1'),
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: color.replace('%f', '1'),
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: color.replace('%f', '1'),
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data,
});

export const GameConceptsView = () => {
    const [orbitalDetailsCollapsed, setODC] = useState(true);
    const [interStellarDetailsCollapsed, setISDC] = useState(true);
    const orbits = numberRange(1, 12);
    const systems = numberRange(1, 50).map(distance => ({
        distance,
        eta: calculateInterStellarTravel(distance)
    }));
    const orbitalData = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext("2d");
        const gradient = ctx!.createLinearGradient(0,0,100,0);
        return {
            labels: orbits.map(i => `#${i}`),
            datasets: orbits.map((to, ix) =>
                dataset(
                    `ETA from #${to}`,
                    orbits.map(from => ({x: from, y: from === to ? 0 : calculateInSystemTravel(from, to)})),
                    orbitalColors[ix]
                )
            ),
            backgroundColor: gradient
        };
    };
    const interStellarData = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext("2d");
        const gradient = ctx!.createLinearGradient(0,0,100,0);
        return {
            labels: systems.map(({distance}) => distance),
            datasets: [
                dataset(
                    'ETA (turns)',
                    systems.map(({distance, eta}) => ({x: distance, y: eta})),
                    cyan
                ),
                dataset(
                    'Efficiency (%)',
                    systems.map(({distance, eta}) => ({x: distance, y: (100 * distance / eta).toFixed(2)})),
                    magenta
                ),
            ],
            backgroundColor: gradient
        };
    };

    return (
        <MainLayout>
            <Row>
                <Col>
                    <h1>Game Concepts</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Navigation</h2>

                    <h3>In-system travel times</h3>
                    Traveling in system is linear as it requires combination of rocket and ion Engines to safely
                    accelerate, then decelerate at destination.

                    <div className="my-3">
                        <Line data={orbitalData}/>
                        <Button
                            color="default"
                            size="sm"
                            className="mt-3"
                            onClick={() => setODC(p => !p)}
                        >Toggle details</Button>
                        <Table striped hover hidden={orbitalDetailsCollapsed} className="my-3">
                            <thead>
                            <tr>
                                <td>Orbit to orbit</td>
                                {orbits.map(i => <td key={i}>#{i}</td>)}
                            </tr>
                            </thead>
                            <tbody>
                            {orbits.map(j => (
                                <tr key={j}>
                                    <td>#{j}</td>
                                    {orbits.map(i => <td key={i}>{i === j ? '-' : calculateInSystemTravel(i, j)}</td>)}
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>

                    <h3>Inter-stellar travel times</h3>
                    Traveling between systems is non-linear. Phase drive, needs to charge-up,
                    but once it gets going it greatly decreases time of arrival the longer the distance.

                    <div className="my-3">
                        <Line data={interStellarData}/>
                        <Button
                            color="default"
                            size="sm"
                            className="mt-3"
                            onClick={() => setISDC(p => !p)}
                        >Toggle details</Button>
                        <Table striped hover hidden={interStellarDetailsCollapsed} className="mt-3">
                        <thead>
                            <tr>
                                <td>Distance (in systems)</td>
                                <td>ETA (turns)</td>
                                <td>Eff. factor (%)</td>
                            </tr>
                        </thead>
                        <tbody>
                            {systems.map(({distance, eta}) => (
                                <tr key={distance}>
                                    <td>{distance}</td>
                                    <td>{eta}</td>
                                    <td>{(100 * distance / eta).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    </div>
                </Col>
            </Row>
        </MainLayout>
    );
}
