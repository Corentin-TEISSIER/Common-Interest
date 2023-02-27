import React from "react";
import AppMenu from "../components/AppMenu";
import PlusButton from "../components/PlusButton";
import { NavLink } from "react-router-dom";
import '../style/ModerateActivitiesPage.css'
import ModerationPendingRequestAcceptance from "../components/ModerationPendingRequestAcceptance";
import ModerationActivityList from "../components/ModerationActivityList";


class ModerateActivitiesPage extends React.Component {

    state = {
        ownedActivities: [],
        moderateActivities: []
    }

    async getActivities(){

        var connectedUser = await fetch('http://localhost:4000/connectedUser',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => connectedUser = data)
            .catch(error => {
            this.setState({ error, loading: false });
            })



        var connectedUser = await fetch('http://localhost:4000/connectedUser',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        })
        connectedUser = await connectedUser.json()

        var activities = await fetch('http://localhost:4000/activities',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        activities = await activities.json()
        activities = activities.activities

        var activityStateToReturn = {
            owned: [],
            moderate: []
        }

        activityStateToReturn.owned = activities.filter( activity => activity.dealerId === connectedUser.id)
        activityStateToReturn.owned.sort(this.compareDate)

        activityStateToReturn.moderate = activityStateToReturn.owned.concat(
            activities.filter( 
                activity => activity.moderatorId.find( 
                    id => id === connectedUser.id) !== undefined ))
        activityStateToReturn.moderate.sort(this.compareDate)

        this.setState({
            ownedActivities: activityStateToReturn.owned,
            moderateActivities: activityStateToReturn.moderate
        })

    }

    orderByDate(listOfActivities){
        listOfActivities.sort(this.compareDate)
      }
    
      compareDate(firstActivity, secondActivity){
    
        var firstDateTab = firstActivity.date.split('/')
        var secondDateTab = secondActivity.date.split('/')
    
        if(firstDateTab[2] < secondDateTab[2]){
          return -1
        }
        if(firstDateTab[2] > secondDateTab[2]){
          return 1
        }
        if(firstDateTab[2] === secondDateTab[2]){
          if(firstDateTab[1] < secondDateTab[1]){
            return -1
          }
          if(firstDateTab[1] > secondDateTab[1]){
            return 1
          }
          if(firstDateTab[1] === secondDateTab[1]){
            if(firstDateTab[0] < secondDateTab[0]){
              return -1
            }
            if(firstDateTab[0] > secondDateTab[0]){
              return 1
            } 
            if(firstDateTab[0] === secondDateTab[0]){
              return 0
            }
          }
        }
    
      }

    
      componentDidMount(){
        try{
            this.getActivities()
        }
        catch(error){
            console.log(error)
        }
      }


      async accepteUserModerationRequest(userId, activityId){
        //get activity + modify
        var activities = await fetch('http://localhost:4000/activities/',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        activities = await activities.json()
        activities = activities.activities

        var activity = {}
        for(let i=0; i<activities.length; i++){
            if(activities[i].id === activityId){
                activity = activities[i]
            }
        }
        
        activity.moderatorId.push(userId)
        activity.moderatorRequestId = activity.moderatorRequestId.filter( id => id !== userId)

        for(let i=0; i<activities.length; i++){
            if(activities[i].id === activityId){
                activities[i] = activity
            }
        }

        //Update DB
        await fetch('http://localhost:4000/activities/',{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({activities: activities})
        })

        //Update state
        var newOwnedActivityList = this.state.ownedActivities
        for(let i=0; i<newOwnedActivityList.length; i++){
            if(newOwnedActivityList[i].id === activityId){
                newOwnedActivityList[i] = activity
            }
        }

        this.setState({...this.state, ownedActivities: newOwnedActivityList})

        var newModerateActivityList = this.state.moderateActivities
        for(let i=0; i<newModerateActivityList.length; i++){
            if(newModerateActivityList[i].id === activityId){
                newModerateActivityList[i] = activity
            }
        }

        this.setState({...this.state, moderateActivities: newModerateActivityList})
    }

    async deleteUserModerationRequest(userId, activityId){
        //get activity + modify
        var activities = await fetch('http://localhost:4000/activities/',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        activities = await activities.json()
        activities = activities.activities

        var activity = {}
        for(let i=0; i<activities.length; i++){
            if(activities[i].id === activityId){
                activity = activities[i]
            }
        }
        
        activity.moderatorRequestId = activity.moderatorRequestId.filter( id => id !== userId)

        for(let i=0; i<activities.length; i++){
            if(activities[i].id === activityId){
                activities[i] = activity
            }
        }

        //Update DB
        await fetch('http://localhost:4000/activities/',{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({activities: activities})
        })

        //Update state
        var newOwnedActivityList = this.state.ownedActivities
        for(let i=0; i<newOwnedActivityList.length; i++){
            if(newOwnedActivityList[i].id === activityId){
                newOwnedActivityList[i] = activity
            }
        }

        this.setState({...this.state, ownedActivities: newOwnedActivityList})

        var newModerateActivityList = this.state.moderateActivities
        for(let i=0; i<newModerateActivityList.length; i++){
            if(newModerateActivityList[i].id === activityId){
                newModerateActivityList[i] = activity
            }
        }

        this.setState({...this.state, moderateActivities: newModerateActivityList})
    


    }

      
    async excludeUserFromActivity(userId, activityId){
        //update DB user
        var user = await fetch('http://localhost:4000/users/' + userId,{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        user = await user.json()

        user.activities = user.activities.filter(id => id !== activityId)

        await fetch('http://localhost:4000/users/' + userId,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        })

        var connectedUser = await fetch('http://localhost:4000/connectedUser',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        connectedUser = await connectedUser.json()

        if(connectedUser.id === user.id){
            await fetch('http://localhost:4000/connectedUser',{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            })
        }

        //update DB activity
        var activities = await fetch('http://localhost:4000/activities/',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        activities = await activities.json()
        activities = activities.activities

        for(let i=0; i<activities.length; i++){
            if(activities[i].id === activityId ){
                activities[i].customersId = activities[i].customersId.filter(id => id !== userId)
                activities[i].moderatorId = activities[i].moderatorId.filter(id => id !== userId)
                activities[i].moderatorRequestId = activities[i].moderatorRequestId.filter(id => id !== userId)
            }
        }
        
        await fetch('http://localhost:4000/activities/',{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({activities: activities})
        })

        //update state
        var newOwnedActivityList = this.state.ownedActivities
        for(let i=0; i<newOwnedActivityList.length; i++){
            if(newOwnedActivityList[i].id === activityId){
                newOwnedActivityList[i].customersId = newOwnedActivityList[i].customersId.filter(id => id !== userId)
                newOwnedActivityList[i].moderatorId = newOwnedActivityList[i].moderatorId.filter(id => id !== userId)
                newOwnedActivityList[i].moderatorRequestId = newOwnedActivityList[i].moderatorRequestId.filter(id => id !== userId)
            }
        }

        this.setState({...this.state, ownedActivities: newOwnedActivityList})

        var newModerateActivityList = this.state.moderateActivities
        for(let i=0; i<newModerateActivityList.length; i++){
            if(newModerateActivityList[i].id === activityId){
                newModerateActivityList[i].customersId = newModerateActivityList[i].customersId.filter(id => id !== userId)
                newModerateActivityList[i].moderatorId = newModerateActivityList[i].moderatorId.filter(id => id !== userId)
                newModerateActivityList[i].moderatorRequestId = newModerateActivityList[i].moderatorRequestId.filter(id => id !== userId)
            }
        }

        this.setState({...this.state, moderateActivities: newModerateActivityList})
    
    }


    render(){

        let fromPathPattern = window.location.pathname.split('/').join('-')

        return <div>
            <PlusButton to={`/MyActivitiesPage/CreateActivityPage?from=${fromPathPattern}`} from="/MyActivitiesPage/ModerateActivitiesPage/"/>
                    <div id="moderate-activities-page-menu">
                      <NavLink to='/MyActivitiesPage' style={{textDecoration: "none"}} >
                        <div id="joined-activities-label-background-ter">
                            <div id="joined-activities-label-ter">
                            Joined
                            </div>
                        </div>
                      </NavLink>
                      <NavLink to='/MyActivitiesPage/OwnedActivitiesPage' style={{textDecoration: "none"}} >
                        <div id="owned-activities-label-background-ter">
                            <div id="owned-activities-label-ter">
                                Owned
                            </div>
                        </div>
                      </NavLink>
                      <div id="moderate-activities-label-background-ter">
                          <div id="moderate-activities-label-ter">
                              Moderate
                          </div>
                      </div>
                      

                    </div>
                    <div id="moderate-activities-page-background">
                      <div id="moderate-activities-page-scroll-area">
                        <ModerationPendingRequestAcceptance 
                            activities={this.state.ownedActivities} 
                            accepteUserModerationRequest={(userId, activityId) => { this.accepteUserModerationRequest(userId, activityId) }}
                            deleteUserModerationRequest={(userId, activityId) => { this.deleteUserModerationRequest(userId, activityId) }}
                        />
                        <hr/>
                        <ModerationActivityList 
                            activities={this.state.moderateActivities}
                            excludeUserFromActivity={ (userId, activityId) => { this.excludeUserFromActivity(userId, activityId) } }
                        />
                        <div id="blank-to-avoid-plus-button" />
                      </div>
                    </div>
                    <div>
                      <AppMenu icon="my-activities"/>
                    </div>
                  </div>
    }
}

export default ModerateActivitiesPage