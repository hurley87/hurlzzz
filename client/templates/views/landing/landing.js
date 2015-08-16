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
        Router.go('/edit'); 
      });
    }
  });

Template.hey.rendered = function () {
  $(document).ready(function(){
    $('#slider').slick({
        arrows: false,
        verticalSwiping: true,
        vertical: true,
        adaptiveHeight: true,
        centerPadding: '0px'
    });
    var snapper = new Snap({
      element: document.getElementById('snapper')
    });
    $('.mySearch').on('click', function(){
      if( snapper.state().state == "right" ){
          snapper.close();
      } else {
          snapper.open('right');
      
      }

  });
  });

};

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
                email: $('#email').val(),
                city: $('#location').val()
            };
        var user = Meteor.users.findOne(Meteor.userId());
        Meteor.call('updateUser', userDetails, user);
        analytics.track('Update', {
          userDetails: userDetails,
          name: user.profile.username
        });
        Bert.alert('Your soo good looking!', 'info');
        Router.go('/');
    }
});
 

Template.updateAllUsers.events({
  'click button': function(evt, temp) {
    var users = Meteor.users.find().fetch();
    for (var i = 0; i < users.length; i++) {
      Meteor.call('updateAnalytics', users[i]);
    }
  }
})
