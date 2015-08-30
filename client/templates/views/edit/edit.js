Template.edit.events({
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
Template.updateUser.helpers({
    user: function() {
      return Meteor.users.findOne(Meteor.userId()).profile;
    }
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
      analytics.identify(Meteor.userId(), {
        '$name': user.profile.username,
        '$email': user.profile.other.email
      });    
      Router.go('/blog');
  }
});