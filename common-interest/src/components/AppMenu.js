import React from 'react';
import { NavLink } from 'react-router-dom';
import '../style/AppMenu.css'
import AppMenuButton from "./AppMenuButton.js"




class AppMenu extends React.Component {

  changeFriendsButtonImgSrc() {
    document.getElementById("friends-icon").src="icon/friends_grey.png"
    document.getElementById("messages-icon").src="icon/messages_black.png"
    document.getElementById("origami-icon").src="icon/origami_black.png"
    document.getElementById("profile-icon-ma").src="icon/profile_black.png"
    document.getElementById("origami-icon-ma").src="icon/origami_black.png"
    document.getElementById("profile-icon").src="icon/profile_black.png"
  }

  changeMessagesButtonImgSrc() {
    document.getElementById("friends-icon").src="icon/friends_black.png"
    document.getElementById("messages-icon").src="icon/messages_grey.png"
    document.getElementById("origami-icon").src="icon/origami_black.png"
    document.getElementById("profile-icon-ma").src="icon/profile_black.png"
    document.getElementById("origami-icon-ma").src="icon/origami_black.png"
    document.getElementById("profile-icon").src="icon/profile_black.png"
  }

  changeActivitiesButtonImgSrc() {
    document.getElementById("friends-icon").src="icon/friends_black.png"
    document.getElementById("messages-icon").src="icon/messages_black.png"
    document.getElementById("origami-icon").src="icon/origami_grey.png"
    document.getElementById("profile-icon-ma").src="icon/profile_black.png"
    document.getElementById("origami-icon-ma").src="icon/origami_black.png"
    document.getElementById("profile-icon").src="icon/profile_black.png"
  }

  changeMyActivitiesButtonImgSrc() {
    document.getElementById("friends-icon").src="icon/friends_black.png"
    document.getElementById("messages-icon").src="icon/messages_black.png"
    document.getElementById("origami-icon").src="icon/origami_black.png"
    document.getElementById("profile-icon-ma").src="icon/profile_grey.png"
    document.getElementById("origami-icon-ma").src="icon/origami_grey.png"
    document.getElementById("profile-icon").src="icon/profile_black.png"
  }

  changeProfileButtonImgSrc() {
    document.getElementById("friends-icon").src="icon/friends_black.png"
    document.getElementById("messages-icon").src="icon/messages_black.png"
    document.getElementById("origami-icon").src="icon/origami_black.png"
    document.getElementById("profile-icon-ma").src="icon/profile_black.png"
    document.getElementById("origami-icon-ma").src="icon/origami_black.png"
    document.getElementById("profile-icon").src="icon/profile_grey.png"
  }

  render(props) {

    // if (document.location.pathname === "/" || document.location.pathname === "/LoginPage"){
    //   return 
    // }

 
    return  <div id="background-menu" > 
                      <NavLink to='/FriendsPage' onClick={() => this.changeFriendsButtonImgSrc()}>
                      <div id="friends-button-menu">
                        <AppMenuButton id="friends" icon={this.props.icon}/>
                      </div>
                      </NavLink>

                      <NavLink to='/MessagesPage' onClick={() => this.changeMessagesButtonImgSrc()}>
                      <div id="messages-button-menu">
                        <AppMenuButton id="messages" icon={this.props.icon}/>
                      </div>
                      </NavLink>

                      <NavLink to='/ActivitiesPage' onClick={() => this.changeActivitiesButtonImgSrc()}>
                      <div id="activities-button-menu">
                        <AppMenuButton id="activities" icon={this.props.icon}/> 
                      </div> 
                      </NavLink>
                      
                      <NavLink to='/MyActivitiesPage' onClick={() => this.changeMyActivitiesButtonImgSrc()}>
                      <div id="my-activities-button-menu">
                        <AppMenuButton id="my-activities" icon={this.props.icon}/>  
                      </div>
                      </NavLink>

                      <NavLink to='/ProfilePage' onClick={() => this.changeProfileButtonImgSrc()}>
                      <div id="profile-button-menu">
                        <AppMenuButton id="profile" icon={this.props.icon}/>   
                      </div>
                      </NavLink>
                </div>
    
  }

}

export default AppMenu;