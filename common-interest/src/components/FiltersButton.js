import React from "react";
import { NavLink } from "react-router-dom";
import '../style/FiltersButton.css'
import AppContext from "../components/AppContext";


function FiltersButton(props) {
    return <NavLink to={props.to} style={{textDecoration: "none"}}>
            <div id="filters-button">
                Filters
            </div>
        </NavLink>
}

export default FiltersButton;