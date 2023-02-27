import React from "react";
import { NavLink } from "react-router-dom";
import AppMenu from "../components/AppMenu";

import * as icon from "../utils/interestsIconSources.js";

import "../style/PendingRequestsPage.css";
import "../style/MyFriendsPage.css";


class PendingRequestsPage extends React.Component {
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
      .then((data) => {
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
    /*
    COMMENT: maybe review css, display is weird in spacement, size and margin.
            ex: -interest icon are not centred
                -tils have a big height compared to the data each tile display
                -maybe enlarge the different stufs (text, interest icons)

  */

    return (
      <div>
        <>
          <div id="find-friends-page-background">
            <div id="tabs">
              <div id="find-friends-tab-background-bis">
                <NavLink to="/FriendsPage" style={{ textDecoration: "none" }}>
                  <div id="find-friends-tab-bis">Find Friends</div>
                </NavLink>
              </div>
              <div id="my-friends-tab-background">
                <NavLink
                  to="/FriendsPage/MyFriendsPage"
                  style={{ textDecoration: "none" }}
                >
                  <div id="my-friends-tab-bis">My Friends</div>
                </NavLink>
              </div>
              <div id="pending-requests-tab-background">
                <div id="pending-requests-tab-bis">Requests</div>
              </div>
            </div>

            <div id="find-friends-background">
              <div id="find-friends-main">
                <div id="find-friends-main-content">
                  {this.state.connectedUser.request.length < 1 ? (
                    <div id="message-info-no-friends-yet">{" No friend request for the moment..."}</div>
                  ) : null}

                  {this.state.users.length > 0 &&
                    this.state.connectedUser.request.map((id) => {
                      let e = this.state.users.find((ele) => ele.id === id);
                      return (
                        <div
                          className="find-friends-main-item"
                          style={{ textDecoration: "none" }}
                        >
                          <div className="find-friends-main-item">
                          <NavLink className="find-friends-main-item" to={`/ProfilePageFreindsPage?from=-FriendsPage-PendingRequestsPage&name=${e.name}&id=${e.id}`} style={{ textDecoration: "none" }}>
                            <img
                              src={e.profilePicture}
                              alt="Avatar"
                              className="avatar"
                            />
                            <span>{e.name}</span>
                            <span>{e.age}</span>
                            <div className="icons">
                              {e.interests === undefined?null:e.interests.slice(0, 3).map((el) => {
                                return (
                                  <img
                                    className="interest-circle"
                                    src={icon.getInterestImgSource(
                                      el.speciality
                                    )}
                                    alt=""
                                  />
                                );
                              })}
                            </div>
                            </NavLink>
                            <div
                              id="accepte-button-pendin-page"
                              onClick={async () => {
                                let connectedUser = {
                                  ...this.state.connectedUser,
                                };
                                connectedUser.friends.push(e.id);
                                e.friends.push(connectedUser.id);
                                connectedUser.request =
                                  connectedUser.request.filter(
                                    (el) => el !== e.id
                                  );
                                this.setState({ connectedUser });

                                console.log(connectedUser)

                                await fetch("http://localhost:4000/connectedUser", {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(connectedUser),
                                });

                                await fetch(
                                  "http://localhost:4000/users/" +
                                    this.state.connectedUser.id,
                                  {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(connectedUser),
                                  }
                                );
                                await fetch(
                                  "http://localhost:4000/users/" + e.id,
                                  {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(e),
                                  }
                                );
                              }}
                            >
                              Accept
                            </div>
                          </div>
                        </div>
                        
                      );
                    })}
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

export default PendingRequestsPage;
