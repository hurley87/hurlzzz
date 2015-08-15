Meteor.publish('allLeaderboardUsers', function() {
  var data = Meteor.users.find({}, { sort: { 'profile.data.postValue': -1 }});
  return data;
});

Meteor.publish('updates', function() {
	return Updates.find({});
});

Meteor.publish('requests', function() {
	return Requests.find({});
});

Meteor.publish('messages', function() {
	return Messages.find({});
});

Meteor.publish('chats', function() {
	return Chats.find({});
});