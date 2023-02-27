import React from "react";
import { NavLink } from "react-router-dom";
import '../style/ModifyButton.css'


function ModifyButton(props) {
    return <NavLink to={props.to} style={{textDecoration: "none"}}>
            <div id="modify-button">
                Modify
            </div>
        </NavLink>
}

export default ModifyButton;