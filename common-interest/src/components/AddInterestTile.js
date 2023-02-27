import React from "react";
import '../style/AddInterestTile.css'
import { NavLink } from "react-router-dom";
 
import iconPlus from '../../src/public/icon/plus_icon_white.png'

class AddInterestTile extends React.Component {

    
    setUserState(value){
        this.props.setUserState(value)
    }

    render(){

        

        return <div className="add-interest-tile-background">

            <NavLink to='/ProfilePage/NewInterestPage' style={{textDecoration: "none"}}>
            <div className="add-interest-title-background-bis">

                <div className="add-interest-icon-background">
                    <div className="add-interest-icon">
                        <img id="plus-icon" src={ iconPlus } alt="plus icon" width="60px" height="60px"/>
                    </div>
                </div>

                <div className="add-interest-label" style={{ color: 'white'}}>
                    ADD INTEREST
                </div>

            </div>
            </NavLink>

        </div>
    }
}

export default AddInterestTile;