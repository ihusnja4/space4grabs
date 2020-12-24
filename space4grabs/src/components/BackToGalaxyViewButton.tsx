import {Link} from "react-router-dom";
import React from "react";
import {ChevronLeft} from "react-bootstrap-icons";

export const BackToGalaxyViewButton = () => (
    <Link to="/" className="btn btn-secondary"><ChevronLeft/> Back to Galaxy View</Link>
);
