Meteor.publish('allLeaderboardUsers', function() {
  var data = Meteor.users.find({}, { sort: { 'profile.data.postValue': 1 }});
  return data;
});