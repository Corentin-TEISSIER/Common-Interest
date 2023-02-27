import React from 'react';
import '../style/SignupPage.css'
import BackButton from '../components/BackButton';
import { NavLink } from 'react-router-dom';
const noPicture = require('../../src/public/icon/profile_grey.png')

class SignupPage extends React.Component {

  state = {
    username: "",
    password: "",
    name: "",
    profilePicture: "",
    location: "",
    age: -1,

    file: "",
    errorMessage: false
  }


  handlePictureChange = (e) => {
    const file = e.target.files[0];
    this.setState({file: file})

    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({profilePicture: reader.result})
    };
    reader.readAsDataURL(file);
  };


  createNewUser = async (e) => {

    if(this.state.username === "" || this.state.password === "" || this.state.name === "" || this.state.profilePicture === "" || this.state.location === "" || this.state.age === -1){
      e.preventDefault();
      this.setState({errorMessage: true})
    }
    else{

      var users = await fetch('http://localhost:4000/users',{
        method: 'GET',
        headers: { 'Content-Type': 'application/json'}
      }).then( res => res.json() )

      const newUser = {
        id: users[users.length - 1].id + 1,
        name: this.state.name,
        username: this.state.username,
        password: this.state.password,
        profilePicture: this.state.profilePicture,
        friends: [],
        activities: [],
        invitedActivities: [],
        interests: [],
        location: this.state.location,
        age: this.state.age,
      }

      users.push(newUser)

      await fetch('http://localhost:4000/users/' ,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(newUser)
      })

      await fetch('http://localhost:4000/connectedUser',{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(newUser)
      })

      do{
        var connectedUser = await fetch('http://localhost:4000/connectedUser',{
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        }).then( res => res.json())
          .then( data => connectedUser = data)
      }while(connectedUser.id === -1)

    }
    
  }


  render() {

    return    <div id="signup-background">

                  <BackButton to="/"/>

                  <div id="signup-page-label">
                    New User
                  </div> 

                  <div id="scrollable-signup-area">
                    <form id="signup-form">


                      <div>
                        <div className="signup-parent-div">
                          <div id="signup-fake-input-file-new-activity-picture">
                            {this.state.profilePicture === ""
                            ?
                            <img src={noPicture} alt="Click" onClick={ () => { document.getElementById('signup-input-file-new-activity-picture').click() } } />
                            :
                            <img src={this.state.profilePicture} alt="you" onClick={ () => { document.getElementById('input-file-new-activity-picture').click() } } />}
                            <input id="signup-input-file-new-activity-picture" type="file" onChange={this.handlePictureChange} />
                          </div>
                        </div>
                      </div>


                      <div class="fillin" id="signup-username">
                        Username:
                        <input class="fillin-area" id="signup-change-username-fillin-area" type="username"  placeholder='Username' value={this.state.username} onChange={e => this.setState({username: e.target.value})} />
                      </div>

                      <div class="fillin" id="signup-password">
                        Password:
                        <input class="fillin-area" id="signup-change-password-fillin-area" type="password"  placeholder='Password' value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
                      </div>

                      <div class="fillin" id="signup-name">
                        Name:
                        <input class="fillin-area" id="signup-change-name-fillin-area" type="name"  placeholder='Name' value={this.state.name} onChange={e => this.setState({name: e.target.value})} />
                      </div>

                      <div class="fillin" id="signup-age">
                        Age:
                        <input class="fillin-area" id="signup-change-age-fillin-area" type="number"  placeholder='Age' value={this.state.age} onChange={e => this.setState({age: e.target.value})} />
                      </div>

                      <div class="fillin" id="signup-location">
                        Location:
                        <input class="fillin-area" id="signup-change-location-fillin-area" type="location"  placeholder='Location' value={this.state.location} onChange={e => this.setState({location: e.target.value})} />
                      </div>

                    </form>
                  
                    <div id="signup-page-create-user-button-container">
                        {this.state.errorMessage
                        ?
                        <div id="signup-error-message">Please fill in all the blanks</div>
                        :
                        null
                        }
                      <NavLink to="/ActivitiesPage/" style={{textDecoration: "none"}} onClick={ (e) => { this.createNewUser(e) }}>
                      <div id="signup-page-create-user-button">
                        SIGN UP
                      </div>
                      </NavLink>
                    </div> 
                  </div>

              </div>
  }

}



export default SignupPage; 