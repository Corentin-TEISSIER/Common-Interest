import React from "react";
import '../style/DeleteActivityButton.css'

class DeleteActivityButton extends React.Component {
 
    async deleteActivityFunction(activityId){
        this.props.deleteActivity(activityId)
    }

    

    render(){
        return  <div>  
                    <div className="activity-tile-option-button" onClick={ () => { this.deleteActivityFunction(this.props.activityId) }}>
                        Delete Activity
                    </div>
                </div>
    }
}

export default DeleteActivityButton;


