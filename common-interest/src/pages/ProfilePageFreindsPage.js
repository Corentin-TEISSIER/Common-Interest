import React from "react";
import "../style/ProfilePage.css";
import AppMenu from "../components/AppMenu";
import BackButton from "../components/BackButton";
import { SendMessageTile } from "./MessagesGroupInformations";

import ProfileUserDataFriends from "../components/ProfileUserDataFriends";
class ProfilePageFreindsPage extends React.Component {


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
      request: [],
      location: "",
      age: -1,
    },
    user:{},
    loading: true,
    error: null,
    profilePicture: "",
    realConnectedUser: {},
    friendJustAdded: false
  };

  async setUserState(value) {
    //Update DB
    await fetch("http://localhost:4000/connectedUser", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });

    await fetch("http://localhost:4000/users/" + value.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });

    //setState
    this.setState({ ...this.state, connectedUser: value });
  }

  setUserInterestsState = (value) => {
    let user = { ...this.state.connectedUser };
    user.interests = value;
    this.setUserState(user);
  };

  componentDidMount() {
    let params = new URLSearchParams(window.location.search);
    const id = +params.get("id");

    try {
      this.getConnectedUser(id);
      this.getUser(id);
      this.getRealConnectedUser()
    } catch (error) {
      console.log(error);
    }
  }

  async getConnectedUser() {
    await fetch("http://localhost:4000/connectedUser", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        // COMMENT: currUser is not initiate; use connectedUser
        this.setState({ currUser: data });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  }

  async getRealConnectedUser() {
    await fetch("http://localhost:4000/connectedUser", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ realConnectedUser: data });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  }

  async getUser(id) {
      await fetch("http://localhost:4000/users?id="+ id, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => response.json())
      .then((data) => {
        data=data[0]
        this.setState({ connectedUser: data });
        this.setState({ user: data });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  }

  getMenuIcon(fromPath){
    var splitPath = fromPath.split('/')
    var rootPage = splitPath[1]
    switch(rootPage){
      case "FriendsPage":
        return "friends"

      case "MessagesPage":
        return "messages"

      case "ActivitiesPage":
        return "activities"

      case "MyActivitiesPage":
        return "my-activities"

      case "ProfilePage":
        return "profile"

    }
    
  }



  render() {
    let params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    const name = params.get("name");
    const id = params.get("id");
    const from = params.get("from").split('-').join('/').split('>').join('?').split('_').join('=')



    return (
      <div>
        <div id="profile-page-background">
                <div id="profile-header-background">
                  <div id="disconnect-button-background">
                    {from ?
                    <BackButton to={from}/>
                    :
                    <BackButton to={'/FriendsPage'}/>
                    }
                    
                     
                  </div>
                  <div id="from-profile-send-direct-message">
                    <SendMessageTile user={this.state.user} />
                  </div>
                </div>

          <div id="profile-picture-background-bis">
            <img src={this.state.connectedUser.profilePicture} alt="Me" width="140px" height="140px" />
          </div>

          <div id="modify-button-background-bis">
                    {from === "/FriendsPage/PendingRequestsPage" ? (
                      this.state.friendJustAdded === false?
                      <div
                        onClick={() => {
                            let user = {...this.state.user}
                            let currUser = {...this.state.currUser}

                            currUser.friends.push(user.id);
                            // COMMENT: do not mutate state directly.
                            currUser.request = currUser.request.filter(e=> e !==parseInt(id));

                            user.friends.push(currUser.id);
                            this.setState({user, currUser})

                           fetch("http://localhost:4000/connectedUser", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(currUser),
                          });
                          fetch("http://localhost:4000/users/" + this.state.currUser.id, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(currUser),
                          });
                          fetch("http://localhost:4000/users/" + this.state.user.id, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(user),
                          });
                           this.setState({friendJustAdded: true})
                        }}
                        id="modify-button-bis"
                      >
                        Accept friend request
                      </div>
                      :
                      <div id="request-already-sent-message">
                        Friend added
                      </div>
                    ) :  from === "/FriendsPage" ? (
                      
                      this.state.connectedUser.request.includes(this.state.realConnectedUser.id)?
                      <div id="request-already-sent-message">
                        Pending request
                      </div>
                      : 
                      <div
                        onClick={() => {
                            let currUser = {...this.state.currUser}
                            let user = {...this.state.user}
                            user.request.push(currUser.id);
                            this.setState({user})
                          // COMMENT: SAME COMMENTS AS FOR page=request onClick function
                          fetch("http://localhost:4000/users/" + this.state.user.id, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(this.state.user),
                          });
                          
                        }}
                        id="modify-button-bis"
                      >
                        {/*COMMENT: Is 'send' relevant? maybe something like 'add friend' would be better. Put it under profile page + chech if already send request -> message 'request already sent'*/}
                        Add Friend
                      </div>
                      

                    ) :null}
                  </div>

          <ProfileUserDataFriends
            user={this.state.connectedUser}
            setUserState={this.setUserState}
            setUserInterestsState={this.setUserInterestsState}
          />
        </div>
        
        {/*COMMENT: Need to display the AppMenu depending on from where we come 
                    come from friends: <AppMenu icon='friends'
                    come from messages: <AppMenu icon='messages'
                    come from ... etc
                    
          Maybe the easier is to pass it by url
        */}
        <div>
          <AppMenu icon={this.getMenuIcon(from)} />
        </div>
      </div>
    );
  }
}

export default ProfilePageFreindsPage;
