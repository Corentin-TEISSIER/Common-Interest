import React from "react";
import '../style/DeleteInterestButton.css'

import iconBin from "../../src/public/icon/poubelle_black.png"



class DeleteInterestButton extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            user: this.props.user
        }
    }
    
    async componentDidMount(){
    }

    async deleteInterest(speciality){

        const user = await fetch('http://localhost:4000/connectedUser').then(res => res.json())        
        const newInterestList = user.interests.filter( item => item.speciality !== speciality);
        this.props.setUserInterestsState(newInterestList)

    }
    

    render(){

        return <button id="delete-interest-button" onClick={ () => {this.deleteInterest(this.props.speciality)}}>
                <img id="back-arrow-icon" src={ iconBin } alt="bin icon" width="15px" height="15px"></img>
            </button>
    }
}

export default DeleteInterestButton;


