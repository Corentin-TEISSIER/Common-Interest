import React from "react";
import '../style/InterestTile.css'
import * as icon from '../utils/interestsIconSources.js'

class InterestTileFriends extends React.Component {

    render(){
        return <div className="interest-tile-background">
            <div className="interest-title-background-bis">
                <div className="interest-icon-background">
                    <div className="interest-icon">
                        <img src={icon.getInterestImgSource(this.props.speciality)} alt="Interest Img" />
                    </div>
                </div>
                <div className="interest-speciality">
                    {this.props.speciality}
                </div>
                <div className="interest-level">
                    {this.props.level}
                </div>
            </div>
        </div>
    }
}

export default InterestTileFriends;