  Template.landing.events({
    'submit #slackForm': function(evt, temp) {
      evt.preventDefault();
      var email = {
        email: $('#firstEmail').val()
      };
      Meteor.call('addSlack', email);
      Router.go('/search');
    },
    'submit #slack': function(evt, temp) {
      evt.preventDefault();
      var email = {
        email: $('#email').val()
      };
      Meteor.call('addSlack', email);
      Router.go('/search');
    }
  });

Template.landing.helpers({
  users: function() {
    return Meteor.users.find({});
  }
});

Template.landing.rendered = function () {
  $(document).ready(function(){
    $('#slider').slick({
        arrows: false,
        verticalSwiping: true,
        vertical: true,
        adaptiveHeight: true,
        centerPadding: '0px',
        autoplay: true
    });
  });
};

 

