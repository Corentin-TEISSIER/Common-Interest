import React from 'react';
import AppMenu from '../components/AppMenu';
import BackButton from '../components/BackButton';
import SaveButton from '../components/SaveButton';
import '../style/CreateActivityPage.css'



class CreateActivityPage extends React.Component {

  state = {
    id: -1,
    title: "",
    description: "",
    date: "",
    location: "",
    numberMaxCustomer: 2,

    interests: {"select": [
      "select"
    ]},
    category: "select",
    speciality: "select",
 
    previewUrl: "",
    file: "",

    error:""
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
      speciality: ''
    });
  };

  handleSpecialityChange = event => {
    this.setState({
      speciality: event.target.value
    });
  };


  handlePictureChange = (e) => {
    const file = e.target.files[0];
    this.setState({file: file})

    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({previewUrl: reader.result})
    };
    reader.readAsDataURL(file);
  };


  verifyData(){
    if(this.state.title === "" ||  
       this.state.description === "" || 
       this.state.location === "" || 
       this.state.date === "" || 
       this.state.maxAttending < 2 || 
       this.state.maxAttending > 20 || 
       this.state.picture === "" || 
       this.state.file === "" ||
       this.state.speciality === "select" || 
       this.state.speciality === ""){
      this.setState({error: "Please fill in all the fields before saving."})
      setTimeout( () => { this.setState({error: ""}) }, 3000)
    }
    else{
      if(this.state.numberMaxCustomer < 2 || this.state.numberMaxCustomer > 50){
        this.setState({error: "The maximum number of participant as to be between 2 and 50."})
        setTimeout( () => { this.setState({error: ""}) }, 3000)
      }
    }
  }

 

  render() {

    let params = new URLSearchParams(window.location.search)
    let fromPath = params.get("from").split('-').join('/')
    
    return    <div>
                <div id="create-activity-page-background"> 
                  {/* <BackButton to={this.state.fromPath} /> */}
                  <BackButton to={fromPath} />
                  <div id="create-activity-title">
                     New Activity
                  </div>
                  <form id="create-activity-content">

                    <div id="title-div">
                      <div id="title-texte">
                        Title
                      </div>
                      <input id="title-input" class="fillin-area" placeHolder="Title" type="texte" value={this.state.title} onChange={e => this.setState({title: e.target.value})} />
                    </div>

                    <div>
                      <div className="parent-div">
                        <div id="new-activity-picture-label">
                          Picture
                        </div>
                        <div id="fake-input-file-new-activity-picture">
                          <div onClick={ () => { document.getElementById('input-file-new-activity-picture').click() } }>Get picture </div>
                          <input id="input-file-new-activity-picture" type="file" onChange={this.handlePictureChange} />
                        </div>
                      </div>
                      {this.state.previewUrl && <img id="new-activity-image-preview" src={this.state.previewUrl} alt="Preview" width="330px" height="110px"/>}
                    </div>

                    <div id="description-div">
                      <div id="description-texte">
                        Description
                      </div>
                      <textarea id="description-input" 
                                class="fillin-area" 
                                placeHolder="Description" 
                                autoComplete='off'
                                autocorrect='on'
                                maxLength={500}
                                type="texte" 
                                value={this.state.description} 
                                onChange={e => this.setState({description: e.target.value})} />
                    </div>

                    <div id="category-div">
                      <div id="category-texte">
                        Category
                      </div>
                      <select name="category" class="fillin-area" id="change-category-fillin-area" value={this.state.category} onChange={this.handleCategoryChange}>
                          {Object.keys(this.state.interests).map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div id="speciality-div">
                      <div id="speciality-texte">
                        Speciality
                      </div>
                      <select name="speciality" class="fillin-area" id="change-speciality-fillin-area" value={this.state.speciality} onChange={this.handleSpecialityChange}>
                        {this.state.interests[this.state.category].map(speciality => (
                          <option key={speciality} value={speciality}>
                            {speciality}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div id="date-div">
                      <div id="date-texte">
                        Date
                      </div>
                      <input class="fillin-area" id="date-fillin-area" type="date" name="activity-date" value={this.state.date} onChange={e => this.setState({date: e.target.value})}/>
                    </div>

                    <div id="location-div">
                      <div id="location-texte">
                        Location
                      </div>
                      <input class="fillin-area" id="location-fillin-area" placeHolder="Location" name="activity-location" value={this.state.location} onChange={e => this.setState({location: e.target.value})}/>
                    </div>

                    <div id="max-attending-div">
                      <div id="max-attending-texte">
                        Max participants
                      </div>
                      <input type="number" class="fillin-area" id="max-attending-fillin-area" placeHolder="from 2 to 50" name="max-attending" min="2" max="50" value={this.state.numberMaxCustomer} onChange={e => this.setState({numberMaxCustomer: e.target.value})} onInput={e => this.setState({numberMaxCustomer: e.target.value})}/>
                    </div>

                    

                    
                    <div id="save-button-frame" onMouseEnter={ () => this.verifyData() }>
                      {this.state.error === "" ?
                        <div className="create-activity-error-message-fake" />
                        :
                        <div className="create-activity-error-message">
                          {this.state.error}
                        </div>
                      }
                      
                      <SaveButton to={fromPath} 
                                  saveType="saveNewActivity" 
                                  title={this.state.title}
                                  picture={this.state.previewUrl}
                                  description={this.state.description}
                                  speciality={this.state.speciality}
                                  date={this.state.date}
                                  location={this.state.location}
                                  maxAttending={this.state.numberMaxCustomer}

                                  informativeMessage={`?informativeMessage=Activity%20${this.state.title}%20created`}
                                  
                      />
                    </div>
                    

                  </form>
              </div>

              <div>
                <AppMenu icon='my-activities'/>
              </div>
            </div>
  }

}

export default CreateActivityPage;