import React from 'react';
import '../style/AppMenuButton.css'

import iconFriendsBlack from '../../src/public/icon/friends_black.png'
import iconFriendsGrey from '../../src/public/icon/friends_grey.png'
import iconMessagesBlack from '../../src/public/icon/messages_black.png'
import iconMessagesGrey from '../../src/public/icon/messages_grey.png'
import iconActivitiesBlack from '../../src/public/icon/origami_black.png'
import iconActivitiesGrey from '../../src/public/icon/origami_grey.png'
import iconProfileBlack from '../../src/public/icon/profile_black.png'
import iconProfileGrey from '../../src/public/icon/profile_grey.png'


class MessagesPellet extends React.Component {

    state = {
        numberOfUnread: 0
    }

    componentDidMount(){
        try{
            this.getNumberOfUnread()
        }
        catch(error){
            console.log(error)
        }
    }

    async getNumberOfUnread(){
        const connectedUserId = await fetch('http://localhost:4000/connectedUser').then(res => res.json()).then(data => data.id)
        const messages = await fetch('http://localhost:4000/messages').then(res => res.json())

        var counter = 0
        for(let i=0; i<messages.length; i++){
            if(messages[i].users.includes(connectedUserId)){
                var hasUnread = false
                for(let k=0; k<messages[i].feed.length; k++){
                    if((!messages[i].feed[k].readers.includes(connectedUserId)) && (messages[i].feed[k].sender !== connectedUserId)){
                        hasUnread = true
                    }
                }
                if(hasUnread === true){
                    counter++
                }
            }
        }


        this.setState({numberOfUnread: counter})

        if(counter === 0){
            document.getElementById("messages-pellet").style.display = "none"
        }
        else{
            document.getElementById("messages-pellet").style.display = "flex"
        }
    }

    render(){
        return <div id="messages-pellet">
            {this.state.numberOfUnread === 0 ?
            null
            :
            this.state.numberOfUnread
            }
        </div>
    }
}


class FriendsPellet extends React.Component {

    state = {
        numberOfRequest: 0
    }

    componentDidMount(){
        try{
            this.getNumberOfRequest()
        }
        catch(error){
            console.log(error)
        }
    }

    async getNumberOfRequest(){

        //TO DO : COMPUTING NUMBER OF FRIEND REQUESTS TO DISPLAY GOOD PELLET

        var counter = 10

        await fetch("http://localhost:4000/connectedUser", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                counter = data.request.length
                this.setState({numberOfRequest: data.request.length})
            })

        if(counter === 0){
            document.getElementById("friends-pellet").style.display = "none"
        }
        else{
            document.getElementById("friends-pellet").style.display = "flex"
        }
    }

    render(){
        return <div id="friends-pellet">
            {this.state.numberOfRequest === 0 ?
            null
            :
            this.state.numberOfRequest
            }
        </div>
    }
}



class AppMenuButton extends React.Component {

  render() {
    switch (this.props.id){
        
        case "friends":
            return  <div className="menu-button" id="left-button">
                <div id="friends-icon-container">
                    <img id="friends-icon" src={(this.props.icon === "friends")?iconFriendsGrey : iconFriendsBlack} alt="friends icon" width="50px" height="50px"></img>
                    <FriendsPellet style={{textDecoration: "none"}}/>
                </div>
            </div>

        case "messages":
            return  <div className="menu-button" id="messages-menu-button">
                <div id="messages-icon-container">
                    <img id="messages-icon" src={(this.props.icon === "messages")? iconMessagesGrey : iconMessagesBlack} alt="messages icon" width="50px" height="50px"></img>
                    <MessagesPellet style={{textDecoration: "none"}}/>
                </div>
            </div>

        case "activities":
            return  <div className="menu-button">
                <img id="origami-icon" src={(this.props.icon === "activities")? iconActivitiesGrey : iconActivitiesBlack} alt="activities icon" width="50px" height="50px"></img>
            </div>

        case "my-activities":
            return  <div className="menu-button">
                <img id="profile-icon-ma" src={(this.props.icon === "my-activities")? iconProfileGrey : iconProfileBlack} alt="profile icon" width="20px" height="20px"></img>
                <img id="origami-icon-ma" src={(this.props.icon === "my-activities")? iconActivitiesGrey : iconActivitiesBlack} alt="origami icon" width="20px" height="20px"></img>
            </div>

        case "profile":
            return  <div className="menu-button" id="right-button">
                <img id="profile-icon" src={(this.props.icon === "profile")? iconProfileGrey : iconProfileBlack} alt="profile icon" width="50px" height="50px"></img>
            </div>

        default:
            return <div>#ERROR</div>
    }

    
  }

}

export default AppMenuButton;