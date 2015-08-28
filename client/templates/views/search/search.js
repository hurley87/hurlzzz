 Template.infiniteSearch.helpers({
 	users: function() {
 		return Meteor.users.find({});
 	},
 	moreResults: function() {
 		return !(Meteor.users.find({}).count() < Session.get("usersLimit"));
 	}
 });

 Template.infiniteSearch.events({
 	'click .loadMore': function(evt, templ) {
 		evt.preventDefault();
 		Session.set("usersLimit", Session.get("usersLimit") + 10);
 	}
 });