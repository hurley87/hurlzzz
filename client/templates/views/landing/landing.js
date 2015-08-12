  Template.hey.events({
    'click .insta': function(evt, temp) {
      evt.preventDefault();
      Meteor.loginWithInstagram(function (err, res) {
        if (err !== undefined) {
          console.log('sucess ' + res);
        } else {
          console.log('login failed ' + err);
        }
        var users = Meteor.users.find({}, { sort: { 'profile.data.postValue': -1 } }).fetch();
        Meteor.call('setRank', users);
        Bert.alert('Almost there!', 'info');
        Router.go('/edit'); 
      });
    }
  });

Template.updateUser.helpers({
    user: function() {
      return Meteor.users.findOne(Meteor.userId()).profile;
    }
});

Template.contactForm.events({
  'submit #create': function(evt, temp) {
    evt.preventDefault();
    var email = $('#email').val();
    var message = $('#message').val();
    var name = $('#name').val();
    Bert.alert('Thanks for saying hello.', 'info');
    analytics.track('Hot Lead', {
      email: email,
      message: message,
      name: name
    });
    var username = Meteor.users.findOne(Meteor.userId()).profile.username;
    Meteor.call('addContact', email, name, message, username);
    $('#email').val('');
    $('#name').val('');
    $('#message').val('');
  }
});

Template.updateUser.events({
    'submit #update': function(evt, temp) {
        evt.preventDefault();
        var userDetails = {
                email: $('#email').val()
            };
        var user = Meteor.users.findOne(Meteor.userId());
        Meteor.call('updateUser', userDetails, user);
        analytics.track('Update', {
          userDetails: userDetails,
          name: user.profile.username
        });
        Bert.alert('Your soo good looking! Try requesting a chat with someone.', 'info');
        Router.go('/');
    }
});
 

Template.updateAllUsers.events({
  'click button': function(evt, temp) {
    var users = Meteor.users.find().fetch();
    for (var i = 0; i < users.length; i++) {
      Meteor.call('updateAnalytics', users[i]);
    }
  },
  'click a':function(evt, temp) {
    evt.preventDefault();
    var users = Meteor.users.find().fetch();
    for (var i = 0; i < users.length; i++) {
      Meteor.call('addGrowth', users[i]);
    }
  }
})
