import React from 'react';
import { NavLink } from 'react-router-dom';


import '../style/ActivitiesPage.css'

import ActivityTile from '../components/ActivityTile';
import InformativeMessage from "../components/InformativeMessage.js"
import AppMenu from '../components/AppMenu'

class ActivitiesPage extends React.Component {

  state = {
    activities: [],
    informativeMessage: ""
  }

  componentDidMount(){
    try{
      this.getActivities()
    }catch(error){
      console.log(error)
    }
  }

  async getActivities(){

    var listToFilter = await fetch('http://localhost:4000/activities',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    })
      .then(response => response.json())
      .then(data => listToFilter = data.activities)
      .catch(error => {
        this.setState({ error, loading: false });
      })

    var connectedUser = await fetch('http://localhost:4000/connectedUser',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    })
      .then(response => response.json())
      .then(data => connectedUser = data)
      .catch(error => {
        this.setState({ error, loading: false });
      })

    listToFilter = this.filterAlreadyJoined(listToFilter, connectedUser)
    listToFilter = this.filterOwnActivities(listToFilter, connectedUser)
    listToFilter = this.filterNoInterest(listToFilter, connectedUser)
    listToFilter = this.filterMaxAmountReached(listToFilter)
    this.orderByDate(listToFilter)


    this.setState({activities: listToFilter})

  }

  filterAlreadyJoined(listOfActivities, connectedUser){
    var listFiltered = []
    for(let i=0; i<listOfActivities.length; i++){
      var joined = false
      for(let k=0; k<listOfActivities[i].customersId.length; k++){
        if(listOfActivities[i].customersId[k] === connectedUser.id){
          joined = true
        }
      }
      if(joined === false){
        listFiltered.push(listOfActivities[i])
      }
    }
    return listFiltered
  }

  filterOwnActivities(listOfActivities, connectedUser){
    var listFiltered = []
    for(let i=0; i<listOfActivities.length; i++){
      if(listOfActivities[i].dealerId !== connectedUser.id){
        listFiltered.push(listOfActivities[i])
      }
    }
    return(listFiltered)
  }

  filterNoInterest(listOfActivities, connectedUser){
    var listFiltered = []
    for(let i=0; i<listOfActivities.length; i++){
        var interested = false
        for(let k=0; k<connectedUser.interests.length; k++){
          if(listOfActivities[i].speciality === connectedUser.interests[k].speciality){
            interested = true
          }
        }
        if(interested === true){
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


    //Update db connecteduser invitation + activities
    var newConnectedUser = {...connectedUser}
    newConnectedUser.invitedActivities = connectedUser.invitedActivities.filter( invActId => invActId !== activityId )
    newConnectedUser.activities.push(activityId)

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

    //update message group activity
    var activityName = activitiesDB[this.getIndexById(activitiesDB, activityId)].title
    var messages = await fetch('http://localhost:4000/messages',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    }).then( res => res.json() )
    var discussion
    var index
    for(let i=0; i<messages.length; i++){
      if((messages[i].type === "group") && (messages[i].group.groupName === activityName)){
        index = i
        discussion = messages[i]
      }
    }
    discussion.users.push(connectedUser.id)
    await fetch('http://localhost:4000/messages/' + index,{
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(discussion)
    })


    //update state
    var newActivitiesState = {...this.state}.activities.filter( activity => activity.id !== activityId)
    this.setState({activities: newActivitiesState})

    //informative message
    this.setState({informativeMessage: `activity ${activityName} joined`})

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
    
    return    <div>
                <div id="activities-page-menu">
                  <div id="all-activities-label-background">
                    <div id="all-activities-label">
                      All
                    </div>
                  </div>
                  <NavLink to='/ActivitiesPage/InvitedActivitiesPage' style={{textDecoration: "none"}} >
                    <div id="proposed-activities-label-background">
                      <div id="proposed-activities-label">
                        Invited
                      </div>
                    </div>
                  </NavLink> 
                </div>
                <div id="activities-page-background">
                  <div id="activities-page-scroll-area">
                    {this.state.activities.length === 0 ?
                    <div id="activities-message-no-activities">
                      No activities to join for the moment
                    </div>
                    :
                    this.state.activities.map( activity => (
                      <div id="activities-page-activity-tile-container">
                        <ActivityTile activity={ activity } 
                                      joinActivity={ (activityId) => this.joinActivity(activityId) }
                                      dismissActivity={ (activityId) => this.dismissActivity(activityId) }
                                      deleteActivity={ (activityId) => this.deleteActivity(activityId) }
                        />
                      </div>  
                    ))}
                  </div>
                </div>

                <InformativeMessage message={this.state.informativeMessage} />
                <InformativeMessage message={new URLSearchParams(window.location.search).get("informativeMessage")}/>

                <div>
                  <AppMenu icon="activities"/>
                </div>
              </div>
              
              
                
              
  }

}

export default ActivitiesPage;