import React from "react";
import '../style/ProfileUserData.css'
import ProfileInterestData from "./ProfileInterestData.js"; 
import { useState } from "react";


function ProfileUserData(props) { 

    const [deletion, setDeletion] = useState(true)

    function toggleDeletion(){
        var tamp = !deletion
        setDeletion(tamp)
        switch(tamp){
            case true:
                var collection = document.getElementsByClassName('delete-interest-button-container')
                for(let i=0; i<collection.length; i++){
                    collection[i].style.display = "none"
                }
                break

            case false:
                var collection = document.getElementsByClassName('delete-interest-button-container')
                for(let i=0; i<collection.length; i++){
                    collection[i].style.display = "flex"
                }
                break

            default:
                break
        }
    }

    return <div id="data-background">
        <div id="macro">
            <div id="name-and-age">
                <div id="name">
                    {props.user.name}
                </div>
                <div id="age">
                    {props.user.age}
                </div>
            </div>
            <div id="location">
                {props.user.location}
            </div>
        </div>
        <div id="interests">
            <div id="interest-title-container"> 
                <div id="interest-title">
                    INTERESTS
                </div>

                {!deletion?
                <div id="delete-profile-interest-toggler" onClick={() => {toggleDeletion()}} >Ok</div>
                :
                <div id="delete-profile-interest-toggler" onClick={() => {toggleDeletion()}} >Modify</div>
                }    
            </div>
            <div id="interests-list">
                <ProfileInterestData user={props.user} setUserInterestsState={props.setUserInterestsState} />
            </div>
        </div>
    </div>
}

export default ProfileUserData;