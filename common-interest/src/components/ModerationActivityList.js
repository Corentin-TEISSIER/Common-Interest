import React from "react";
import ModerationExcludeUserTile from "./ModerationExcludeUserTile";
import '../style/ModerationActivityList.css'



class ModerationActivityList extends React.Component {

    state = {
        show: new Array(this.props.activities),
        connectedUserId: -1
    }
 
    toggleList(i){
        var tab = new Array(this.props.activities)
        if(this.state.show[i] === true){
            for(let k=0; k<tab.length; k++){
                tab[k] = false
            }
            this.setState({...this.state, show: tab})
        }
        else{
            for(let k=0; k<tab.length; k++){
                tab[k] = false
            }
            tab[i] = true
            this.setState({...this.state, show: tab})
        }
    }

    async getConnectedUserID(){
        await fetch('http://localhost:4000/connectedUser',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        }).then( res => res.json()).then( data => this.setState({...this.state, connectedUserId: data.id}))
    }

    componentDidMount(){
        var tab = new Array(this.props.activities)
        for(let i=0; i<tab.length; i++){
            tab[i] = false
        }
        this.setState({...this.state, show: tab})

        this.getConnectedUserID()

    }


    render(){

        console.log(this.state.connectedUserId)

        return <div id="moderation-activity-list-container">
                    <div id="moderation-activity-list-title" >
                        ACTIVITIES:
                    </div>
                    <div id="moderation-activity-list-description" >
                        (Click on an activity to exclude people)
                    </div>
                    {this.props.activities.length === 0 ? 
                    <div id="moderation-activity-list-nothing-pendant-message">
                        No activity to moderate for the moment ... 
                    </div>
                    :
                    null}
                    
                    {this.props.activities.map(activity => ( 
                        activity.customersId.length === 0 ? 
                        <div className="participant-list-activity">
                            <div id="participant-list-activity-title">
                                {activity.title} 
                                
                            </div>
                            <img src={activity.picture} alt="activity"/>
                            <div id="participant-list-activity-no-participant-message">
                                (No participant on this activity)
                            </div>
                        </div>
                        :
                        <div className="participant-list-activity">
                            <div id="participant-list-activity-title">
                                {activity.title}
                            </div>
                            <img src={activity.picture} alt="activity" onClick={ () => {this.toggleList(this.props.activities.indexOf(activity))} }/>
                            {activity.customersId.length === 1 && activity.customersId[0] === this.state.connectedUserId ? 
                                <div id="participant-list-activity-no-moderation-possiblitities-message">
                                    Only lefting moderators and activity owner
                                </div> 
                                : 
                                null
                            }
                            {this.state.show[this.props.activities.indexOf(activity)] && activity.customersId.map( id => (
                                this.state.connectedUserId === id || this.state.connectedUserId === -1 ? 
                                null
                                :
                                <div key={id} className="moderation-user-tile">
                                    <ModerationExcludeUserTile 
                                        id={id}
                                        activityId={activity.id} 
                                        excludeUserFromActivity={this.props.excludeUserFromActivity}
                                    />
                                </div>
                                

                            )) }
                            
                        </div>
                        ))}

                    


            </div>
    }


}

export default ModerationActivityList