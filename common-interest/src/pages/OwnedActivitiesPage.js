import React from "react";
import AppMenu from "../components/AppMenu";
import PlusButton from "../components/PlusButton";
import { NavLink } from "react-router-dom";
import ActivityTile from "../components/ActivityTile";
import InformativeMessage from "../components/InformativeMessage";
import '../style/OwnedActivitiesPage.css'

class OwnedActivitiesPage extends React.Component { 

   
      state = {
        activities: [],
        quitConfirmation: false,
        activityIdTampon: -1
      } 
    
      componentDidMount(){
        try{
          this.getActivities()
          this.getActivities()
        }catch(error){
          console.log(error)
        }
      }
    
      async getActivities(){

        var connectedUser = await fetch('http://localhost:4000/connectedUser',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        })
          .then(response => response.json())
          .catch(error => {
            this.setState({ error, loading: false });
          })



    
        var listToFilter = await fetch('http://localhost:4000/activities',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        })
          .then(response => response.json())
          .then(data => listToFilter = data.activities)
          .catch(error => {
            this.setState({ error, loading: false });
          })
    
        connectedUser = await fetch('http://localhost:4000/connectedUser',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        })
          .then(response => response.json())
          .then(data => connectedUser = data)
          .catch(error => {
            this.setState({ error, loading: false });
          })
    

        listToFilter = this.filterActivityOwned(listToFilter, connectedUser)
        listToFilter = this.filterMaxAmountReached(listToFilter)
        this.orderByDate(listToFilter)
    
    
        this.setState({activities: listToFilter})
    
      }
    
      filterActivityOwned(listOfActivities, connectedUser){
        var listFiltered = []
        for(let i=0; i<listOfActivities.length; i++){
          if(listOfActivities[i].dealerId === connectedUser.id){
            listFiltered.push(listOfActivities[i])
          }
        }
        return listFiltered
      }

      filterMaxAmountReached(listOfActivities){
        var listFiltered = []
        for(let i=0; i<listOfActivities.length; i++){
          if(listOfActivities[i].customersId.length + 1 < listOfActivities[i].numberMaxCustomer){
            listFiltered.push(listOfActivities[i])
          }
        }
        return listFiltered
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


      cancel(){
        this.setState({quitConfirmation: false, activityIdTampon: -1})
      }


      async joinActivity(activityId){
        //Update db activities
        var connectedUser = await fetch('http://localhost:4000/connectedUser',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        })
          .then(response => response.json())
          .then(data => connectedUser = data)
          .catch(error => {
            this.setState({ error, loading: false });
          })
    
        var activitiesDB = await fetch('http://localhost:4000/activities',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        })
          .then(response => response.json())
          .then(data => activitiesDB = data.activities)
          .catch(error => {
            this.setState({ error, loading: false });
          })
    
        activitiesDB[this.getIndexById(activitiesDB, activityId)].customersId.push(connectedUser.id)
    
        await fetch('http://localhost:4000/activities',{
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({activities: activitiesDB})
        })
        .catch(error => {
          console.log(error.message)
          this.setState({ error, loading: false });
        })
    
    
        //Update db connecteduser invitation
        var newConnectedUser = {...connectedUser}
        newConnectedUser.invitedActivities = connectedUser.invitedActivities.filter( invActId => invActId !== activityId )
    
        await fetch('http://localhost:4000/connectedUser',{
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(newConnectedUser)
        })
        .catch(error => {
          console.log(error.message)
          this.setState({ error, loading: false });
        })
    
    
        //Update db users invitation
        await fetch('http://localhost:4000/users/' + newConnectedUser.id,{
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(newConnectedUser)
        })
        .catch(error => {
          console.log(error.message)
          this.setState({ error, loading: false });
        })
    
    
        //update state
        var newActivitiesState = {...this.state}.activities.filter( activity => activity.id !== activityId)
        this.setState({activities: newActivitiesState})
      }
    
      async dismissActivity(activityId){

        //Update db activities
        var connectedUser = await fetch('http://localhost:4000/connectedUser',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        })
          .then(response => response.json())
          .then(data => connectedUser = data)
          .catch(error => {
            this.setState({ error, loading: false });
          })
    
        var activitiesDB = await fetch('http://localhost:4000/activities',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        })
          .then(response => response.json())
          .then(data => activitiesDB = data.activities)
          .catch(error => {
            this.setState({ error, loading: false });
          })
    
        var newActivityDB = {...activitiesDB}
        newActivityDB[this.getIndexById(activitiesDB, activityId)].customersId = activitiesDB[this.getIndexById(activitiesDB, activityId)].customersId.filter( customerId => customerId !== connectedUser.id)
        newActivityDB[this.getIndexById(activitiesDB, activityId)].moderatorId = activitiesDB[this.getIndexById(activitiesDB, activityId)].moderatorId.filter( moderatorId => moderatorId !== connectedUser.id)
    
        await fetch('http://localhost:4000/activities',{
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({activities: activitiesDB})
        })
        .catch(error => {
          console.log(error.message)
          this.setState({ error, loading: false });
        })
    
        //update db connectedUser
        var newConnectedUser = {...connectedUser}
        newConnectedUser.activities = connectedUser.activities.filter( actID => actID !== activityId)
        
        await fetch('http://localhost:4000/connectedUser',{
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(newConnectedUser)
        })
        .catch(error => {
          console.log(error.message)
          this.setState({ error, loading: false });
        })
    
        //update db users
        await fetch('http://localhost:4000/users/' + newConnectedUser.id,{
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(newConnectedUser)
        })
        .catch(error => {
          console.log(error.message)
          this.setState({ error, loading: false });
        })
    
        //update state
        var newActivitiesState = {...this.state}.activities
        newActivitiesState = this.state.activities.filter( activity => activity.id !== activityId)
        this.setState({activities: newActivitiesState}) 
    
        
      }
    
      async deleteActivity(activityId){
        //Update db activities
        var activitiesDB = await fetch('http://localhost:4000/activities',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        })
          .then(response => response.json())
          .then(data => activitiesDB = data.activities)
          .catch(error => {
            this.setState({ error, loading: false });
          })

        var activityName
        for(let i=0; i<activitiesDB.length; i++){
          if(activitiesDB[i].id === activityId){
            activityName = activitiesDB[i].title
          }
        }
    
        var newActivitiesDB = activitiesDB.filter( activity => activity.id !== activityId ) 
    
        await fetch('http://localhost:4000/activities',{
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({activities: newActivitiesDB})
        })
        .catch(error => {
          console.log(error.message)
          this.setState({ error, loading: false });
        })
        
        //Update db connectedUser
        var connectedUser = await fetch('http://localhost:4000/connectedUser',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        })
          .then(response => response.json())
          .then(data => connectedUser = data)
          .catch(error => {
            this.setState({ error, loading: false });
          })
        
        var newConnectedUser = {...connectedUser}
        newConnectedUser.activities = connectedUser.activities.filter( invActId => invActId !== activityId )
    
        await fetch('http://localhost:4000/connectedUser',{
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(newConnectedUser)
        })
        .catch(error => {
          console.log(error.message)
          this.setState({ error, loading: false });
        })

        //Update db users
        await fetch('http://localhost:4000/users/' + newConnectedUser.id,{
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(newConnectedUser)
        })
        .catch(error => {
          console.log(error.message)
          this.setState({ error, loading: false });
        })

        //Delete messages group
        var messages = await fetch('http://localhost:4000/messages',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        }).then( res => res.json() )

        var discussion
        var index

        console.log(activityName)

        for(let i=0; i<messages.length; i++){
          if((messages[i].type === "group") && (messages[i].group.groupName === activityName)){
            index = i
            discussion = messages[i]
          }
        }

        discussion.users = []

        await fetch('http://localhost:4000/messages/' + index,{
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(discussion)
        })
        

    
        //update state
        var newActivitiesState = this.state.activities.filter( activity => activity.id !== activityId)
        this.setState({activities: newActivitiesState})

        //update confirmation
        this.setState({quitConfirmation: false, activityIdTampon: -1})

      }
    
      getIndexById(list, id){
        for(let i=0; i<list.length; i++){
          if(list[i].id === id){
            return i
          }
        }
      }
    
    
    
    
      render() { 

        let fromPathPattern = window.location.pathname.split('/').join('-')
        
        return    <div>
                    <PlusButton to={`/MyActivitiesPage/CreateActivityPage?from=${fromPathPattern}`} from="/MyActivitiesPage/OwnedActivitiesPage"/>
                    <div id="owned-activities-page-menu">
                      <NavLink to='/MyActivitiesPage' style={{textDecoration: "none"}} >
                        <div id="joined-activities-label-background-bis">
                            <div id="joined-activities-label-bis">
                            Joined
                            </div>
                        </div>
                      </NavLink>
                    <div id="owned-activities-label-background-bis">
                        <div id="owned-activities-label-bis">
                        Owned
                        </div>
                    </div>
                    <NavLink to='/MyActivitiesPage/ModerateActivitiesPage' style={{textDecoration: "none"}} >
                      <div id="moderate-activities-label-background-bis">
                        <div id="moderate-activities-label-bis">
                          Moderate
                        </div>
                      </div>
                    </NavLink>

                    </div>
                    <div id="owned-activities-page-background">
                      <div id="owned-activities-page-scroll-area">
                        {this.state.activities.length === 0 ? 
                        <div id="owned-activities-message-no-activities">Click the + button to create a new activity</div>
                        :
                        this.state.activities.map( activity => (
                          <div id="owned-activities-page-activity-tile-container">
                            <ActivityTile activity={ activity } 
                                          joinActivity={ (activityId) => this.joinActivity(activityId) }
                                          dismissActivity={ (activityId) => this.dismissActivity(activityId) }
                                          deleteActivity={ (activityId) => this.setState({quitConfirmation: true, activityIdTampon: activityId}) }
                            />
                          </div>  
                        ))}
                      </div>
                    </div>

                    {this.state.quitConfirmation === true ?
                      <div id="quit-discussion-message-info-bis">
                          <div id="quit-discussion-message">
                              You are about to delete this activity. Are you sure of your choice? 
                          </div>
                          <div id="quit-discussion-button-div">
                              <div className="quit-discussion-cancel-button-bis" onClick={() => {this.cancel()} }>
                                  Cancel
                              </div>
                              <div className="quit-discussion-cancel-button-bis" onClick={ () => { this.deleteActivity(this.state.activityIdTampon) }}>
                                  Delete
                              </div>
                          </div>
                      </div>
                      :
                      null
                    }

                    <InformativeMessage message={new URLSearchParams(window.location.search).get("informativeMessage")}/>

                    <div>
                      <AppMenu icon="my-activities"/>
                    </div>
                  </div>
                  
                  
                    
                  
      }
}

export default OwnedActivitiesPage;


