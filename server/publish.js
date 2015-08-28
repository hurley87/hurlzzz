Meteor.publish('allLeaderboardUsers', function() {
  var data = Meteor.users.find({}, { sort: { 'profile.data.postValue': -1 }});
  return data;
});

Meteor.publish('updates', function() {
	return Updates.find({});
});

Meteor.publish('searchUsers', function(limit) {
	return Meteor.users.find({}, { limit: limit, sort: { 'profile.data.postValue': -1 } });
});     
