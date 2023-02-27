import React from 'react';
import '../style/DisconnectionPage.css'
import { NavLink } from 'react-router-dom'
import AppMenu from '../components/AppMenu';

import ServerErrorMessage from '../components/ServerErrorMessage';

class Disconnection extends React.Component {

    state = {
        error: false
    }

    tryDisconnection() {
        try{
            this.disconnectUser()
        }catch(error) {
            this.setState({error: true})
        }
    }

    async disconnectUser() {
        const res = await fetch("http://localhost:4000/connectedUser", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: -1,
                name: "none",
                username: "none",
                password: "none",
                profilePicture: "none"
            })
        })
        
        if(res.ok){
            return true
        }
        else{
            throw new Error('Issue with server connection')
        }
    }

  render() {
    return    <div>
                <div id="disconnection-background">
                  <NavLink to="/" style={{textDecoration: "none"}} onCLick= { () => {this.tryDisconnection()}}> 
                  <div id="login-button">
                    DISCONNECT
                  </div>
                  <ServerErrorMessage error={this.state.error}/>
                  </NavLink>
                  <NavLink to="/ProfilePage" style={{textDecoration: "none"}}>
                  <div id="signup-button">
                    KEEP CONNECTED
                  </div>
                  </NavLink>
              </div>
              <div>
                <AppMenu icon='profile'/>
              </div>
            </div>
  }

}



export default Disconnection;