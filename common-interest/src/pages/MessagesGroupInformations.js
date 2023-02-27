import React from "react";
import AppMenu from "../components/AppMenu";
import BackButton from "../components/BackButton";
import { messagesSmall } from "../utils/interestsIconSources";

import "../style/MessagesGroupInformations.css"
import { NavLink } from "react-router-dom";

export class SendMessageTile extends React.Component {

    state = {
        sendMessageLink: "",
        newDiscussionToCreateIf: {},
        userId: -1,
        connectedUserId: -1
    }

    componentDidMount(){
        try{
            let params = new URLSearchParams(window.location.search)
            let userId = +params.get("id")
            this.setState({userId: userId})

            this.setConnectedUserId()

            console.log(this.props.user)
            this.getSendMessageLink(this.props.user)
            
        }
        catch(error){
            console.log(error)
        }
    }

    async setConnectedUserId(){
        await fetch('http://localhost:4000/connectedUser').then(res => res.json()).then(data => this.setState({connectedUserId: data.id}))
    }

    async getSendMessageLink(user){

        console.log('user:')
        console.log(user)
        const messages = await fetch('http://localhost:4000/messages').then(res => res.json())
        const connectedUser = await fetch('http://localhost:4000/connectedUser').then(res => res.json())
        if(user.name === undefined){
            user = await fetch('http://localhost:4000/users/' + this.state.userId).then(res => res.json())
        } 
        console.log(user)

        var discussionFound = false
        for(let i=0; i<messages.length; i++){
            if(messages[i].users.length === 2 && messages[i].users.includes(connectedUser.id) && messages[i].users.includes(user.id)){
                discussionFound = true
                this.setState({sendMessageLink: `/MessagesPage/DiscussionPage?id=${messages[i].id}`})
            }
        }

        console.log(messages)
        if(discussionFound === false){
            this.setState({newDiscussionToCreateIf:{
                id: messages[messages.length - 1].id + 1,
                type: "direct",
                group: {},
                users: [connectedUser.id, user.id],
                feed: []
            }})
            this.setState({sendMessageLink: `/MessagesPage/DiscussionPage?id=${messages[messages.length - 1].id + 1}`})
        }


    }

    async contactUser(){
        console.log(this.state.newDiscussionToCreateIf)
        if(this.state.newDiscussionToCreateIf.type !== undefined){

            var newDiscussionToCreateIf = {...this.state.newDiscussionToCreateIf}

            if(newDiscussionToCreateIf.users.includes(undefined)){
                var newUserList = [this.state.connectedUserId, this.state.userId]
                console.log(newUserList)
                newDiscussionToCreateIf.users = newUserList
            }

            await fetch('http://localhost:4000/messages' ,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(newDiscussionToCreateIf)
            })
        }
    }


    render(){


        return <NavLink to={this.state.sendMessageLink} style={{textDecoration: "none"}} onClick={ (e) => { this.contactUser(this.props.user) }} >
            <div className="send-direct-message-to-group-member">
                <img src={messagesSmall} alt="" />
            </div>
        </NavLink>
    }
}

class MessagesGroupInformations extends React.Component {

    state = {
        connectedUserId: -1,
        index: -1,
        id: -1,
        picture: "",
        groupName: "",
        members: [],

        quitConfirmation: false
    }

    componentDidMount(){
        try{
            this.getGroupData()
        }
        catch(error){
            console.log(error)
        }
    }

    async getGroupData(){
        let connectedUserId = await fetch('http://localhost:4000/connectedUser').then(res => res.json()).then(data => data.id)
        this.setState({connectedUserId: connectedUserId})

        let urlParams = new URLSearchParams(window.location.search);
        const discussionId = urlParams.get("id");

        var discussion = {}
        const messages = await fetch('http://localhost:4000/messages').then(res => res.json())

        for(let i=0; i<messages.length; i++){
            if(messages[i].id === +discussionId){
                this.setState({index: i})
                discussion = messages[i]
            }
        }
        var members = discussion.users.filter(userId => userId !== connectedUserId)
        this.setState({
            id: discussion.id,
            picture: discussion.group.groupPicture,
            groupName: discussion.group.groupName,
        })

        const users = await fetch('http://localhost:4000/users').then(res => res.json())
        var membersComplete = []
        for(let k=0; k<members.length; k++){
            for(let i=0; i<users.length; i++){
                if(users[i].id === members[k]){
                    membersComplete.push(users[i])
                }
            }
        }
        membersComplete.sort(function(a, b){
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) //sort string ascending
             return -1;
            if (nameA > nameB)
             return 1;
            return 0; //default return value (no sorting)
        });

        this.setState({members: membersComplete})
    }

    quitGroupConfirmation(){
        this.setState({quitConfirmation: true})
    }

    cancel(){
        this.setState({quitConfirmation: false})
    }

    async quitGroup(){
        const discussion = await fetch('http://localhost:4000/messages?id=' + this.state.id).then(res => res.json()).then(data => data[0])

        discussion.users = discussion.users.filter( userId => userId !== this.state.connectedUserId )

        //update messages db
        await fetch('http://localhost:4000/messages/' + this.state.index,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(discussion)
        })

    }


    render() {

        return <div id="messages-group-informations-background">

                    <BackButton to={`/MessagesPage/DiscussionPage?id=${this.state.id}`} />

                    <div id="div-group-picture" >
                      <div id='group-picture-background'>
                        <img id="modify-group-picture-img" src={this.state.picture} alt=""  />
                      </div>
                    </div>

                    <div id="messages-group-informations-group-name">
                        {this.state.groupName}
                    </div>

                    <div id="messages-group-informations-group-members-container"> 
                        <div id="messages-group-informations-group-members-scrollable-area"> 
                            {this.state.members.map(user => (
                                <div className="group-member-tile">
                                    <NavLink to={`/ProfilePageFreindsPage?from=${window.location.pathname.split('/').join('-')}>id_${this.state.id}&id=${user.id}`} style={{textDecoration: "none"}} >
                                    <div className="group-member-picture">
                                        <img src={user.profilePicture} alt="" />
                                    </div>
                                    <div className="group-member-name">
                                        {user.name}
                                    </div>
                                    </NavLink>
                                    <SendMessageTile user={user}/>
                                </div>
                            ))

                            }
                        </div>  
                    </div>
                    
                    <div id="quit-group-button-container" onClick={() => {this.quitGroupConfirmation()}}>
                        Quit Group
                    </div>

                    {this.state.quitConfirmation === true ?
                    <div id="quit-discussion-message-info">
                        <div id="quit-discussion-message">
                            You are about to permanently leave the conversation. Are you sure of your choice? 
                        </div>
                        <div id="quit-discussion-button-div">
                            <div className="quit-discussion-cancel-button" onClick={() => {this.cancel()} }>
                                Cancel
                            </div>
                            <NavLink id="new-direct-message-navlink" to='/MessagesPage?informativeMessage=Conversation%20left' style={{textDecoration: "none"}} onClick={ () => { this.quitGroup() }}>
                                <div className="quit-discussion-cancel-button" >
                                    Quit
                                </div>
                            </NavLink>
                        </div>
                    </div>
                    :
                    null
                    }

                    <div>
                        <AppMenu icon="messages"/>
                    </div>

        </div>
    }
}

export default MessagesGroupInformations