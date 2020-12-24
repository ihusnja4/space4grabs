import React from "react";
import {Alert} from "reactstrap";
import {MainLayout} from "../layouts";
import {BackToGalaxyViewButton} from "../components";

export interface ErrorViewProps {
    message?: string;
    code?: number;
    error?: Error;
}

export const ErrorView = ({message = 'Unknown Error', code = 599}: ErrorViewProps) => (
    <MainLayout>
        <BackToGalaxyViewButton/>
        <Alert variant="danger">{code} {message}</Alert>
    </MainLayout>
);
