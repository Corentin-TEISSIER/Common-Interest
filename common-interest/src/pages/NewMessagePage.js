import React from 'react';
import { NavLink } from 'react-router-dom';
import AppMenu from '../components/AppMenu';
import BackButton from '../components/BackButton';
import '../style/NewMessagePage.css'

import { photoGreyIcon } from '../utils/interestsIconSources';

class AddedFriend extends React.Component {


  render(){

    return <div id="added-friend-background">
      <div id="added-friend_name">
        {this.props.user.name}
      </div>
      <div id="added-friend-delete-button-container" >
        <div id="added-friend-delete-button" onClick={() => {this.props.deleteUser(this.props.user)}}>
          x
        </div>
      </div>
    </div>
  }
}

class NewMessageFriendTile extends React.Component {


  render(){

    return <div id="new-message-friend-tile-background">
      <div id="new-message-friend-tile-picture">
        <img src={this.props.user.profilePicture} alt={this.props.user.name}/>
      </div>
      <div id="new-message-friend-tile-name">
        {this.props.user.name}
      </div>
      <div id="new-message-friend-tile-add-button-container"> 
        <div id="new-message-friend-tile-add-button" onClick={ () => {this.props.addUser(this.props.user)}}>
          +
        </div>
      </div>
    </div>
  }
}

class NewMessagePage extends React.Component { 

  state = {
    connectedUserId: -1, 
    friendsList: [],
    invitedToJoin: [],
    newMessage: "",
    nextDiscussionId: -1,
    discussionType: "",
    groupName: "",
    groupPicture: "",
    file: "",
    error: ""
  }

  componentDidMount(){
    try{
      this.getFriendsList()
      this.getNextId()
    }
    catch(error){
      console.log(error)
    }
  }

  compare( a, b ) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  }

  async getFriendsList(){
    var friendsList = []
    var connectedUser = await fetch('http://localhost:4000/connectedUser',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    }).then(res => res.json())

    this.setState({connectedUserId: connectedUser.id})

    var users = await fetch('http://localhost:4000/users',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    }).then(res => res.json())

    for(let i=0; i<connectedUser.friends.length; i++){
      for(let k=0; k<users.length; k++){
        if(users[k].id === connectedUser.friends[i]){
          friendsList.push(users[k])
        }
      }
    }

    friendsList.sort(this.compare)


    this.setState({friendsList: friendsList})
  }

  async getNextId(){
    const messages = await fetch('http://localhost:4000/messages',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    }).then(res => res.json())
    const messagesLength = messages.length    
    const nextId = messages[messagesLength - 1].id + 1
    this.setState({nextDiscussionId: nextId})
  }

  addFriend(user){
    var newInvitedList = this.state.invitedToJoin
    newInvitedList.push(user)
    newInvitedList.sort(this.compare)
    this.setState({invitedToJoin: newInvitedList})

    var newFriendsList = this.state.friendsList.filter(userChecked => userChecked.id !== user.id)
    newFriendsList.sort(this.compare)
    this.setState({friendsList: newFriendsList})

    if(newFriendsList.length === 1){
      this.setState({discussionType: "direct"})
    }
    if(newFriendsList.length === 0){
      this.setState({discussionType: ""})
    }
    if(newFriendsList.length > 1){
      this.setState({discussionType: "group"})
    }

  }

  deleteFriend(user){
    var newInvitedList = this.state.invitedToJoin.filter( userChecked => userChecked.id !== user.id)
    newInvitedList.sort(this.compare)
    this.setState({invitedToJoin: newInvitedList})

    var newFriendsList = this.state.friendsList
    newFriendsList.push(user)
    newFriendsList.sort(this.compare)
    this.setState({friendsList: newFriendsList})

    if(newFriendsList.length === 1){
      this.setState({discussionType: "direct"})
    }
    if(newFriendsList.length === 0){
      this.setState({discussionType: ""})
    }
    if(newFriendsList.length > 1){
      this.setState({discussionType: "group"})
    }
  }

  async sendMessage(e){
    // control
    if((this.state.newMessage === "") || (this.state.invitedToJoin.length === 0)){
      e.preventDefault()
    }
    else{
      if(this.state.invitedToJoin.length > 1 && ((this.state.groupName === "") ||(this.state.groupPicture === ""))){
        e.preventDefault()
      }
      else{
        //create discussion in messages DB
        var type = this.state.invitedToJoin.length === 1 ? "direct" : "group"
        var group = type === "direct" ? {} : {groupName: this.state.groupName, groupPicture: this.state.groupPicture}
        var users = []
        users.push(this.state.connectedUserId)
        for(let i=0; i<this.state.invitedToJoin.length; i++){
          users.push(this.state.invitedToJoin[i].id)
        }
        var feed = []
        feed.push({
          sender: this.state.connectedUserId,
          content: this.state.newMessage,
          readers: []
        })

        var newDiscussion = {
          id: this.state.nextDiscussionId,
          type: type,
          group: group,
          users: users,
          feed: feed
          }
        
          console.log(newDiscussion)

        await fetch('http://localhost:4000/messages' ,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(newDiscussion)
          })
      }
    }
  }

  handlePictureChange = (e) => {
    const file = e.target.files[0];
    this.setState({file: file})

    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({groupPicture: reader.result})
    };
    reader.readAsDataURL(file);
  }

  verifyData(){
    if((this.state.newMessage === "") || (this.state.invitedToJoin.length === 0)){
      this.setState({error: "Please fill in all the fields"})
      setTimeout( () => {this.setState({error: ""})}, 3000)
    }
    else{
      if(this.state.invitedToJoin.length > 1 && ((this.state.groupName === "") ||(this.state.groupPicture === ""))){
        this.setState({error: "Please fill in all the fields"})
        setTimeout( () => {this.setState({error: ""})}, 3000)
      }
    }

  }

  render() {
    
    return    <div>
                <div id="new-message-page-background">
                    <BackButton to='/MessagesPage/' />    
                    <div id="new-message-page-title">
                      New Chat
                    </div>
                    <div id="new-message-page-selected-friends"> 
                      {this.state.invitedToJoin.length !== 0 ?
                        this.state.invitedToJoin.map( friend => (
                        <AddedFriend user={friend} deleteUser={(user) => {this.deleteFriend(user)}}/>
                      ))
                      :
                      <div id="new-message-add-user-info">add users ...</div>
                      }
                    </div>
                    <div id="new-message-page-friends-list-scrollable-area">
                      {this.state.friendsList.map( friend => (
                        <NewMessageFriendTile user={friend} addUser={(user) => {this.addFriend(user)}} />
                      ))}
                    </div>
                    
                    <div id="new-message-page-first-message">
                      {this.state.error === '' ?
                      null
                      :
                      <div className="create-activity-error-message">{this.state.error}</div>
                      }
                      {this.state.invitedToJoin.length > 1 ?
                      <div id="new-message-page-group-data">
                        <input class="fillin-area" id="new-message-fillin-area-bis" placeholder="group name ..." name="discussion-page-group-name" value={this.state.groupName} onChange={e => this.setState({groupName: e.target.value})}/>
                        
                        <div>
                          <div className="new-message-page-group-picture-parent-div">
                            <div id="new-message-page-group-picture-fake-input" onClick={ () => { document.getElementById('new-message-page-group-picture-input').click() } }>
                              {this.state.groupPicture === ""
                              ?
                              <img id="new-message-group-no-image" src={photoGreyIcon} alt="" onClick={ () => { document.getElementById('new-message-page-group-picture-input').click() } } />
                              :
                              <img id="new-message-group-image-selected" src={this.state.groupPicture} alt="" onClick={ () => { document.getElementById('new-message-page-group-picture-input').click() } } />}
                              <input id="new-message-page-group-picture-input" type="file" onChange={this.handlePictureChange} />
                            </div>
                          </div>
                        </div>
                      </div>
                      :
                      null
                      }
                      <div id="new-message-page-new-message">
                        <input class="fillin-area" id="new-message-fillin-area-bis" placeholder="message ..." name="discussion-page-new-message" value={this.state.newMessage} onChange={e => this.setState({newMessage: e.target.value})}/>
                        <NavLink to={`/MessagesPage/DiscussionPage?id=${this.state.nextDiscussionId}`} 
                                style={{textDecoration: "none"}}
                                onClick={ (e) => {this.sendMessage(e)}}>
                          <div className="new-message-send-new-message-button" id="send-new-message-button" onMouseEnter={ () => {this.verifyData()} }>
                            Send
                          </div>
                        </NavLink>
                      </div>
                    </div>
                </div>
                <div>
                  <AppMenu icon='messages'/>
                </div>
              </div>
  }

}

export default NewMessagePage;