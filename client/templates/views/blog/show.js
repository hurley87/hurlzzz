Template.post.events({
'click .insta': function(evt, temp) {
	evt.preventDefault();
    Meteor.loginWithInstagram(function (err, res) {
	    if (err !== undefined) {
	      console.log('sucess ' + res);
	    } else {
	      console.log('login failed ' + err);
	    }
	    Router.go('/blog');
	    analytics.identify(Meteor.userId()); 
	  });
	}
});
Template.post.onRendered(function() {
	$(document).ready(function() {
		var content = $('#postContent').data('content');
		console.log(content);
	});
});
Template.post.helpers({
	thisUser: function() {
		if(this.user) {
			return this.user._id == Meteor.userId();
		} else {
			return false;
		}
		
	}
});	