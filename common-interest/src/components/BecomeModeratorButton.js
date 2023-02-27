import React from "react";
import { NavLink } from "react-router-dom";
import '../style/BecomeModeratorButton.css'

class BecomeModeratorButton extends React.Component { 
    
    async becomeModeratorFunction(){
        const connectedUser = await fetch('http://localhost:4000/connectedUser',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        .then( res => res.json())
        .catch(error => {
            this.setState({ error, loading: false });
        })

        // Update DB connected User and Users
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

    render(){
        return  <NavLink to={`/MyActivitiesPage/BecomeModerator?id=${this.props.activityId}`} onClick={() => { this.becomeModeratorFunction() }}>
                    <div className="activity-tile-option-button" >
                        Become Moderator
                    </div>
                </NavLink>
                
    }
}

export default BecomeModeratorButton;


