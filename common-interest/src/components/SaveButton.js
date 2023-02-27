import React from "react";
import { NavLink } from "react-router-dom";
import '../style/SaveButton.css'
import { AppConsumer } from "../components/AppContext";

async function save(e, props){ 

    switch(props.saveType){
        case "saveUserData":
            saveUserData(e, props.name, props.age, props.location, props.profilePicture)
            break

        case "saveNewInterest":
            saveNewInterest(props.category, props.speciality, props.frequency, props.level)
            break

        case "saveNewActivity":
            saveNewActivity(e, props.title, props.picture, props.description, props.speciality, props.date, props.location, props.maxAttending)
            break

        default:
            throw new Error('Bad save type')
    }
}

async function saveUserData(e, name, age, location, profilePicture){
    try{
        var getConnectedUserProm = await fetch('http://localhost:4000/connectedUser',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        var newUserData = await getConnectedUserProm.json()
        

        newUserData.name = name
        newUserData.age = age
        newUserData.location = location
        newUserData.profilePicture = profilePicture

        const res2 = await fetch('http://localhost:4000/connectedUser',{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(newUserData)
        })
        await res2.json()

        const res3 = await fetch('http://localhost:4000/users/' + newUserData.id,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(newUserData)
        })
        const resFin = await res3.json()

        if(resFin.profilePicture !== profilePicture){ e.preventDefault() }

    }catch(error){
        console.log(error)
    }
}



 
async function saveNewInterest(category, speciality, frequency, level){

    try{
        if(!(category === 'select' || speciality === 'select' || speciality === "")){
            const user = await fetch('http://localhost:4000/connectedUser').then( res => res.json())
            user.interests.push({category: category, speciality: speciality, frequency: frequency, level: level})
            
            await fetch('http://localhost:4000/connectedUser',{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            })

            await fetch('http://localhost:4000/users/' + user.id,{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            })

        }
        

    }catch(error){
        console.log(error)
    } 

}



async function saveNewActivity(e, title, picture, description, speciality, date, location, maxAttending){

    
    try{

        if(title === "" || description === "" || location === "" || date === "" || maxAttending < 2 || maxAttending > 20 || picture === "" || speciality === "select" || speciality === ""){
            e.preventDefault();
        }
        else{


            const connectedUser = await fetch('http://localhost:4000/connectedUser',{
                method: 'GET',
                headers: { 'Content-Type': 'application/json'}
            }).then( res => res.json())

            const activities = await fetch('http://localhost:4000/activities',{
                method: 'GET',
                headers: { 'Content-Type': 'application/json'}
            }).then( res => res.json()).then( data => data.activities)

            const userId = connectedUser.id
            const lastActivitiesId = activities[activities.length - 1].id + 1
            
            const newActivity = {
                id: lastActivitiesId,
                title: title,
                dealerId: userId,
                description: description,
                location: location,
                date: date.split('-').reverse().join('/'),
                numberMaxCustomer: maxAttending, 
                customersId:[],
                moderatorId: [],
                moderatorRequestId: [],
                picture: picture,
                speciality: speciality
            }

            activities.push(newActivity)
            connectedUser.activities.push(newActivity.id)

            //update activities DB

            await fetch('http://localhost:4000/activities',{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({activities: activities})
            })

            //update users + connectedUser DB

            await fetch('http://localhost:4000/connectedUser',{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(connectedUser)
            })

            await fetch('http://localhost:4000/users/' + userId,{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(connectedUser)
            })

            //create new activity discussion
            const messages = await fetch('http://localhost:4000/messages',{
                method: 'GET',
                headers: { 'Content-Type': 'application/json'}
            }).then( res => res.json())
            var newDiscussionId = messages[messages.length - 1].id + 1 
            var users = []
            users.push(connectedUser.id)
            var newDiscussion = {
                id: newDiscussionId,
                type: "group",
                group: {
                    groupName: title,
                    groupPicture: picture
                },
                users: users,
                feed: []
            }        

            await fetch('http://localhost:4000/messages' ,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(newDiscussion)
            })

        }

    }
    catch(error){
        console.log(error)
    }

}

export function SaveButtonConsumer(props) {
    return (
      <AppConsumer>
        {({ setState, state }) => {
          return (
            <NavLink
              to={props.to}
              style={{ textDecoration: "none" }}
              onClick={() => {
                setState({
                  ...state,
                  user: {
                    name: props.name,
                    age: props.age,
                    location: props.location,
                  },
                });
                save(props);
              }}
            >
              <div id="save-button">Save</div>
            </NavLink>
          );
        }}
      </AppConsumer>
    );
  }
  

function SaveButton(props) {
    return <NavLink to={props.to + (props.informativeMessage ? props.informativeMessage : "")} style={{textDecoration: "none"}} onClick={ (e) => {save(e, props)}}>
            <div id="save-button">
                Save
            </div>
        </NavLink>
}

export default SaveButton;


