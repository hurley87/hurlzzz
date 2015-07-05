
Meteor.methods({
	getData: function(posts, user) {
		var data = {
			likes: Meteor.call('likes', posts),
			avgLikes: Meteor.call('avgLikes', posts),
			comments: Meteor.call('comments', posts),
			avgComments: Meteor.call('avgComments', posts),
			engagement: Meteor.call('engagement', posts, user),
			// hashtagList: Meteor.call('hashtagList', posts),
			postValue: Meteor.call('postValue', posts, user),
			engagementValue: Meteor.call('engagementValue', posts, user),
			impressionValue: Meteor.call('impressionValue', posts, user)
		};
		return data;
	},
	likes: function(posts) {
		var postLikes = [];

		for(var i = 0; i < posts.length; i++ ) {
			var likes = posts[i].likes.count;
			postLikes.push([posts.length-i,likes]);
		}

      	return postLikes;
	},
    avgLikes: function(posts) {
	    var likeTotal = 0;

	    for(var i = 0; i < posts.length; i++ ) {
	      likeTotal += posts[i].likes.count;
	    }

      	return likeTotal / posts.length;
    },
    comments: function(posts) {
    	var commentLikes = [];

		for(var i = 0; i < posts.length; i++ ) {
			var comments = posts[i].comments.count;
			commentLikes.push([posts.length-i,comments]);
		}

      	return commentLikes;
    },
    avgComments: function(posts) {
		var commentTotal = 0;

	    for(var i = 0; i < posts.length; i++ ) {
	      commentTotal += posts[i].comments.count;
	    }

      	return commentTotal / posts.length;
    },
    engagement: function(posts, user) {
       	var avgComments = Meteor.call('avgComments', posts);
    	var avgLikes = Meteor.call('avgLikes', posts);
    	var value = Meteor.call('postValue', posts, user);

      	return (avgComments + avgLikes) / value;
    }, 
    impressionValue: function(posts, user) {
    	var value = Meteor.call('postValue', posts, user);
    	return (value / user.followed_by * 10).toFixed(2);
    },
    engagementValue: function(posts, user) {
    	var value = Meteor.call('postValue', posts, user);
    	var engagement = Meteor.call('engagement', posts, user);
    	return (engagement / value).toFixed(2);
    },
    followingRatio: function(user) {
    	var stats = user.profile.stats;
    	return stats.followed_by / stats.follows;
    },
    hashtagList: function(posts) {
    	var tags = [];

		for(var i = 0; i < posts.length; i++ ) {
			tags.push(posts[i].tags);
		}

		tags = _.flatten(tags);

    	return _.uniq(tags);
    },
    postValue: function(posts, user) {
    	return parseInt(11.7318*Math.pow(Meteor.call('avgLikes', posts), 0.1793)*Math.pow(user.followed_by, 0.1684));
    },
   	updateUser: function(argument, user){

    check(argument, Object);
    check(user, Object);

    try {
      Meteor.users.update({_id: user._id}, {$set: {
      	'profile.other.location' : argument.city,
      	'profile.other.gender' : argument.sex,
      	'profile.other.age': argument.dob
      }});	
      Router.go('/leaderboard');
    } catch(exception) {
      return exception;
    }
  }
});