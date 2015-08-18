
Template.updateUser.helpers({
    user: function() {
      return Meteor.users.findOne(Meteor.userId()).profile;
    }
});

Template.updateUser.onRendered(function() {
  this.autorun(function () {
    if (GoogleMaps.loaded()) {
      $("#location").geocomplete();
    }
  });
});


Template.updateUser.events({
    'submit #update': function(evt, temp) {
        evt.preventDefault();
        var userDetails = {
                email: $('#email').val(),
                city: $('#location').val()
            };
        var user = Meteor.users.findOne(Meteor.userId());
        Meteor.call('updateUser', userDetails, user);
        analytics.track('Update', {
          userDetails: userDetails,
          name: user.profile.username
        });
        Router.go('/');
    }
});