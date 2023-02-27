import React from "react";
import { NavLink } from "react-router-dom";
import '../style/ActivityTile.css'
import ActivityTileOptions from "./ActivityTileOptions";

class ActivityTile extends React.Component {

    state = {
        dealerPicture: "",
        dealerId: -1,
        customers: []
    }

    componentDidMount(){
        try{
            this.getUserPicture()
        }catch(error){
            console.log(error)
        }
    }

    async getUserPicture(){
        await fetch('http://localhost:4000/users/' + this.props.activity.dealerId)
                .then( res => res.json())
                .then( data => this.setState({ dealerPicture: data.profilePicture, dealerId: data.id }))

        var customersListToSet = []

        var connectedUserId = await fetch('http://localhost:4000/connectedUser')
        .then( res => res.json() ).then( data => data.id)

        for(let customerListId=0; customerListId<this.props.activity.customersId.length; customerListId++){

            if(this.props.activity.customersId[customerListId] !== connectedUserId){

                await fetch('http://localhost:4000/users/' + this.props.activity.customersId[customerListId])
                .then( res => res.json() )
                .then( data => customersListToSet.push({
                    profilePicture: data.profilePicture,
                    name: data.name.split(" ")[0],
                    id: data.id
                }))
            
            }

        }
        
        this.setState({ customers: customersListToSet})
        
    }



    render(){

        return <div className="activity-tile-background">
            <div id="activity-tile">
                
                <div id="activity-tile-header">
                    <div id="activity-tile-title">
                        {this.props.activity.title}
                    </div>
                    <div id="activity-tile-dealer-picture">
                        <div id="activity-tile-dealer-picture-container"> 
                            <NavLink to={"/ProfilePageFreindsPage?from=" + window.location.pathname.split('/').join('-') + "&id=" + this.state.dealerId}>
                            <img src={this.state.dealerPicture} alt="user" width="65px" height="65px"/>
                            </NavLink>
                        </div>
                    </div>
                </div>

                <div id="activity-tile-picture">
                    <img src={this.props.activity.picture} alt="activty" />
                </div>

                <div id="activity-tile-body">
                    <div id="activity-tile-description">
                        {this.props.activity.description}
                    </div>
                    <div id="activity-tile-location-container">
                        <div id="activity-tile-location-label">
                            Location :
                        </div>
                        <div id="activity-tile-location">
                            {this.props.activity.location}
                        </div>
                    </div>
                    <div id="activity-tile-date-number">

                        <div id="activity-tile-number">
                            {/* +1 for the owner */}
                            Participing: {this.props.activity.customersId.length + 1}/{this.props.activity.numberMaxCustomer} 
                        </div>
                        <div id="activity-tile-date">
                            {this.props.activity.date}
                        </div>
                        
                    </div>
                    <div id="activity-tile-customers">
                        {this.state.customers.map( customer => (
                            <div className="activity-tile-customer">
                                <div className="activity-tile-customer-picture">
                                    <NavLink to={"/ProfilePageFreindsPage?from=" + window.location.pathname.split('/').join('-') + "&id=" + customer.id}>
                                    <img src={customer.profilePicture} alt="user" width="55px" height="55px"/>
                                    </NavLink>
                                </div>
                                <div className="activity-tile-customer-name">
                                    {customer.name}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div id="activity-tile-options">
                        <ActivityTileOptions activity={this.props.activity} 
                                             joinActivity={this.props.joinActivity}
                                             dismissActivity={this.props.dismissActivity}
                                             deleteActivity={this.props.deleteActivity} 
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ActivityTile;