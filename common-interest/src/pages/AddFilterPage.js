import React from "react";
import "../style/AddFilterPage.css";
import BackButton from "../components/BackButton";
import AppMenu from "../components/AppMenu.js";
import { AppConsumer } from "../components/AppContext";
import { NavLink } from "react-router-dom";

class AddFilterPage extends React.Component {

  state = {
    category: "select",
    speciality: "select",
    interests: {"select": [
      "select"
    ]}
  }

  componentDidMount(){
    this.fetchInterests()
  }

  async fetchInterests(){
    try{
      await fetch('http://localhost:4000/interests',{
        method: 'GET',
        headers: { 'Content-Type': 'application/json'}
      }).then( res => {return res.json()})
        .then( data => {this.setState({interests: data.interests})})
    }catch(error){
      console.log(error)
    }
  }

  handleCategoryChange = event => {
    this.setState({
      category: event.target.value,
      speciality: "select"
    });
  };

  handleSpecialityChange = event => {
    this.setState({
      speciality: event.target.value
    });
  };

  render() {

    // COMMENT: you can take a look at CreateNewInterestPage to see how to create the category and speciality area
    
    return (
        <div id="add-filter-page-background">
          <div id="add-filter-page-main-container">
            <BackButton to="/FriendsPage/FiltersPage" />
                    <div class="fillin" id="change-category">
                      Category:
                      <select name="category" class="fillin-area" id="change-category-fillin-area" value={this.state.category} onChange={this.handleCategoryChange}>
                          {Object.keys(this.state.interests).map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                      </select>
                  
                    </div>
                    <div class="fillin" id="change-speciality">
                      Speciality:
                      <select name="speciality" class="fillin-area" id="change-speciality-fillin-area" value={this.state.speciality} onChange={this.handleSpecialityChange}>
                        {this.state.interests[this.state.category].map(speciality => (
                          <option key={speciality} value={speciality}>
                            {speciality}
                          </option>
                        ))}
                      </select>

                    </div>
          <AppConsumer>
            {(props) => {
              return (
                <div
                  id="saveButton"
                  onClick={() => {
                    props.setState({
                      filters: [...props.state.filters, { value: this.state.speciality }],
                    });
                  }}
                >
                  <NavLink to="/FriendsPage/FiltersPage" style={{textDecoration: "none"}} >
                    <div id="save-button-container">
                      Save
                    </div>
                  </NavLink>
                  
                  
                </div>
              );
            }}
          </AppConsumer> 
        </div>
        <div>
          <AppMenu icon="friends" />
        </div>
      </div>
    );
  }
}

export default AddFilterPage;