import React from "react";
import '../style/ModerationPendingRequestAcceptance.css'
import ModerationAcceptanceTile from "./ModerationAcceptanceTile";


class ModerationPendingRequestAcceptance extends React.Component {

    state = {
        show: new Array(this.props.activities)
    }
 
    toggleList(i){
        var tab = new Array(this.props.activities)
        if(this.state.show[i] === true){
            for(let k=0; k<tab.length; k++){
                tab[k] = false
            }
            this.setState({show: tab})
        }
        else{
            for(let k=0; k<tab.length; k++){
                tab[k] = false
            }
            tab[i] = true
            this.setState({show: tab})
        }
    }

    componentDidMount(){
        var tab = new Array(this.props.activities)
        for(let i=0; i<tab.length; i++){
            tab[i] = false
        }
        this.setState({show: tab})
    }

    render(){ 
 
        return <div id="moderation-pending-request-acceptance-container">
                    <div id="moderation-pending-request-acceptance-title" >
                        Moderation Pending Request:
                    </div>
                    <div id="moderation-pending-request-acceptance-description" >
                        (Those people asked to become moderator on your activities - click on an activity to see)
                    </div>
                    {this.props.activities.length === 0 ? 
                    <div id="moderation-pending-request-acceptance-nothing-pendant-message">
                        No pending request for the moment ... 
                    </div>
                    :
                    null}
                     
                    {this.props.activities.map(activity => ( 
                        activity.moderatorRequestId.length === 0 ? 
                        <div className="pending-request-activity">
                            <div id="pending-request-activity-title">
                                {activity.title}
                            </div>
                            <img src={activity.picture} alt="activity"/>
                            <div id="pending-request-activity-no-request-message">
                                {"(No request on this activity)"}
                            </div>
                        </div>
                        :
                        <div className="pending-request-activity">
                            <div id="pending-request-activity-title">
                                {activity.title}
                            </div>
                            <img src={activity.picture} alt="activity" onClick={ () => {this.toggleList(this.props.activities.indexOf(activity))} }/>
                            {activity.moderatorRequestId.length !== 0 && this.state.show[this.props.activities.indexOf(activity)] && activity.moderatorRequestId.map( id => (
                                <div key={id} className="moderation-acceptance-tile">
                                    <ModerationAcceptanceTile id={id} 
                                                              activityId={activity.id} 
                                                              activityList={this.props.activities} 
                                                              setActivityList={ this.props.setActivityList }
                                                              accepteUserModerationRequest={ this.props.accepteUserModerationRequest }
                                                              deleteUserModerationRequest={ this.props.deleteUserModerationRequest }/>
                                </div>

                            ))} 
                            <div id="pending-request-activity-request-message">
                                {"("}{activity.moderatorRequestId.length}{" requests on this activity)"}
                            </div>
                            
                            

                            

                        

                        </div>
                    ))}

                    


               </div>
    }
}

export default ModerationPendingRequestAcceptance