import React from "react";
import { NavLink } from "react-router-dom";
import '../style/InviteFriendUserTile.css'

class InviteFriendUserTile extends React.Component {

    state = {
        confirmation: 0
    }

    render(){


        return <div id="invite-friend-user-tile-background">
            <div id="invite-friend-user-tile-user-data">
                <div id="invite-friend-user-tile-user-picture">
                    {/* <NavLink to={"/ProfilePageFreindsPage?from=" + window.location.pathname.split('/').join('-') + "&id=" + this.props.user.id}> */}
                    <img src={this.props.user.profilePicture} alt='user' />
                    {/* </NavLink> */}
                </div>
                <div id="invite-friend-user-tile-user-name">
                    {this.props.user.name}
                </div>
            </div>
            <div id="invite-friend-user-tile-button-area">
                {this.state.confirmation === 0 ?
                <div id="invite-friend-user-tile-invite-button-container">
                    <div id="invite-friend-user-tile-invite-button" onClick={ () => { this.setState({...this.state, confirmation: this.state.confirmation + 1})}}>
                        Invite
                    </div>
                </div>
                :
                null}
                {this.state.confirmation === 1 ?
                <div id="exclude-user-container">
                    <div id="invite-friend-user-tile-invite-confirmation-label">
                        Are you shure to invite this user?
                    </div>
                    <div id="invite-friend-user-tile-invite-button-confirmation-button">
                        <div id="yes-invite-friend-user-tile-invite-button" onClick={ () => { this.setState({...this.state, confirmation: this.state.confirmation + 1}); this.props.inviteUser(this.props.user.id)}}>
                            Yes 
                        </div>
                        <div id="no-invite-friend-user-tile-invite-button" onClick={ () => { this.setState({...this.state, confirmation: this.state.confirmation - 1})}}>
                            No
                        </div>
                    </div>
                </div>
                :
                null}
                {this.state.confirmation === 2 ?
                <div id="user-already-invited">
                    User invited
                </div>
                :
                null}
            
                {/* {this.state.confirmation === 0?
                <div id="invite-friend-user-tile-invite-button-container">
                    <div id="invite-friend-user-tile-invite-button" onClick={ () => { this.setState({...this.state, confirmation: this.state.confirmation + 1})}}>
                        Invite
                    </div>
                </div>
                :
                this.state.confirmation === 1 ?
                <div id="exclude-user-container">
                    <div id="invite-friend-user-tile-invite-confirmation-label">
                        Are you shure to invite this user?
                    </div>
                    <div id="invite-friend-user-tile-invite-button-confirmation-button">
                        <div id="yes-invite-friend-user-tile-invite-button" onClick={ () => { this.props.inviteUser(this.props.user.id)}}>
                            Yes 
                        </div>
                        <div id="no-invite-friend-user-tile-invite-button" onClick={ () => { this.setState({...this.state, confirmation: this.state.confirmation + 1})}}>
                            No
                        </div>
                    </div>
                </div>
                :
                <div id="user-already-invited">
                    User already invited
                </div>
                } */}
            </div>
        </div>
    }
}

export default InviteFriendUserTile