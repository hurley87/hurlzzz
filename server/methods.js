
Meteor.methods({
	getData: function(posts, user) {
		var data = {
			likes: Meteor.call('likes', posts),
			avgLikes: Meteor.call('avgLikes', posts),
			comments: Meteor.call('comments', posts),
			avgComments: Meteor.call('avgComments', posts),
			engagement: Meteor.call('engagement', posts, user),
			postValue: Meteor.call('postValue', posts, user),
      consistency: Meteor.call('consistency', posts)
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
    var average = parseFloat(likeTotal / posts.length).toFixed(2);
    	return average;
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
    var average = parseFloat(commentTotal / posts.length).toFixed(2);
    return average;
  },
  engagement: function(posts, user) {
    var avgComments = Meteor.call('avgComments', posts);
  	var avgLikes = Meteor.call('avgLikes', posts);
  	var value = Meteor.call('postValue', posts, user);
    var sum = parseFloat(avgComments) + parseFloat(avgLikes);
    return sum.toFixed(2);
  }, 
  consistency: function(posts) {
    var avgLikes = Meteor.call('avgLikes', posts);
    var sum = 0;
    for(var i=0; i < posts.length; i++) {
      var diff = posts[i].likes.count - avgLikes;
      sum = sum + Math.pow(diff, 2);
    }
    var variance = sum / (avgLikes - 1);
    var std = Math.pow(variance, 0.5);
    return parseFloat(std).toFixed(2);
  },
  postValue: function(posts, user) {
  	return parseInt(12.533*Math.pow(user.followed_by, 0.1724)*Math.pow(Meteor.call('avgLikes', posts), 0.1522)*Math.pow(Meteor.call('avgComments', posts), 0.0304));
  },
 	updateUser: function(argument, user){
    check(argument, Object);
    check(user, Object);
    try {
      Meteor.users.update({_id: user._id}, {$set: {
        'profile.other.city' : argument.city,
        'profile.other.country' : argument.country,
        'profile.other.email' : argument.email,
        'profile.other.gender' : argument.sex,
        'profile.other.age': argument.dob
      }});
    } catch(exception) {
      return exception;
    }
  }
});