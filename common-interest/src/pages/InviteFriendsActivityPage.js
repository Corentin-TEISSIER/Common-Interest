import React from 'react'
import '../style/InviteFriendsActivityPage.css'
import BackButton from '../components/BackButton'
import AppMenu from '../components/AppMenu'

import InviteFriendUserTile from '../components/InviteFriendUserTile.js'


class InviteFriendsActivityPage extends React.Component {

    state = {
        friendsWithInterests: [],
        otherFriends: [],
        activityId: -1,
        path: ""
    }

    componentDidMount(){
        try{
            this.setComponentInitialState()
        }
        catch(error){
            console.log(error)
        }
    }


    async setComponentInitialState(){
        //get connectedUser friends + activityId + path
        let params = new URLSearchParams(window.location.search)
        var activityId = +params.get("id")
        var path = params.get("from").split('-').join('/')

        var connectedUserFriendIdList = []
        


        await fetch('http://localhost:4000/connectedUser',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        }).then(response => response.json())
          .then( data => {
              connectedUserFriendIdList = data.friends 
          })


        

        const users = await fetch('http://localhost:4000/users',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
          })
            .then(response => response.json())

        var connectUserFriendList = []

        for(let i=0; i<connectedUserFriendIdList.length; i++){
            for(let k=0; k<users.length; k++){
                if(connectedUserFriendIdList[i] === users[k].id){
                    connectUserFriendList.push(users[k])
                }
            }
        }

        // filter to don't show friends already in activity + already invited
        var connectUserFriendListBis = connectUserFriendList.filter( user => user.activities.find( id => id === activityId ) === undefined)
        var connectUserFriendListTer = connectUserFriendListBis.filter( user => user.invitedActivities.find( id => id === activityId ) === undefined)

        console.log(connectUserFriendListTer)

        //get Activity speciality
        const activities = await fetch('http://localhost:4000/activities',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
          })
            .then(response => response.json())
            .then( data => data.activities)

        var activitySpeciality

        for(let i=0; i<activities.length; i++){
            if(activities[i].id === activityId){
                activitySpeciality = activities[i].speciality
            }
        }

        // sort friends into lists
        var friendsWithInterests = []
        var otherFriends = []
        
        for(let i=0; i<connectUserFriendListTer.length; i++){
            var isIn = false
            for(let k=0; k<connectUserFriendListTer[i].interests.length; k++){
                if(connectUserFriendListTer[i].interests[k].speciality === activitySpeciality){
                    isIn = true
                }
            }
            if(isIn){
                friendsWithInterests.push(connectUserFriendListTer[i])
            }
            else{
                otherFriends.push(connectUserFriendListTer[i])
            }
        }

        //order lists by alphabetic
        friendsWithInterests.sort( (a,b) => a.name.localeCompare(b.name))
        otherFriends.sort( (a,b) => a.name.localeCompare(b.name))
        

        // return object
        var object = {
            friendsWithInterests: friendsWithInterests,
            otherFriends: otherFriends,
            activityId: activityId,
            path: path
        }

        this.setState(object)

    }


    async inviteUser(userId){
        const users = await fetch('http://localhost:4000/users',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
          })
            .then(response => response.json())
        
        var user
        var userIndex
        for(let i=0; i<users.length; i++){
            if(users[i].id === userId){
                user = users[i]
                userIndex = i
                user.invitedActivities.push(this.state.activityId)
            }
        }

        await fetch('http://localhost:4000/users/' + userIndex,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(user)
          })

          // set State
    }


    render(){

        return <div id="invite-friends-activity-page-background">
            <BackButton to={this.state.path} />
            <div id="invite-friends-activity-page">
                <div id="invite-friends-activity-page-label">
                    Invite Friends
                </div>
                <div id="invite-friends-activity-page-scroll-area">
                    <div id="invite-friends-activity-friends-with-interests-label">
                        Friends with interests for this activity:
                    </div>
                    <div id="invite-friends-activity-friends-with-interests-list">
                    {this.state.friendsWithInterests.length === 0 ? 
                    <div className="no-friends-to-invite"> All your friends that have an interest for this activity have already join or have already been invited</div> 
                    :
                    this.state.friendsWithInterests.map( user => (
                        <div className='invite-friends-user-tile'>
                            <InviteFriendUserTile 
                                user={user} 
                                inviteUser={(userId) => {this.inviteUser(userId)}}
                            />                       
                        </div>
                    ))}
                    </div>
                    <hr/>
                    <div id="invite-friends-activity-other-friends-label">
                        Other friends:
                    </div>
                    <div id="invite-friends-activity-other-friends-list">
                    {this.state.otherFriends.length === 0 ?
                    <div className="no-friends-to-invite">All your friends that have no interest for this activity have already join or have already been invited</div>
                    :
                    this.state.otherFriends.map( user => (
                        <div className='invite-friends-user-tile'>
                            <InviteFriendUserTile 
                                user={user} 
                                inviteUser={(userId) => {this.inviteUser(userId)}}
                            />
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            <div>
                <AppMenu icon='my-activities' />
            </div>
        </div>
    }
}



export default InviteFriendsActivityPage