import React from "react";
import '../style/ModerationAcceptanceTile.css'

class ModerationAcceptanceTile extends React.Component {

    state = {
        userId: this.props.id,
        userPicture: '',
        userName: ''
    }

    componentDidMount(){
        try{
            this.getUserData()
        }catch(error){
            console.log(error)
        }
    }

    async getUserData(){
        await fetch('http://localhost:4000/users/'+ this.props.id, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        }).then( res => res.json() ).then( data => {
            this.setState({
                ...this.state,
                userId: data.id,
                userPicture: data.profilePicture,
                userName: data.name
            })
        })
    }


    render(){

        return <div id="moderation-acceptance-tile-container">
            <div id="moderation-acceptance-tile-user-data">
                <img id="moderation-acceptance-tile-user-image" src={this.state.userPicture} alt="user" />
                <div id="moderation-acceptance-tile-user-name">
                    {this.state.userName}
                </div>
            </div>
            <div id="moderation-acceptance-tile-buttons">
                <div className="moderation-acceptance-tile-button" onClick={ () => { this.props.accepteUserModerationRequest(this.state.userId, this.props.activityId) }}>
                    Accepte
                </div>
                <div className="moderation-acceptance-tile-button" onClick={ () => { this.props.deleteUserModerationRequest(this.state.userId, this.props.activityId) }}>
                    Delete
                </div>
            </div>
            
        </div>

    }
}

export default ModerationAcceptanceTile