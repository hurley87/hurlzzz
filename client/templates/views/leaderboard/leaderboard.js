Template.leaderboard.helpers({
	users: function() {
		return Meteor.users.find({}, {
      sort: {
        'profile.data.postValue': -1
      }
    });
	}
});

Template.profile2.helpers({
	user: function() {
	  var id = Router.current().params._id;
      return Meteor.users.findOne(id).profile;
    },
    stats: function() {
      var id = Router.current().params._id;		
      return Meteor.users.findOne(id).profile.stats;
    }
});

Template.leaderboard.onRendered(function() {
  $('.grid').isotope({
    itemSelector: '.grid-item',
    masonry: {
      columnWidth: 10
    }
  });
});