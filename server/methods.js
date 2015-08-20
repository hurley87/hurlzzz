
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
        'profile.other.email' : argument.email,
        'profile.other.city' : argument.city
      }});
    } catch(exception) {
      return exception;
    }
  },
  updateAnalytics: function(user, updater) {
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

    Meteor.call('createUserUpdate', updater, user);



    if(user.profile.other.email) {
       Email.send({
        from: updater.profile.other.email,
        to: user.profile.other.email,
        subject: "@" + updater.profile.username + " just updated the value of your Instagram account!",
        text: "Hey " + user.profile.username + ",\n\n Take a look at your updated Instagram stats, \n\n" +
        'http://reachignition.com/' + user.profile.username + '\n\n Any questions? Reply to this email. \n\n Thanks!'
      });     
    }
  },
  createUserUpdate: function(updater, updated) {
    Updates.insert({
      updater: updater,
      updated: updated,
      createdAt: new Date()
    });
  },
  createQuestion: function(user, question) {
    Questions.insert({
      user: user,
      question: question,
      createdAt: new Date()
    });
  },
  createAnswer: function(answer) {
    check(answer, Object);
    Answers.insert(answer);
  },
  updateScore: function(answer) {
    check(answer, Object);
    var  newScore =  answer.score + 1;
    Answers.update({ _id: answer._id }, {
      $set: {
        score : newScore
      }
    });
  },
  proposal: function(proposal) {
    Proposals.insert(proposal);

    var receiver = proposal.receiver;
    var sender = proposal.sender;

    Email.send({
      from: "dhurley@hashtagpaid.com",
      to: receiver.profile.other.email,
      subject: "@" + sender.profile.username + " wants you to feature them!" ,
      text: "Hey " + receiver.profile.username + ", \n\n From: @" + sender.profile.username + ", \n\n Introduction: " + proposal.intro + ", \n\n Perks: " + proposal.perks + ", \n\n Game Plan: " + proposal.plan + "\n\n   Thanks, \n\n Dave"
    });

    Email.send({
      from: "dhurley@hashtagpaid.com",
      to: "dhurley@hashtagpaid.com",
      subject: "@" + sender.profile.username + " wants you to feature them!" ,
      text: "Hey " + receiver.profile.username + ", \n\n From: @" + sender.profile.username  + ", \n\n Introduction: " + proposal.intro + ", \n\n Perks: " + proposal.perks + ", \n\n Game Plan: " + proposal.plan + "\n\n   Thanks, \n\n Dave"
    });

  },
  addContact: function(email, name, message, username) {
    Contacts.insert({
      email: email,
      name: name,
      message: message
    });

    Email.send({
      from: "dhurley@hashtagpaid.com",
      to: email,
      subject: "Thanks for inquiring about Ignition!",
      text: "Hey " + name + ", \n\n I'll get back to you as soon as I can. Things are busy but that doesn't mean I won't forget about you. \n\n  Thanks, \n\n Dave"
    });

    Email.send({
      from: email,
      to: "dhurley@hashtagpaid.com",
      subject: "Hot lead",
      text: message + "\n\n This is a lead from Ignition. From @" + username + '. \n\n His name is ' + name
    });

  },
  hasPoints: function(userId) {
    return Points.findOne({ userId: userId});
  },
  addPoints: function(userId) {

    var points = {
      accounts: 0,
      yourAccounts: 0,
      questions: 0,
      answers: 0,
      hearts: 0,
      userId: userId
    };

    Points.insert(points); 

  },
  updateYourAccountsPoints: function(userId) {
    check(userId, String);
    var hasPoints = Meteor.call('hasPoints', userId);
    if(hasPoints) {
      var newPoints = Points.findOne({ userId: userId}).yourAccounts + 100;
      Points.update({ userId: userId }, {
        $set: {
          yourAccounts: newPoints
        }
      });
    } else {
      Meteor.call('addPoints', userId);
      Points.update({ userId: userId }, {
        $set: {
          yourAccounts: 100
        }
      });
    }
  },
  updateAccountsPoints: function(userId) {
    check(userId, String);
    var hasPoints = Meteor.call('hasPoints', userId);
    if(hasPoints) {
      var newPoints = Points.findOne({ userId: userId}).accounts + 20;
      Points.update({ userId: userId }, {
        $set: {
          accounts: newPoints
        }
      });
    } else {
      Meteor.call('addPoints', userId);
      Points.update({ userId: userId }, {
        $set: {
          accounts: 20
        }
      });
    }
  },
  questionPoints: function(userId) {
    check(userId, String);
    var hasPoints = Meteor.call('hasPoints', userId);
    if(hasPoints) {
      var newPoints = Points.findOne({ userId: userId}).questions + 15;
      Points.update({ userId: userId }, {
        $set: {
          questions: newPoints
        }
      });
    } else {
      Meteor.call('addPoints', userId);
      Points.update({ userId: userId }, {
        $set: {
          questions: 15
        }
      });
    }  
  },
  answerPoints: function(userId) {
    check(userId, String);
    var hasPoints = Meteor.call('hasPoints', userId);
    if(hasPoints) {
      var newPoints = Points.findOne({ userId: userId}).answers + 5;
      Points.update({ userId: userId }, {
        $set: {
          answers: newPoints
        }
      });
    } else {
      Meteor.call('addPoints', userId);
      Points.update({ userId: userId }, {
        $set: {
          answers: 5
        }
      });
    }  
  },
  heartPoints: function(userId) {
    check(userId, String);
    var hasPoints = Meteor.call('hasPoints', userId);
    if(hasPoints) {
      var newPoints = Points.findOne({ userId: userId}).hearts + 1;
      Points.update({ userId: userId }, {
        $set: {
          hearts: newPoints
        }
      });
    } else {
      Meteor.call('addPoints', userId);
      Points.update({ userId: userId }, {
        $set: {
          hearts: 1
        }
      });
    }  
  } 
});