import React from 'react';
import '../style/MessagesPage.css'
import PlusButton from '../components/PlusButton'
import AppMenu from '../components/AppMenu';

import DiscussionTile from '../components/DiscussionTile';
import InformativeMessage from '../components/InformativeMessage';

class MessagesPage extends React.Component {


  state = {
    connectedUserId: -1,
    messages: []
  }

  componentDidMount(){
    try{
      this.getMessages()
    }
    catch(error){
      console.log(error)
    }
  }

  async getMessages(){
    const connectedUserId = await fetch('http://localhost:4000/connectedUser',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    }).then( res => res.json() ).then( data => data.id )

    const messages = await fetch('http://localhost:4000/messages',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    }).then( res => res.json() )

    // filter discussion relatives to user
    var messagesState = messages.filter( discussion => discussion.users.includes(connectedUserId))

    //order messages by unread 
    messagesState.sort( (discussion1, discussion2) => {
      var unRead1 = 0
      var unRead2 = 0
      for(let i=0; i<discussion1.feed.length; i++){
        if((!discussion1.feed[i].readers.includes(connectedUserId)) && (discussion1.feed[i].sender !== connectedUserId)){
          unRead1++
        }
      } 
      for(let i=0; i<discussion2.feed.length; i++){
        if((!discussion2.feed[i].readers.includes(connectedUserId)) && (discussion2.feed[i].sender !== connectedUserId)){
          unRead2++
        }
      }
      if(unRead1 < unRead2){
        return 1
      }
      if(unRead1 === unRead2){
        return 0
      }
      else{
        return -1
      }
    })

    //set state
    this.setState({connectedUserId: connectedUserId, messages: messagesState})


  }

  async messagesNowRead(discussionId){
    //update db
    const messages = await fetch('http://localhost:4000/messages', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    }).then( res => res.json() )

    var index 
    var newDiscussion
    for(let i=0; i<messages.length; i++){
      if(messages[i].id === discussionId){
        index = i
        newDiscussion = messages[i]
      }
    }

    for(let k=0; k<newDiscussion.feed.length; k++){   
      if((newDiscussion.feed[k].readers.includes(this.state.connectedUserId) === false) && (newDiscussion.feed[k].sender !== this.state.connectedUserId)) {
        newDiscussion.feed[k].readers.push(this.state.connectedUserId)
      }
    }


    await fetch('http://localhost:4000/messages/' + index, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(newDiscussion)
    })


    //update state
    this.setState({messages: messages})

  }


  render() {  


      return    <div>
                  <div id="messages-page-background">
                      <PlusButton to="/MessagesPage/NewMessage" />
                      <div id="message-page-scrollable-area">
                        {this.state.messages.length === 0 
                        ?
                        <div id="no-messages-info">
                          No message for the moment. <br/> Click the '+' button to create new discussion
                        </div>
                        :
                        this.state.messages.map( discussion => (
                          <DiscussionTile discussion={discussion} connectedUserId={this.state.connectedUserId} messagesNowRead={(discussionId) => { this.messagesNowRead(discussionId) }}/>
                        ))
                        }
                      </div>
                  </div>

                  <InformativeMessage message={new URLSearchParams(window.location.search).get("informativeMessage")}/>

                  <div>
                    <AppMenu icon='messages'/>
                  </div>
                </div>
  }
}

export default MessagesPage;