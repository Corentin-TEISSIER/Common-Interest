import React from "react";
import '../style/JoinActivityButton.css'

class JoinActivityButton extends React.Component { 

    async joinActivityFunction(activityId){
        this.props.joinActivity(activityId)
    }

    render(){
        return  <div className="activity-tile-option-button" onClick={ () => { this.joinActivityFunction(this.props.activityId) }}>
                    Join Activity
                </div>
    }
}

export default JoinActivityButton;


