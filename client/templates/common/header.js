Template.header.events({

    'click .hide-menu': function(event){
        event.preventDefault();
        $("body").toggleClass("hide-sidebar");
    },
    'click #logout': function(evt, temp) {
    evt.preventDefault();
      Meteor.logout();
      Router.go('/');
    }

});

Template.header.onRendered(function() {
});

Template.header.helpers({
  user: function() {
    return Meteor.users.findOne(Meteor.userId()).profile;
  },
  stats: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.stats;
  }
});