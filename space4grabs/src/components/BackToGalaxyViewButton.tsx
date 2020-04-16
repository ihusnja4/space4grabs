import {Link} from "react-router-dom";
import React from "react";
// TODO remove ignore once this is resolved @link <https://github.com/ismamz/react-bootstrap-icons/issues/1>
// @ts-ignore
import * as Icons from "react-bootstrap-icons";

export const BackToGalaxyViewButton = () => (
    <Link to="/" className="btn btn-secondary"><Icons.ChevronLeft/> Back to Galaxy View</Link>
);
