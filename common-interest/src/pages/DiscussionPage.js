import React from "react";
import "../style/DiscussionPage.css"
import BackButton from "../components/BackButton"

import AppMenu from "../components/AppMenu";
import { NavLink } from "react-router-dom";

class UserPictureMini extends React.Component {
    state = {
        picture: ""
    }

    componentDidMount(){
        try{
            this.getProfilePicture()
        }
        catch(error){
            console.log(error)
        }
    }

    async getProfilePicture(){
        const picture = await fetch('http://localhost:4000/users/' + this.props.userId,{
                method: 'GET',
                headers: { 'Content-Type': 'application/json'}
              }).then( res => res.json() ).then(data => data.profilePicture)
        
              this.setState({picture: picture})
    }

    render(){

        return <img className="mini-profile-picture" src={this.state.picture} alt="user" />
    }
}

class DiscussionPage extends React.Component {

    state = {
        discussion: {},
        picture: "",
        userName: "",
        connectedUserId: -1,
        newMessage: "",
        linkDiscussionInformation: ""
    }

    componentDidMount(){
        try{
            this.getDiscussionAndPicture()
        }
        catch(error){
            console.log(error)
        }

        //scroll bot
        var scrollableArea = document.getElementById("discussion-page-messages-scrollable-area")
        if(scrollableArea !== null){
            scrollableArea.scrollTop = scrollableArea.scrollHeight
        }
    }

    componentDidUpdate(){
        //scroll bot
        var scrollableArea = document.getElementById("discussion-page-messages-scrollable-area")
        if(scrollableArea !== null){
            scrollableArea.scrollTop = scrollableArea.scrollHeight
        }
    }

    async getDiscussionAndPicture(){
        let urlParams = new URLSearchParams(window.location.search);
        const discussionId = urlParams.get("id");
        
        const discussion = await fetch('http://localhost:4000/messages?id='+ discussionId,{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
          }).then( res => res.json() ).then(data => data[0])

        this.setState({discussion: discussion})

        if( discussion.type === "direct"){
            const connectedUserId = await fetch('http://localhost:4000/connectedUser',{
                method: 'GET',
                headers: { 'Content-Type': 'application/json'}
              }).then( res => res.json() ).then(data => data.id)

            this.setState({connectedUserId: connectedUserId})
            const userId = discussion.users.filter( id => id !== connectedUserId)[0]

            const user = await fetch('http://localhost:4000/users/' + userId,{
                method: 'GET',
                headers: { 'Content-Type': 'application/json'}
              }).then( res => res.json() )
            
            this.setState({picture: user.profilePicture, userName: user.name}) 
            this.setState({linkDiscussionInformation: "/ProfilePageFreindsPage?from=" + window.location.pathname.split('/').join('-') +">id_"+ discussionId + "&id=" + user.id})    
        }
        else{
            const connectedUserId = await fetch('http://localhost:4000/connectedUser',{
                method: 'GET',
                headers: { 'Content-Type': 'application/json'}
              }).then( res => res.json() ).then(data => data.id)

            this.setState({connectedUserId: connectedUserId})

            this.setState({picture: discussion.group.groupPicture})
            this.setState({linkDiscussionInformation: `/MessagesPage/DiscussionPage/MessagesGroupInformation?id=${discussion.id}`})
        }

    }

    async sendMessage(){

        if(this.state.newMessage !== ""){
        //update db
            const messages = await fetch('http://localhost:4000/messages',{
                method: 'GET',
                headers: { 'Content-Type': 'application/json'}
            }).then( res => res.json() )
            
            var index
            for(let i=0; i<messages.length; i++){
                if(messages[i].id === this.state.discussion.id){
                    index = i
                }
            }

            var discussion = this.state.discussion

            discussion.feed.push({
                sender: this.state.connectedUserId,
                content: this.state.newMessage,
                readers: []
            })

            for(let k=0; k<discussion.feed.length; k++){
                if((discussion.feed[k].sender !== this.state.connectedUserId) && (discussion.feed[k].readers.includes(this.state.connectedUserId) === false)){
                    discussion.feed[k].readers.push(this.state.connectedUserId)
                }
            }

            await fetch('http://localhost:4000/messages/' + index,{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(discussion)
            })

            //update state
            this.setState({discussion: discussion})
            this.setState({newMessage: ""})
        }
    }



    render() {

        return <div>
            <BackButton to="/MessagesPage"/>
            {this.state.discussion.type === undefined? 
            <div id="discussion-page-background">
                <div>
                    Messages loading ...
                </div>
            </div>
            :
            <div id="discussion-page-background">

                <NavLink to={this.state.linkDiscussionInformation} >
                    <div id="discussion-page-discussion-data">
                        <img src={this.state.picture} alt="user|group"/>
                        <div id="discussion-page-discussion-name-container">
                            {this.state.discussion.type === "direct"
                            ?
                            <div id="discussion-page-discussion-name">{this.state.userName}</div>
                            :
                            <div id="discussion-page-discussion-name">{this.state.discussion.group.groupName}</div>
                        }
                        </div>
                    </div>
                </NavLink>

                <div id="discussion-page-messages-scrollable-area">
                    {this.state.discussion.feed.length === 0 ?
                    <div id="no-message-in-discussion-info">No messages for the moment.<br /> Write the first one and send it!</div>
                    :
                    this.state.discussion.feed.map( message => (
                        message.sender === this.state.connectedUserId ?
                        <div className="message-sent-container">
                            <div className="message-sent">
                                {message.content}
                            </div>
                        </div>
                        :
                        <div className="message-received-container-container">
                        <UserPictureMini userId={message.sender} />
                            <div className="message-received-container">
                                <div className="message-received">
                                    {message.content}
                                </div>
                            </div>
                        </div>
                    ))
                    }
                </div>

                <div id="discussion-page-write-message-area">
                    <input class="fillin-area" id="new-message-fillin-area" placeholder="type here ..." name="discussion-page-new-message" value={this.state.newMessage} onChange={e => this.setState({newMessage: e.target.value})}/>
                    <div id="send-new-message-button" onClick={ () => {this.sendMessage()} }>Send</div>    
                </div>

            </div>
            }
            <div>
                <AppMenu icon='messages'/>
            </div>
        </div>
    }
}

export default DiscussionPage