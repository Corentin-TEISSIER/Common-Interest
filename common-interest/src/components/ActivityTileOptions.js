import React from "react";
import '../style/ActivityTileOptions.css'

import JoinActivityButton from './JoinActivityButton.js'
import InviteFriendsActivityButton from './InviteFriendsActivityButton.js'
import DismissActivityButton from './DismissActivityButton.js'
import BecomeModeratorButton from "./BecomeModeratorButton.js"
import DeleteActivityButton from './DeleteActivityButton.js'

function LabelModerationPending(props){

    return <div id="label-moderation-pending">
        Moderation Request Pending 
    </div>
}

function LabelModeration(props){

    return <div id="label-moderation">
        You moderate this activity 
    </div>
}

class ActivityTileOptions extends React.Component {
    

    state = {
        owner: false,
        joined: false,
        moderator: false,
        moderatorRequestPending: false,
    }

    componentDidMount(){
        try{
            this.setComponentState()
        }catch(error){
            console.log(error)
        }
    }

    async setComponentState(){

        var connectedUser = await fetch('http://localhost:4000/connectedUser',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => connectedUser = data)
        .catch(error => {
            this.setState({ error, loading: false });
        })

        //set state owner
        if(this.props.activity.dealerId === connectedUser.id){
            this.setState({owner: true})
        }

        //set state joined
        for(let i=0; i<this.props.activity.customersId.length; i++){
            if(this.props.activity.customersId[i] === connectedUser.id){
                this.setState({joined: true})
            }
        }

        //set state moderator
        for(let i=0; i<this.props.activity.moderatorId.length; i++){
            if(this.props.activity.moderatorId[i] === connectedUser.id){
                this.setState({moderator: true})
            }
        }

        //set state moderatorRequestPending
        for(let i=0; i<this.props.activity.moderatorRequestId.length; i++){
            if(this.props.activity.moderatorRequestId[i] === connectedUser.id){
                this.setState({moderatorRequestPending: true})
            }
        }

    }

    render(){
    
        return <div id="activity-tile-option-background">
            {(this.state.owner === false && this.state.joined === false && this.state.moderator === false) ? <JoinActivityButton activityId={this.props.activity.id} joinActivity={this.props.joinActivity} /> : null}
            {(this.state.joined === true || this.state.owner === true) ? <InviteFriendsActivityButton activityId={this.props.activity.id} /> : null}
            {(this.state.joined === true && this.state.owner === false) ? <DismissActivityButton activityId={this.props.activity.id} dismissActivity={this.props.dismissActivity} /> : null}
            {(this.state.joined === true && this.state.moderator === false && this.state.owner === false && this.state.moderatorRequestPending === false) ? <BecomeModeratorButton activityId={this.props.activity.id} /> : null}
            {(this.state.moderatorRequestPending === true) ? <LabelModerationPending /> : null}
            {(this.state.owner === true) ? <DeleteActivityButton activityId={this.props.activity.id} deleteActivity={this.props.deleteActivity} /> : null}
            {(this.state.moderator === true) ? <LabelModeration /> : null }
        </div>
    }
        
}

export default ActivityTileOptions;


