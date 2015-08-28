Meteor.publish('allLeaderboardUsers', function() {
  var data = Meteor.users.find({}, { sort: { 'profile.data.postValue': -1 }});
  return data;
});

Meteor.publish('updates', function() {
	return Updates.find({});
});

Meteor.publish('searchUsers', function(limit, gt, lt) {
	return Meteor.users.find({
		$and: [{
			'profile.data.postValue': {
				$gt: gt
			}},{
			'profile.data.postValue': {
				$lt: lt
			}
		}]
	}, { 
		limit: limit, 
		sort: { 
			'profile.data.postValue': -1 
		}
	});
});     
