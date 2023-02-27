import React from "react";
import { NavLink } from "react-router-dom";
import '../style/InviteFriendsActivityButton.css'

class InviteFriendsActivityButton extends React.Component { 

    render(){
        return  <NavLink to={`/MyActivitiesPage/InviteFriendsActivityPage?from=${window.location.pathname.split('/').join('-')}&id=${this.props.activityId}`}>
                    <div className="activity-tile-option-button">
                        Invite Friends 
                    </div>
                </NavLink>
    }
}

export default InviteFriendsActivityButton;


