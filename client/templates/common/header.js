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
    },
    'click .reject': function(evt, templ) {
      evt.preventDefault();
      Meteor.call('removeRequest', this._id);
    },
    'click .accept': function(evt, templ) {
      evt.preventDefault();
      Meteor.call('removeRequest', this._id);
      Meteor.call('createChat', this.send, this.receive);
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
  },
  requestCount: function() {
    var count = Requests.find({
      'receive._id' : Meteor.userId()
    }).count();

    return count;
  },
  requests: function() {
    return Requests.find({
      'receive._id' : Meteor.userId()
    });
  },
  noRequests: function() {
    var count = Requests.find({
      'receive._id' : Meteor.userId()
    }).count();
    return count < 1;
  },
  chatCount: function() {
    var count = Chats.find({
      $or: [{'thisUser._id' : Meteor.userId()}, {'thatUser._id' : Meteor.userId()}]
    }).count();
    return count;
  },
  chats: function() {
    return Chats.find({
      $or: [{'thisUser._id' : Meteor.userId()}, {'thatUser._id' : Meteor.userId()}]
    });
  },
  noChats: function() {
    var count = Chats.find({
      $or: [{'thisUser._id' : Meteor.userId()}, {'thatUser._id' : Meteor.userId()}]
    }).count();
    return count < 1;
  }
});

Template.quickChat.helpers({
  user: function() {
    var user = Meteor.userId();
    if(user == this.thisUser._id) {
      return this.thatUser;
    } else {
      return this.thisUser;
    }
  },
  online: function() {
    var user = Meteor.userId();
    if(user == this.thisUser._id) {
      return this.thatUser.status.online;
    } else {
      return this.thisUser.status.online;
    }
  }
});