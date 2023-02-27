import React from "react";
import { NavLink } from "react-router-dom";
import '../style/PlusButton.css'

import iconPlus from '../../src/public/icon/plus_icon_white.png'

function PlusButton(props) {
    return <NavLink to={props.to} style={{textDecoration: "none"}} >
            <div id="plus-button">
                <img id="plus-icon" src={ iconPlus } alt="plus icon"></img>
            </div>
        </NavLink>
}

export default PlusButton;


