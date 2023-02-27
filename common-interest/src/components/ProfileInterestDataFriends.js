import React from "react";
import "../style/ProfileInterestData.css";
import InterestTile from "./InterestTile";
import AddInterestTile from "./AddInterestTile";
import { orderInterestsList } from "../utils/interestFactors.js";
import avatar from "../public/icon/avatar.png";
import InterestTileFriends from "./InterestTileFriends";

class ProfileInterestDataFriends extends React.Component {
 
  render(){

    var major = []
    var minor = [] 

    orderInterestsList(this.props.user.interests)

    if(this.props.user.interests.length % 2 === 0){
        major = this.props.user.interests.slice()
    }else{
        major = this.props.user.interests.slice(0, this.props.user.interests.length-1)
        minor = this.props.user.interests.slice(this.props.user.interests.length-1, this.props.user.interests.length)
    }

    var majorDoublet = []

    for(let i=0; i<major.length/2; i++){  
        majorDoublet[i] = {
            left: major[2*i],
            right: major[2*i+1]
        }
    }

    return <div className="profile-interest-data-background">
        <div className="interests-major-part">
            {majorDoublet.map( interestDoublet => (
                <div className="major-line-container">
                    <InterestTileFriends speciality={interestDoublet.left.speciality} level={interestDoublet.left.level} user={this.props.user}  setUserInterestsState={this.props.setUserInterestsState}/>
                    <InterestTileFriends speciality={interestDoublet.right.speciality} level={interestDoublet.right.level} user={this.props.user}  setUserInterestsState={this.props.setUserInterestsState}/>
                </div>
            ))}
        </div>
        <div className="profile-user-interests-last-line">
            <div className="interests-minor-part">
                {minor.map( interest => (
                    <InterestTileFriends speciality={interest.speciality} level={interest.level} user={this.props.user} setUserInterestsState={this.props.setUserInterestsState}/>
                ))}
            </div>
        </div>
        

    </div>
}
}

export default ProfileInterestDataFriends;
