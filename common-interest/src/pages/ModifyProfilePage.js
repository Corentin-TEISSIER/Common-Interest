import React from 'react';
import '../style/ModifyProfilePage.css'
import BackButton from '../components/BackButton.js'
import SaveButton from '../components/SaveButton.js'
import AppMenu from '../components/AppMenu';


class ModifyProfilePage extends React.Component {

  state = {
    name: "",
    age: "",
    location: "",
    profilePicture: "",
    file: ""
 
  }

  async componentDidMount(){
    await fetch('http://localhost:4000/connectedUser',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    }).then(res => res.json())
      .then(res => {
        this.setState({name: res.name, age: res.age, location: res.location, profilePicture: res.profilePicture})
      })
  }

  handlePictureChange = (e) => {
    const file = e.target.files[0];
    this.setState({file: file})

    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({profilePicture: reader.result})
    };
    reader.readAsDataURL(file);
  }

  render() {
    return    <div>
                <div id="modify-profile-page-background-bis">
                  <div>

                    <div>
                      <BackButton to='/ProfilePage' />
                    </div>

                    {/* <div id="div-profile-picture">
                      <div id='profile-picture-background'>
                        <img src={this.state.profilePicture} alt="Me" />
                      </div>
                    </div> */}

                    <div id="div-profile-picture" onClick={ () => { document.getElementById('modify-profile-page-picture-input').click() } }>
                      <div id='profile-picture-background'>
                        <img id="modify-profile-picture-img" src={this.state.profilePicture} alt="" onClick={ () => { document.getElementById('modify-profile-page-picture-input').click() } } />
                        <input id="modify-profile-page-picture-input" type="file" onChange={this.handlePictureChange} />
                      </div>
                    </div>
                      
                    <div class="fillin" id="change-name">
                      Name:
                      <input class="fillin-area" id="change-name-fillin-area" type="name"  placeholder='name' value={this.state.name} onChange={e => this.setState({name: e.target.value})} />
                    </div>
                    <div class="fillin" id="change-age">
                      Age:
                      <input class="fillin-area" id="change-age-fillin-area" type="number" min="18" max="99" name="birthdate" value={this.state.age} onChange={e => this.setState({age: e.target.value})}/>
                    </div>
                    <div class="fillin" id="change-location">
                      Location:
                      <input class="fillin-area" id="change-location-fillin-area" type="location"  placeholder='location' value={this.state.location} onChange={e => this.setState({location: e.target.value})} />
                    </div>

                  </div>

                  <div id="div-save-button">
                    <SaveButton to='/ProfilePage'
                                saveType="saveUserData" 
                                name={this.state.name} 
                                age={this.state.age} 
                                location={this.state.location} 
                                profilePicture={this.state.profilePicture}
                                informativeMessage="?informativeMessage=Modification%20saved"/>
                  </div>
                </div>
                <div>
                  <AppMenu icon='profile'/>
                </div>
              </div>
  }

}

export default ModifyProfilePage;