import React from "react";
import '../style/ModerationExcludeUserTile.css'

class ModerationExcludeUserTile extends React.Component{

    state = {
        userId: this.props.id,
        userPicture: '',
        userName: '',
        confirmation: false
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

        return <div id="moderation-exclude-user-tile-container">
            <div id="moderation-exclude-user-tile-user-data">
                <img id="moderation-exclude-user-tile-user-image" src={this.state.userPicture} alt="user" />
                <div id="moderation-exclude-user-tile-user-name">
                    {this.state.userName}
                </div>
            </div>
            <div id="moderation-exclude-user-tile-buttons">
                {!this.state.confirmation?
                <div id="exclude-user-container">
                    <div id="exclude-user-label" >
                        Exclude user from activity:
                    </div>
                    <div id="exlude-user-button" onClick={ () => { this.setState({...this.state, confirmation: !this.state.confirmation})}}>
                        Exclude
                    </div>
                </div>
                :
                <div id="exclude-user-container">
                    <div id="exclude-user-confirmation-label">
                        Are you shure?
                    </div>
                    <div id="exclude-user-confirmation-button">
                        <div id="exlude-user-button" onClick={ () => { this.props.excludeUserFromActivity(this.props.id, this.props.activityId)}}>
                            Exclude 
                        </div>
                        <div id="cancel-exlude-user-button" onClick={ () => { this.setState({...this.state, confirmation: !this.state.confirmation})}}>
                            Cancel
                        </div>
                    </div>
                </div>
                }
            </div>
        </div>
    }
}

export default ModerationExcludeUserTile