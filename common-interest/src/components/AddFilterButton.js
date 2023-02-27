import React from "react";
import { NavLink } from "react-router-dom";
import '../style/AddFilterButton.css'

import plusButtonWhite from '../../src/public/icon/plus_icon_white.png' 

function AddFilterButton(props) {
    return <NavLink to={props.to} style={{textDecoration: "none"}}>
            <div id="add-filter-button">
                <div id='add-filter-button-border'>
                    <div id="add-filter-button-text">
                        ADD FILTER
                    </div>
                    <div id="add-filter-button-icon-background">
                        <img src={ plusButtonWhite } alt="plus" /> 
                    </div>
                </div>
            </div>
        </NavLink>
}

export default AddFilterButton;