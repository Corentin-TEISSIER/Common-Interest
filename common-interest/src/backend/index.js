const users = require('./users.json');
const interests = require('./interests.json');
const activities = require('./activities.json');
const messages = require('./messages.json');


module.exports = () => ({
  users: users.users,
  connectedUser: users.connectedUser,
  interests: interests,
  activities: activities,
  messages: messages.messages

});