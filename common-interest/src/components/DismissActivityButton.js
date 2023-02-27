import React from "react";
import '../style/DismissActivityButton.css'

class DismissActivityButton extends React.Component {

    dismissActivityFunction(activityId){
        this.props.dismissActivity(activityId)
    }

    render(){
        return  <div className="activity-tile-option-button" onClick={ () => { this.dismissActivityFunction(this.props.activityId) }}>
                    Dismiss Activity
                </div>
    }
}

export default DismissActivityButton;


