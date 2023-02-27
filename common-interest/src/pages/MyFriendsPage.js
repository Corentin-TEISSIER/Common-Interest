import React from "react";
import { NavLink } from "react-router-dom";
import AppMenu from "../components/AppMenu";

import * as icon from '../utils/interestsIconSources.js'

import "../style/PendingRequestsPage.css";

import "../style/MyFriendsPage.css";

import { compareInterests } from "../utils/interestFactors";

class MyFriendsPage extends React.Component { 
  state = {
    connectedUser: {
      id: -1,
      name: "",
      username: "",
      password: "",
      profilePicture: "",
      friends: [],
      request: [],
      activities: [],
      interests: [],
      location: "",
      age: -1,
    },
    searchName: "",
    loading: true,
    error: null,
    profilePicture: "",
    users: [],
  };

  async getUser() {
    await fetch("http://localhost:4000/connectedUser", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then(async (data) => {

        this.setState({ connectedUser: data });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });

    await fetch("http://localhost:4000/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ users: data });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  }
  componentDidMount() {
    this.getUser();
  }

  render() {


    

    return (
      <div>
        
              <>
                <div id="find-friends-page-background">
                  <div id="tabs">
                    <div id="find-friends-tab-background">
                      <NavLink
                        to="/FriendsPage"
                        style={{ textDecoration: "none" }}
                      >
                        <div id="find-friends-tab-ter">Find Friends</div>
                      </NavLink>
                    </div>
                    <div id="my-friends-tab-background">
                      <div id="my-friends-tab-ter">My Friends</div>
                    </div>
                    <div id="pending-requests-tab-background-ter">
                      <NavLink
                        to="/FriendsPage/PendingRequestsPage"
                        style={{ textDecoration: "none" }}
                      >
                        <div id="pending-requests-tab-ter">Requests</div>
                      </NavLink>
                    </div>
                  </div>

                  <div id="find-friends-background">
                    <div id="find-friends-main">
                      <div id="find-friends-main-content">

                        {this.state.users.length>0 && this.state.connectedUser.friends.map((id) => {
                          let e = this.state.users.find((ele) => ele.id===id);
                          return(
                          <NavLink
                            className={"find-friends-main-item"}
                            to={`/ProfilePageFreindsPage?from=-FriendsPage-MyFriendsPage&name=${e.name}&id=${e.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <div className="find-friends-main-item">
                              <img
                                src={e.profilePicture}
                                alt="Avatar"
                                className="avatar"
                              />
                              <span>{e.name}</span>
                              <span>{e.age}</span>
                              <div className="icons">
                                  {e.interests === undefined?null:e.interests.sort(compareInterests).slice(0, 3).map(el => {
                                  return <img className="interest-circle" src={icon.getInterestImgSource(el.speciality)}></img>
                                }
                                )}
                              </div>
                            </div>
                          </NavLink>
                        )})}
                        {this.state.connectedUser.friends.length<1?<div id="message-info-no-friends-yet">{"You have no friends for the moment, go on the find friends page and send your first request!"}</div>:null}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <AppMenu icon="friends" />
                </div>
              </>
      </div>
    );
  }
}

export default MyFriendsPage;
