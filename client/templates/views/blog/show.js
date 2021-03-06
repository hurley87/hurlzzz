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
	},
	'submit #subscribeMe': function(evt, temp) {
      evt.preventDefault();
      var email = {
        email: $('#firstEmail').val()
      };
      console.log(email);
      Meteor.call('addSlack', email);
      Router.go('/edit');	
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