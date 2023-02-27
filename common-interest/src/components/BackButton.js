import React from "react";
import { NavLink } from "react-router-dom";
import '../style/BackButton.css'

import iconBackArrowGrey from "../../src/public/icon/back_arrow_grey.png"

async function unsetTampon(){
    const connectedUser = await fetch('http://localhost:4000/connectedUser',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        .then( res => res.json())
        .catch(error => {
            this.setState({ error, loading: false });
        })

    // Update DB connected User and Users (delete tampon)
    await fetch('http://localhost:4000/connectedUser',{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(connectedUser)
    }).then( res => res.json() )
    

    await fetch('http://localhost:4000/users/' + connectedUser.id,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(connectedUser)
    }).then( res => res.json() )

}

function BackButton(props) {
    return <NavLink to={props.to} style={{textDecoration: "none"}} onClick={ () => {unsetTampon()}} >
            <div id="back-button">
                <img id="back-arrow-icon" src={ iconBackArrowGrey } alt="back icon" width="20px" height="20px"></img>
            </div>
        </NavLink>
}

export default BackButton;


