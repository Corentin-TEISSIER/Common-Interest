import React from 'react';
import AppMenu from '../components/AppMenu';
import PlusButton from '../components/PlusButton';
import ActivityTile from '../components/ActivityTile';
import '../style/MyActivitiesPage.css'

import { NavLink } from 'react-router-dom';
import InformativeMessage from '../components/InformativeMessage';

class MyActivitiesPage extends React.Component {

  state = {
    activities: [],
    informativeMessage: "",
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
      .then(data => connectedUser = data)
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

    

    listToFilter = this.filterActivityJoined(listToFilter, connectedUser)
    listToFilter = this.filterMaxAmountReached(listToFilter)
    this.orderByDate(listToFilter)


    this.setState({activities: listToFilter})

  }

  filterActivityJoined(listOfActivities, connectedUser){
    var listFiltered = []
    for(let i=0; i<listOfActivities.length; i++){
      var joined = false
      for(let k=0; k<listOfActivities[i].customersId.length; k++){
        if(listOfActivities[i].customersId[k] === connectedUser.id){
          joined = true
        }
      }
      if(joined === true){
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


    //update message group activity
    var activityName = activitiesDB[this.getIndexById(activitiesDB, activityId)].title
    console.log(activityName)
    var messages = await fetch('http://localhost:4000/messages',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    }).then( res => res.json() )
    var discussion
    var index
    for(let i=0; i<messages.length; i++){
      console.log(messages[i].group.groupName)
      if((messages[i].type === "group") && (messages[i].group.groupName === activityName)){
        console.log("ON RENTRE BIEN LA")
        index = i
        discussion = messages[i]
        console.log(discussion)
      }
    }
    var newUsersList = discussion.users.filter( userId => userId !== connectedUser.id)
    discussion.users = newUsersList
    console.log("MAINTENANT ON EST ICI")
    console.log(discussion)
    await fetch('http://localhost:4000/messages/' + index,{
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(discussion)
    })



    //update state
    var newActivitiesState = {...this.state}.activities
    newActivitiesState = this.state.activities.filter( activity => activity.id !== activityId)
    this.setState({activities: newActivitiesState}) 

    //update informative message
    this.setState({quitConfirmation: false})
    this.setState({informativeMessage: `Activity ${activityName} left`})

    
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
    


    //update state
    var newActivitiesState = this.state.activities.filter( activity => activity.id !== activityId)
    this.setState({activities: newActivitiesState})
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
                <PlusButton to={`/MyActivitiesPage/CreateActivityPage?from=${fromPathPattern}`} from="/MyActivitiesPage/"/>
                <div id="my-activities-page-menu">
                  <div id="joined-activities-label-background">
                    <div id="joined-activities-label">
                      Joined
                    </div>
                  </div>
                  <NavLink to='/MyActivitiesPage/OwnedActivitiesPage' style={{textDecoration: "none"}} >
                    <div id="owned-activities-label-background">
                      <div id="owned-activities-label">
                        Owned
                      </div>
                    </div>
                  </NavLink>
                  <NavLink to='/MyActivitiesPage/ModerateActivitiesPage' style={{textDecoration: "none"}} >
                    <div id="moderate-activities-label-background">
                      <div id="moderate-activities-label">
                        Moderate
                      </div>
                    </div>
                  </NavLink>

                </div>
                <div id="my-activities-page-background">
                  <div id="my-activities-page-scroll-area">
                    {this.state.activities.length === 0 ?
                    <div id="joined-activities-message-no-activities">Go to activity page to join activities<br/>(origami bird button)</div>
                    :
                    this.state.activities.map( activity => (
                      <div id="my-activities-page-activity-tile-container">
                        <ActivityTile activity={ activity } 
                                      joinActivity={ (activityId) => this.joinActivity(activityId) }
                                      dismissActivity={ (activityId) => this.setState({quitConfirmation: true, activityIdTampon: activityId}) }
                                      deleteActivity={ (activityId) => this.deleteActivity(activityId) }
                        /> 
                      </div>  
                    ))}
                  </div>
                </div>

                {this.state.quitConfirmation === true ?
                    <div id="quit-discussion-message-info-bis">
                        <div id="quit-discussion-message">
                            You are about to leave this activity. Are you sure of your choice? 
                        </div>
                        <div id="quit-discussion-button-div">
                            <div className="quit-discussion-cancel-button-bis" onClick={() => {this.cancel()} }>
                                Cancel
                            </div>
                              <div className="quit-discussion-cancel-button-bis" onClick={ () => { this.dismissActivity(this.state.activityIdTampon) }}>
                                  Dismiss
                              </div>
                        </div>
                    </div>
                    :
                    null
                }

                <InformativeMessage message={this.state.informativeMessage} />
                <InformativeMessage message={new URLSearchParams(window.location.search).get("informativeMessage")} />

                <div>
                  <AppMenu icon="my-activities"/>
                </div>
              </div>
              
              
                
              
  }

  

}

export default MyActivitiesPage; 