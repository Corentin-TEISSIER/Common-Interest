import React from 'react';
import '../style/BecomeModeratorActivityPage.css'
import AppMenu from '../components/AppMenu';
import BackButton from '../components/BackButton';
import ApplyActivityModerationButton from '../components/ApplyActivityModerationButton';

class BecomeModeratorActivityPage extends React.Component {

    state= {
      activityId: -1
    }

    componentDidMount(){
      let params = new URLSearchParams(window.location.search)
      this.setState({activityId: params.get("id")})
    }

  render() {  

      return    <div>
                  <BackButton to="/MyActivitiesPage" />
                  <div id="become-moderator-page-background">
                    <div id="become-moderator-page-scroll-area">
                      <div id="become-moderator-page-message-label"> 
                      THE ROLE OF MODERATOR
                      </div>
                      <hr/>
                      <div id="become-moderator-page-message-to-applicant">
                        <p>The role of the <span className="moderator-word">moderator</span> is to ensure that the proposed activities run smoothly. Whether during the preparation phase or during the actual course of the activity in question.</p> 
                        *
                        <p>The <span className="moderator-word">moderator</span> must maintain a neutral point of view towards all other users in order to be able to propose fair solutions to the problems encountered.</p> 
                        *
                        <p>The <span className="moderator-word">moderator</span> will have the ability to remove people from the activities he is moderating if he deems it necessary.</p>
                      </div>
                      <hr/>
                      <div id="moderator-confirmation-message-label">
                        Click the button bellow to confirm you want to become moderator for this activity 
                      </div>
                      <div id="apply-moderator-role-button">
                        <ApplyActivityModerationButton activityId={this.state.activityId}/>
                      </div>
                      
                    </div>
                  </div>
                  <div>
                      <AppMenu icon='my-activities'/>
                  </div>
                </div>
  }
}

export default BecomeModeratorActivityPage;