 Template.infiniteSearch.helpers({
 	users: function() {
 		return Meteor.users.find({});
 	},
 	moreResults: function() {
 		return !(Meteor.users.find({}).count() < Session.get("usersLimit"));
 	}
 });