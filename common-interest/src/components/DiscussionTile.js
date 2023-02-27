import React from "react";
import { NavLink } from "react-router-dom";
import "../style/DiscussionTile.css";


class DiscussionTile extends React.Component {

    state = {
        user: "",
        group: ""
    }

    componentDidMount(){
        if(this.props.discussion.type === "direct"){
            const userId = this.props.discussion.users.filter( id => id !== this.props.connectedUserId)[0]
            try{
                this.getUser(userId)
            }
            catch(error){
                console.log(error)
            }
            
        }
        if(this.props.discussion.type === "group"){
            this.setState({group: this.props.discussion.group})

        }

    }

    async getUser(userId){
        try{
            await fetch('http://localhost:4000/users/' + userId,{
                method: 'GET',
                headers: { 'Content-Type': 'application/json'}
                }).then( res => res.json() ).then( data => this.setState({user: data}))
        }
        catch(error){
            console.log(error)
        }
    }



    UnreadPellet = () => {

        var counter = 0;
        for(let i=0; i<this.props.discussion.feed.length; i++){
            if(!this.props.discussion.feed[i].readers.includes(this.props.connectedUserId) && this.props.discussion.feed[i].sender !== this.props.connectedUserId){
                console.log(this.props.connectedUserId)
                counter++;
            }
        }

        if(counter === 0){
            return null
        }
        else{            
            return <div id="pellet-background">
                {counter}
            </div>
        }
    }

    

    render(){


        return <NavLink to={`/MessagesPage/DiscussionPage?id=${this.props.discussion.id}`} style={{ textDecoration: "none" }} onClick={() => {this.props.messagesNowRead(this.props.discussion.id) }}> 
            <div id="discussion-tile-background">
                <div id="discussion-tile-discussion-picture">
                    {this.props.discussion.type === "direct" 
                    ?
                    <img src={this.state.user.profilePicture} alt="user" />
                    :
                    // <img src={this.state.group.groupPicture} alt="group" />
                    <img src={this.props.discussion.group.groupPicture} alt="group" />
                    }
                </div>
                <div id="discussion-tile-discussion-title">
                    {this.props.discussion.type === "direct" 
                    ?
                    <div id="discussion-title">{this.state.user.name}</div>
                    :
                    <div id="discussion-title">{this.state.group.groupName}</div>
                    }
                </div>
                <div id="unread-pellet-container">
                    <this.UnreadPellet />
                </div>
            </div>
        </NavLink>
    }

}


export default DiscussionTile