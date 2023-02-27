import React from 'react';
import '../style/AppBody.css'

import { Routes , Route } from 'react-router-dom'


/*Pages import*/
import Connection from '../pages/Connection.js'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'

import FriendsPage from '../pages/FriendsPage.js'
import FiltersPage from '../pages/FiltersPage'
import AddFilterPage from '../pages/AddFilterPage'
import PendingRequestsPage from '../pages/PendingRequestsPage.js'
import MyFriendsPage from '../pages/MyFriendsPage.js'

import MessagesPage from '../pages/MessagesPage.js'
import DiscussionPage from '../pages/DiscussionPage';
import NewMessagePage from '../pages/NewMessagePage.js'
import MessagesGroupInformations from '../pages/MessagesGroupInformations';

import ActivitiesPage from '../pages/ActivitiesPage.js'
import InvitedActivitiesPage from '../pages/InvitedActivitiesPage';

import MyActivitiesPage from '../pages/MyActivitiesPage.js'
import OwnedActivitiesPage from '../pages/OwnedActivitiesPage';
import ModerateActivitiesPage from '../pages/ModerateActivitiesPage';
import CreateActivityPage from '../pages/CreateActivityPage'
import BecomeModeratorActivityPage from '../pages/BecomeModeratorActivityPage';

import ProfilePage from '../pages/ProfilePage.js'
import ProfilePageFreindsPage from '../pages/ProfilePageFreindsPage.js'
import ModifyProfilePage from '../pages/ModifyProfilePage.js'
import NewInterestPage from '../pages/NewInterestPage'
import DisconnectionPage from '../pages/DisconnectionPage'
import InviteFriendsActivityPage from '../pages/InviteFriendsActivityPage';


class AppBody extends React.Component {

  state = {
    reloadNeeded: true,
    key: 0
  }

  callbackReloadAll(){
    let newValue = !this.state.reloadNeeded
    this.setState({reloadNeeded: newValue})
  }


  render() {

    return  <div>
              <div id="background-body">
                <Routes>
                  <Route path='/' element={<Connection />} />
                  <Route path='/LoginPage' element={<LoginPage />} />
                  <Route path='/SignupPage' element={<SignupPage />} />

                  <Route path='/FriendsPage' element={<FriendsPage />} />
                  <Route path='/FriendsPage/FiltersPage' element={<FiltersPage />} />
                  <Route path='/FriendsPage/PendingRequestsPage' element={<PendingRequestsPage />} />
                  <Route path='/FriendsPage/MyFriendsPage' element={<MyFriendsPage />} />
                  <Route path='/FriendsPage/FiltersPage/AddFilterPage' element={<AddFilterPage />} />

                  <Route path='/MessagesPage' element={<MessagesPage />} />
                  <Route path='/MessagesPage/DiscussionPage' element={<DiscussionPage />} />
                  <Route path='/MessagesPage/NewMessage' element={<NewMessagePage />} />
                  <Route path='/MessagesPage/DiscussionPage/MessagesGroupInformation' element={<MessagesGroupInformations />} />

                  <Route path='/ActivitiesPage' element={<ActivitiesPage />} />
                  <Route path='/ActivitiesPage/InvitedActivitiesPage' element={<InvitedActivitiesPage />} />

                  <Route path='/MyActivitiesPage' element={<MyActivitiesPage />} />
                  <Route path='/MyActivitiesPage/OwnedActivitiesPage' element={<OwnedActivitiesPage />} />
                  <Route path='/MyActivitiesPage/ModerateActivitiesPage' element={<ModerateActivitiesPage />} />
                  <Route path='/MyActivitiesPage/InviteFriendsActivityPage/' element={<InviteFriendsActivityPage />} />
                  <Route path='/MyActivitiesPage/CreateActivityPage' element={<CreateActivityPage />} />
                  <Route path='/MyActivitiesPage/BecomeModerator' element={<BecomeModeratorActivityPage />} />

                  <Route path='/ProfilePage' element={<ProfilePage callbackReloadAll={this.callbackReloadAll}/>} />
                  <Route path='/ProfilePageFreindsPage' element={<ProfilePageFreindsPage callbackReloadAll={this.callbackReloadAll}/>} />
                  <Route path='/ProfilePage/ModifyProfilePage' element={<ModifyProfilePage />} />
                  <Route path='/ProfilePage/NewInterestPage' element={<NewInterestPage callbackReloadAll={this.callbackReloadAll} />} />
                  <Route path='/ProfilePage/DisconnectionPage' element={<DisconnectionPage />} />
                </Routes>
              </div>

            </div>
  }

}

export default AppBody;