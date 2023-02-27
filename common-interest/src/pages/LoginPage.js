import React from 'react';
import { NavLink } from 'react-router-dom';
import '../style/LoginPage.css'

import LoginErrorMessage from '../components/LoginErrorMessage.js'
import BackButton from '../components/BackButton';

import ServerErrorMessage from '../components/ServerErrorMessage';

class LoginPage extends React.Component {
  
  state = {
    username: "",
    password: "",
    wrong: false,
    error: false,
    destination: '/LoginPage'
  }

  shouldComponentUpdate(nextProps, nextState){
    return (this.state !== nextState)
  }

  async connectionAllowed() { 
    
    const users = await fetch('http://localhost:4000/users',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    }).then( res => {return res.json()})

    for (var i = 0; i<users.length; i++){
      if(users[i].username === this.state.username){
        if(users[i].password === this.state.password){
          this.setState({destination: '/ActivitiesPage'})
          const res = await fetch("http://localhost:4000/connectedUser", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(users[i])
          })

          if(res.ok){ 
            return(true)
          }
          else{
            this.setState({destination: '/LoginPage'})
            throw new Error('Issue with server')
          }
          
        }
      }
    }
    return(false)
  }

  next() {
    try{
      if(!this.connectionAllowed()){
        this.setState({username: ""})
        this.setState({password: ""})
        this.setState({wrong: true})
      }
    }catch(error){
      this.setState({error: true})
    }
    
  }
      
 
  render() {

    return    <div id="login-background">
                  <form>
                    
                    
                    <BackButton to='/' />
                    

                    <label id="top-login-label">
                      <div id="username-label">
                      USERNAME
                      </div>
                      <input id="username-fillin-area" type="text" placeholder='enter username' value={this.state.username} onChange={e => this.setState({username: e.target.value})} />
                    </label>
                    
                    <label id="bottom-login-label">
                      <div id="password-label">
                      PASSWORD
                      </div>
                      <input id="password-fillin-area" type="password"  placeholder='enter password' value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
                      <LoginErrorMessage wrong={this.state.wrong}/>
                      <ServerErrorMessage error={this.state.error}/>
                    </label>

                    <label id="label-connection-button" >
                      <NavLink to={this.state.destination} style={{textDecoration: "none"}} onMouseEnter={ () => {this.next()} }>
                      <div id="connection-button">
                        CONNECTION
                      </div>
                      </NavLink>
                    </label>

                    
                  </form>
              </div>
  }

}



export default LoginPage;