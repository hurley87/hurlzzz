Meteor.publish('allLeaderboardUsers', function() {
  var data = Meteor.users.find({}, { sort: { 'profile.data.postValue': -1 }});
  return data;
});

Meteor.publish('topUsers', function() {
  var data = Meteor.users.find({}, { sort: { 'profile.data.postValue': -1 }, limit: 4 });
  return data;
});

Meteor.publish('updates', function() {
	return Updates.find({});
});

Meteor.publish('posts', function() {
	return Posts.find({});
});

Meteor.publish('thisPost', function(slug) {
	return Posts.find({ slug: slug });
});

Meteor.publish('userPosts', function(username) {
	return Posts.find({ 'user.profile.username': username }, { sort: { createdAt: -1 }, limit: 3 });
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
