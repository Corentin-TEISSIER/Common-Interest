import React from "react";
import '../style/ProfileUserData.css'
import ProfileInterestDataFriends from "./ProfileInterestDataFriends";


function ProfileUserDataFriends(props) { 

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
            <div id="interest-title">
                INTERESTS
            </div>
            <div id="interests-list">
                <ProfileInterestDataFriends user={props.user} setUserInterestsState={props.setUserInterestsState} />
            </div>
        </div>
    </div>
}

export default ProfileUserDataFriends;