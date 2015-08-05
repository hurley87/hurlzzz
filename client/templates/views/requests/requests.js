
  Template.requests.helpers({
    requests: function() {
      var requests = Requests.find({ 
        'receive._id' : Meteor.userId()
      },
      {
        createdAt : -1
      }).fetch();
      return requests;
    },
    noRequests: function() {
      var count = Requests.find({ 
        'receive._id' : Meteor.userId()
      },
      {
        createdAt : -1
      }).count();
      return count < 1;
    },
    'click #reject': function(evt, templ) {
      evt.preventDefault(); 
      Bert.alert('You rejected @' + this.send.profile.username + '\'s chat request.', 'danger');
      Meteor.call('requestRejectedEmail', this.send, this.receive);
      Meteor.call('removeRequest', this._id);
      analytics.track('Reject Request', {
        send: send,
        receive: receive,
        user: Meteor.users.findOne(Meteor.userId())
      });
    },
    'click #accept': function(evt, templ) {
      evt.preventDefault();
      Bert.alert('You accepted @' + this.send.profile.username + '\'s chat request.', 'info');
      Meteor.call('removeRequest', this._id);
      Meteor.call('createChat', this.send, this.receive);
      Meteor.call('requestAcceptedEmail', this.send, this.receive);
      analytics.track('Chat Start', {
        send: send,
        receive: receive,
        user: Meteor.users.findOne(Meteor.userId())
      });
    }
  });  

Template.request.helpers({
  user: function() {
    return this.send.profile.other;
  },
  img: function() {
    return this.send.profile.profile_picture;
  },
  handle: function() {
    return this.send.profile.username;
  },
  age: function() {
    var birthdate = this.send.profile.other.age;
    var year = parseInt(birthdate.substr(birthdate.length - 4));
    var currentTime = new Date();
    var yearNow = currentTime.getFullYear();
    return yearNow - year;
  },
  id: function() {
    return this.send.profile.username;
  },
  value: function() {
    return this.send.profile.data.postValue;
  },
  followers: function() {
    return this.send.profile.stats.followed_by;
  },
  engage: function() {
    return this.send.profile.data.engagement;
  },
  userInfo: function() {
    return this.send.profile.other.gender != '' && this.send.profile.other.age != '' && this.send.profile.other.city != "" && this.send.profile.other.city != "--";;
  },
  rank: function() {
    return this.send.profile.data.rank;
  },
  panelColor: function() {
    var account = this.send.profile.other.account;
    if(account == 'Personal') {
      return 'hblue';
    } else if(account == 'Business'){
      return 'hred';
    } else {
      return 'hviolet';
    }   
  },
  online: function() {
    var user = Meteor.users.findOne(this.send._id);
    if(user.status) {
      return user.status.online;
    }
  },
  thisUser: function() {
    return this.send._id != Meteor.userId();
  }
});

  Template.request.events({
    'click #reject': function(evt, templ) {
      evt.preventDefault();
      Bert.alert('You rejected @' + this.send.profile.username + '\'s chat request.', 'danger');
      Meteor.call('removeRequest', this._id);
      analytics.track('Accept Request', {
        send: send,
        receive: receive,
        user: Meteor.users.findOne(Meteor.userId())
      });
    },
    'click #accept': function(evt, templ) {
      evt.preventDefault();
      Meteor.call('removeRequest', this._id);
      Bert.alert('You accepted @' + this.send.profile.username + '\'s chat request.', 'info');
      Meteor.call('createChat', this.send, this.receive);
      analytics.track('Chat Start', {
        send: send,
        receive: receive,
        user: Meteor.users.findOne(Meteor.userId())
      });
    }
  });
