Template.header.events({

    'click .hide-menu': function(event){
        event.preventDefault();
        $("body").toggleClass("hide-sidebar");
    },
    'click #logout': function(evt, temp) {
    evt.preventDefault();
      Meteor.logout();
      Router.go('/');
    },
    'click #instaLogin':function(evt, temp) {
      evt.preventDefault();
      Meteor.loginWithInstagram(function (err, res) {
        console.log(res);
        if (err !== undefined) {
          console.log('sucess ' + res);
        } else {
          console.log('login failed ' + err);
        }
        Router.go('/edit'); 
      });
    }

});

Template.header.onRendered(function() {
  $("body").addClass("hide-sidebar");
});

Template.header.helpers({
  user: function() {
    return Meteor.users.findOne(Meteor.userId()).profile;
  },
  stats: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.stats;
  }
});