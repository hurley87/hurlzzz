Meteor.publish('allLeaderboardUsers', function() {
  var data = Meteor.users.find({}, { sort: { 'profile.data.postValue': -1 }});
  return data;
});

Meteor.publish('elites', function() {
	var data = Meteor.users.find({
		'profile.data.postValue' : {
			$gt : 50
		}
	},
	{
		sort: { 'profile.data.postValue': -1 }
	});
	return data;
});

Meteor.publish('requests', function() {
	return Requests.find({});
});