
Meteor.methods({
	getData: function(posts, user) {
		var data = {
			likes: Meteor.call('likes', posts),
			avgLikes: Meteor.call('avgLikes', posts),
			comments: Meteor.call('comments', posts),
			avgComments: Meteor.call('avgComments', posts),
			engagement: Meteor.call('engagement', posts, user),
			postValue: Meteor.call('postValue', posts, user),
      likesConsist: Meteor.call('likesConsist', posts),
      commentsConsist: Meteor.call('commentsConsist', posts),
      rank: 0
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
  likesConsist: function(posts) {
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
  commentsConsist: function(posts) {
    var avgComments = Meteor.call('avgComments', posts);
    var sum = 0;
    for(var i=0; i < posts.length; i++) {
      var diff = posts[i].comments.count - avgComments;
      sum = sum + Math.pow(diff, 2);
    }
    var variance = sum / (avgComments - 1);
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
        'profile.other.age': argument.dob,
        'profile.other.account': argument.account,
        'profile.other.frequency': argument.frequency,
        'profile.other.categories': argument.categories
      }});
    } catch(exception) {
      return exception;
    }
  },
  updateAnalytics: function(user) {
    var ig = Meteor.npmRequire('instagram-node').instagram(); 
    var Future = Npm.require('fibers/future');

    var recentPosts = new Future();
    var stats = new Future();
    var data = new Future();
    var currentValue = new Future();
    var currentEngagment = new Future();
    var currentFollowers = new Future();

    ig.use({ client_id: Meteor.settings.instagram_id, client_secret: Meteor.settings.instagram_secret });

    ig.user_media_recent( user.profile.id, function(err, medias, pagination, remaining, limit) {
      recentPosts.return(medias);
    }); 

    ig.user(user.profile.id, function(err, result, remaining, limit) {
      currentFollowers.return(result.counts.followed_by);
      stats.return(result.counts);
    });

    Meteor.call('getData', recentPosts.wait(), stats.wait(), function(error, result) {
      data.return(result);
      currentValue.return(result.postValue);
      currentEngagment.return(result.engagement);
    });

    Meteor.users.update({ _id: user._id}, {
      $set: {
        'profile.data' : data.wait(),
        'profile.posts': recentPosts.wait(),
        'profile.stats': stats.wait()
      },
      $push: {
        'profile.followerGrowth': currentFollowers.wait(),
        'profile.engagementGrowth': parseFloat(currentEngagment.wait()),
        'profile.valueGrowth': currentValue.wait()
      }
  });

    if(user.profile.other.email) {
       Email.send({
        from: "meteor.email.2014@gmail.com",
        to: user.profile.other.email,
        subject: "Ignition - your stats have been updated",
        text: "Hey " + user.profile.username + ",\n\n Take a look at your updated Instagram stats, \n\n" +
        'http://instagram.mod.bz/' + user.profile.username + '\n\n Any questions? Reply to this email. \n\n Thanks!'
      });     
    }
  },
  setRank: function(users) { 
    for(var i=0; i < users.length; i++) {
      var newRank = i + 1;
      Meteor.users.update({ _id: users[i]._id }, { $set: {
        'profile.data.rank' : newRank
      }});       
    }
  },
  addGrowth: function(user) {
    var engagement = parseFloat(user.profile.data.engagement)
    Meteor.users.update({ _id: user._id}, {$set: {
      'profile.followerGrowth' : [user.profile.stats.followed_by],
      'profile.engagementGrowth': [engagement],
      'profile.valueGrowth': [user.profile.data.postValue],
      'profile.other.account': 'Personal'
    }});    
  },
  sendRequest: function(send, receive) {
    Requests.insert({
      receive: receive, 
      send: send,
      createdAt: new Date()
    });
  },
  removeRequest: function(id) {
    Requests.remove({ _id : id });
  },
  createChat: function(send, receive) {
    Chats.insert({ 
      thatUser: send, 
      thisUser: receive,
      createdAt: new Date()
    });
  },
  removeChat: function(id) {
    Chats.remove({ _id: id });
  },
  createMessage: function(id, user, text) {
    Messages.insert({
      chat_id: id,
      user: user,
      text: text
    });
  },
  addContact: function(email, name, message) {
    Contacts.insert({
      email: email,
      name: name,
      message: message
    });

    Email.send({
      from: "dhurls99@gmail.com",
      to: email,
      subject: "Thanks for inquiring about Ignition!",
      text: "Hey " + name + ", \n\n I'll get back to you as soon as I can. Things are busy but that doesn't mean I won't forget about you."
    });

    Email.send({
      from: "dhurls99@gmail.com",
      to: "dhurls99@gmail.com",
      subject: "Hot lead",
      text: message + "\n\n This is a lead from Ignition."
    });

  },
  requestEmail: function(send, receive) {
    if(receive.profile.other.email) {
      Email.send({
        from: "dhurls99@gmail.com",
        to: receive.profile.other.email,
        subject: "Chat request sent from @" + send.profile.username,
        text: "Hey " + receive.profile.username + ", \n\n Accept or reject the following chat request: \n\n http://reachignition.com/" + send.profile.username
      });
    }
  },
  requestAcceptedEmail: function(send, receive) {
    Email.send({
      from: "dhurls99@gmail.com",
      to: send.profile.other.email,
      subject: '@' + receive.profile.username + ' accepted your chat request.',
      text: "Hey " + send.profile.username + ", \n\n  Click here to start chatting: \n\n http://reachignition.com/" + receive.profile.username
    });
  },
  requestRejectedEmail: function(send, receive) {
    Email.send({
      from: "dhurls99@gmail.com",
      to: send.profile.other.email,
      subject: '@' + receive.profile.username + ' rejected your chat request.',
      text: "Hey " + send.profile.username + ", \n\n Try sending a chat request to someone else. \n\n http://reachignition.com/explore"
    });
  }
});