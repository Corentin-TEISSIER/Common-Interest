import React from "react";
import { NavLink } from "react-router-dom";
import FiltersButton from "../components/FiltersButton";
import AppMenu from "../components/AppMenu";
import "../style/FriendsPage.css";
import avatar from "../public/icon/avatar.png";
import * as icon from "../utils/interestsIconSources.js";
import AppContext from "../components/AppContext";

class FriendsPage extends React.Component {
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
    reload: false
  };

  filters = []

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
        data = data.filter(
          (e) => !this.state.connectedUser.friends.includes(e.id)
        );
        data = data.filter(
          (e) => !this.state.connectedUser.request.includes(e.id)
        );
        data = data.filter((e) => e.id !== this.state.connectedUser.id);
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
        <div id="find-friends-page-background">
          <div id="tabs">
            <div id="find-friends-tab-background">
              <div id="find-friends-tab">Find Friends</div>
            </div>
            <div id="my-friends-tab-background">
              <NavLink
                to="/FriendsPage/MyFriendsPage"
                style={{ textDecoration: "none" }}
              >
                <div id="my-friends-tab">My Friends</div>
              </NavLink>
            </div>
            <div id="pending-requests-tab-background">
              <NavLink
                to="/FriendsPage/PendingRequestsPage"
                style={{ textDecoration: "none" }}
              >
                <div id="pending-requests-tab">Requests</div>
              </NavLink>
            </div>
          </div>

          <div id="find-friends-background">
            <div id="filter-button">
              <FiltersButton to="/FriendsPage/FiltersPage" />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <div id="filter-list-container">
              <AppContext.Consumer>
                {(props) => {

                  this.filters = props.state.filters
                  console.log(this.filters)

                  return props.state.filters.map((e, i) => (
          
                    <div
                      className="filter-chip"
                      onClick={() => {
                        let filters = props.state.filters.filter(
                          (ee, idx) => i !== idx
                        );
                        props.setState({
                          filters: filters ?? [],
                        });
                        this.filters = filters ?? []
                      }}
                      key={i + e.value}
                    >
                      <div className="x-marque">
                        <img src="/Picture/marque-x.png" alt="X" />
                      </div>
                      <div className="filter-value-tag">
                        {`${e.value} #${i}`}
                      </div>                     
            
                    </div>
         
                  ));
                }}
              </AppContext.Consumer>
              </div>
            </div>
            <div id="find-friends-main">
              <div id="find-friends-main-content">

                {this.filters.length === 0?
                this.state.users.map( e => 
                        
                  <NavLink
                    className={"find-friends-main-item"}
                    to={`/ProfilePageFreindsPage?from=-FriendsPage&id=${e.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="find-friends-main-item">
                      <img src={e.profilePicture} alt="Avatar" className="avatar" />
                      <span>{e.name}</span>
                      <span>{e.age}</span>
                      <div className="icons">
                        {e.interests.slice(0, 3).map((el) => {
                          return (
                            <img
                              className="interest-circle"
                              src={icon.getInterestImgSource(el.speciality)}
                            ></img>
                          );
                        })}
                      </div>
                    </div>
                  </NavLink>
                )
                :
                this.state.users.filter(user => 
                      {
                        for(let i=0; i<user.interests.length; i++){
                          for(let k=0; k<this.filters.length; k++){
                            if(this.filters[k].value === user.interests[i].speciality ){
                              return true
                            }
                          }
                        }
                        return false
                      }
                      ).map( e => 
                        
                        <NavLink
                          className={"find-friends-main-item"}
                          to={`/ProfilePageFreindsPage?from=-FriendsPage&id=${e.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div className="find-friends-main-item">
                            <img src={e.profilePicture} alt="Avatar" className="avatar" />
                            <span>{e.name}</span>
                            <span>{e.age}</span>
                            <div className="icons">
                              {e.interests.slice(0, 3).map((el) => {
                                return (
                                  <img
                                    className="interest-circle"
                                    src={icon.getInterestImgSource(el.speciality)}
                                  ></img>
                                );
                              })}
                            </div>
                          </div>
                        </NavLink>
                      )
                  }
              
              </div>
            </div>
          </div>
        </div>
        <div>
          <AppMenu icon="friends" />
        </div>
      </div>
    );
  }
}

export default FriendsPage;
