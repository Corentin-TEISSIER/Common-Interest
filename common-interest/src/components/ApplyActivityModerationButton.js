import React from "react";
import { NavLink } from "react-router-dom";
import '../style/ApplyActivityModerationButton.css'

async function applyModeration(activityId){
        const connectedUser = await fetch('http://localhost:4000/connectedUser',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        .then( res => res.json())
        .catch(error => {
            this.setState({ error, loading: false });
        })

        // Update activity pending modo request
        const activities = await fetch('http://localhost:4000/activities', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        }).then( res => res.json() ).then( data => data.activities)

        for(let i=0; i<activities.length; i++){
            console.log(activities[i].id)
            if(activities[i].id === +activityId){
                console.log("HEHEHEH")
                activities[i].moderatorRequestId.push(connectedUser.id)
            }
        }

        await fetch('http://localhost:4000/activities',{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({activities: activities})
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

function ApplyActivityModerationButton(props) {
    return <NavLink to='/MyActivitiesPage?informativeMessage=Request%20to%20become%20moderator%20sent' style={{textDecoration: "none"}} onClick={ () => { applyModeration(props.activityId) }}>
            <div id="apply-activity-moderation-button" >
                APPLY
            </div>
        </NavLink>
}

export default ApplyActivityModerationButton;


