import React from 'react';
import '../style/ProfilePage.css'
import ModifyButton from '../components/ModifyButton.js';
import DisconnectButton from '../components/DisconnectButton';
import ProfileUserData from '../components/ProfileUserData.js';
import AppMenu from '../components/AppMenu';
import InformativeMessage from '../components/InformativeMessage';



class ProfilePage extends React.Component {


  state = {
    connectedUser: {
      id: -1,
      name: "",
      username: "",
      password: "",
      profilePicture: "",
      friends: [],
      activities: [],
      interests: [],
      location: "",
      age: -1
    },
    loading: true,
    error: null,
    profilePicture: ''
  }

  async setUserState(value){

    //Update DB
    await fetch('http://localhost:4000/connectedUser',{
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(value)
    })

    await fetch('http://localhost:4000/users/' + value.id,{
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(value)
    })

    //setState
    this.setState({...this.state, connectedUser: value})

  }

  setUserInterestsState = (value) => {

    let user = {...this.state.connectedUser}
    user.interests = value
    this.setUserState(user)
    
  }

  componentDidMount(){
    try{
      this.getConnectedUser()
    }catch(error){
      console.log(error)
    }
  }
    

  async getConnectedUser(){
    await fetch('http://localhost:4000/connectedUser',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ connectedUser: data });
              

      })
      .catch(error => {
        this.setState({ error, loading: false });
      })
  }

    
  render() {
    
    return    <div>
                <div id="profile-page-background">
                    <div id="profile-header-background">
                      <div id="disconnect-button-background">
                          <DisconnectButton />
                      </div>
                      <div id="modify-button-background">
                          <ModifyButton to='/ProfilePage/ModifyProfilePage' /> 
                      </div>
                    </div>
                    <div id='profile-picture-background'>
                        <img src={this.state.connectedUser.profilePicture} alt="Me" width="140px" height="140px"/>
                    </div>
                    <ProfileUserData user={this.state.connectedUser} setUserState={this.setUserState} setUserInterestsState={this.setUserInterestsState}/>
                </div>

                <InformativeMessage message={new URLSearchParams(window.location.search).get("informativeMessage")}/>

                <div>
                  <AppMenu icon="profile"/>
                </div>
              </div>
  }

}

export default ProfilePage;