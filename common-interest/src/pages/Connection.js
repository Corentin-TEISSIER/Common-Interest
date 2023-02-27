import React from 'react';
import '../style/Connection.css'
import { NavLink } from 'react-router-dom'


class Connection extends React.Component {

  render() {
    return    <div id="connection-background">
                  <NavLink to="/LoginPage" style={{textDecoration: "none"}}> 
                  <div id="login-button">
                    LOGIN
                  </div>
                  </NavLink>
                  <NavLink to="/SignupPage" style={{textDecoration: "none"}}>
                  <div id="signup-button">
                    SIGN UP
                  </div>
                  </NavLink>

              </div>
  }

}



export default Connection;