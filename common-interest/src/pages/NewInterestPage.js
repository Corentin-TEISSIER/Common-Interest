import React from 'react';
import '../style/NewInterestPage.css'
import BackButton from '../components/BackButton.js'
import SaveButton from '../components/SaveButton.js'
import AppMenu from '../components/AppMenu';
import { Frequency, Level } from '../utils/interestFactors';

class NewInterestPage extends React.Component {

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

  state = {
    interests: {"select": [
      "select"
    ]},
    category: "select",
    speciality: "select",
    frequency: "Rarely",
    level: "Beginner",

    error:""
  }

  handleCategoryChange = event => {
    this.setState({
      category: event.target.value,
      speciality: ''
    });
  };

  handleSpecialityChange = event => {
    this.setState({
      speciality: event.target.value
    });
  };

  verifyData(){
    if(this.state.category === 'select' || this.state.speciality === 'select' || this.state.speciality === ""){
      this.setState({error: "Please fill in all the fields before saving."})
      setTimeout( () => { this.setState({error: ""})}, 3000)
    }
  }


  render() {

    if(Object.keys(this.state.interests).length === 0){
      return <div>
        Connection...
      </div>
    }
    else{

    return    <div>
                <div id="new-interest-page-background">

                    <div>
                      <BackButton to='/ProfilePage' />
                    </div>
                  
                  <div id="new-interest-page-title">
                    New Interest
                  </div>

                  <div id="input-justification">
                      This data will help the app show you people with the same interests as you.
                  </div>

                  <div>
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
                    <div class="fillin" id="change-frequency">
                      Frequency:
                      <select name="frequency" class="fillin-area" id="change-frequency-fillin-area" value={this.state.frequency} onChange={e => this.setState({frequency: e.target.value})}>
                          {Object.keys(Frequency).map(key => (
                            <option value={Frequency[key]}>{Frequency[key]}</option>
                          ))}
                      </select>
                  
                    </div>
                    <div class="fillin" id="change-level">
                      Level:
                      <select name="level" class="fillin-area" id="change-level-fillin-area" value={this.state.level} onChange={e => this.setState({level: e.target.value})}>
                          {Object.keys(Level).map(key => (
                            <option value={Level[key]}>{Level[key]}</option>
                          ))}
                      </select>
                    
                    </div>

                  </div>
                        
                  

                  <div id="div-save-button" onMouseEnter={ () => { this.verifyData() } }>
                      {this.state.error === '' ?
                      <div className="create-activity-error-message-fake" />
                      :
                      <div className="create-activity-error-message">{this.state.error}</div>
                      }
                      <SaveButton to='/ProfilePage' 
                                  saveType="saveNewInterest" 
                                  category={this.state.category} 
                                  speciality={this.state.speciality} 
                                  frequency={this.state.frequency} 
                                  level={this.state.level} 
                                  informativeMessage="?informativeMessage=New%20interest%20saved"/>
                  </div>
                </div>
                <div>
                  <AppMenu icon='profile'/>
                </div>
              </div>
  }
}

}

export default NewInterestPage;