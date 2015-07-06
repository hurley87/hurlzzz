Template.header.events({

    'click .hide-menu': function(event){

        event.preventDefault();

        if ($(window).width() < 769) {
            $("body").toggleClass("show-sidebar");
        } else {
            $("body").toggleClass("hide-sidebar");
        }
    },
    'click #logout': function(evt, temp) {
    evt.preventDefault();
      Meteor.logout();
      Router.go('/');
    }

});

Template.header.onRendered(function() {
  if(Meteor.userId()) {
    $("body").removeClass("hide-sidebar");
    $("body").addClass("show-sidebar");
  } else {
    $("body").addClass("hide-sidebar");
  }
  
});

Template.header.helpers({
  user: function() {
    return Meteor.users.findOne(Meteor.userId()).profile;
  },
  stats: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.stats;
  }
});