import React from "react";
import { NavLink } from "react-router-dom";
import '../style/DisconnectButton.css'


function DisconnectButton(props) {
    return <NavLink to="/ProfilePage/DisconnectionPage" style={{textDecoration: "none"}}>
            <div id="disconnect-button">
                Disconnect
            </div>
        </NavLink>
}

export default DisconnectButton;


