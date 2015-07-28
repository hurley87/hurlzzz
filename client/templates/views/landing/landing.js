  Template.hey.events({
    'click .insta': function(evt, temp) {
      evt.preventDefault();
      Meteor.loginWithInstagram(function (err, res) {
      	console.log(res);
        if (err !== undefined) {
          console.log('sucess ' + res);
        } else {
          console.log('login failed ' + err);
        }
        var users = Meteor.users.find({}, { sort: { 'profile.data.postValue': -1 } }).fetch();
        Meteor.call('setRank', users);
        Router.go('/edit'); 
      });
    }
  });

Template.updateUser.helpers({
    user: function() {
      if(Meteor.userId()) {
        return Meteor.users.findOne(Meteor.userId()).profile;
      }  
    }
});

Template.updateUser.events({
    'submit #update': function(evt, temp) {
        evt.preventDefault();
        var userDetails = {
                city: $('#city').val(),
                country: $('#country').val(),
                email: $('#email').val(),
                sex: $("#gender").val(),
                dob: $('#age').val(),
                account: $('#account').val()
            };
        var user = Meteor.users.findOne(Meteor.userId());
        console.log(userDetails);
        Meteor.call('updateUser', userDetails, user);
        Router.go('/');
    },
    'input #country': function(evt, templ) {
      evt.preventDefault();
      Session.set('country', $('#country').val());
    },
    'input #city': function(evt, templ) {
      evt.preventDefault();
      Session.set('city', $('#city').val());
    },
    'input #gender': function(evt, templ) {
      evt.preventDefault();
      Session.set('gender', $('#gender').val());
    },
    'change #age': function(evt, templ) {
      evt.preventDefault();
      console.log($('#age').val());
      Session.set('age', $('#age').val());
    },
    'input #account':function(evt, templ) {
      evt.preventDefault();
      console.log($('#account').val());
      Session.set('account', $('#account').val());
    }
});

Template.instaWorth.helpers({
  country: function() {
    if(Session.get('country')) {
      return Session.get('country');
    } else {
      return 'Canada';
    }
  },
  city: function() {
    if(Session.get('city')) {
      return Session.get('city');
    } else {
      return 'Toronto';
    }    
  },
  gender: function() {
    if(Session.get('gender')) {
      return Session.get('gender');
    } else {
      return 'male';
    }
  },
  age: function() {
    if(Session.get('age')) {
      return Session.get('age');    
    } else {
      return 20;
    }
  },
  user: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    return Meteor.users.findOne({ 'profile.username' : id }).profile;
  },
  thisUser: function() {
    var thisId = Router.current().params._id;
    if(!thisId) { thisId = Meteor.users.findOne(Meteor.userId()).profile.username}
    var myId = Meteor.users.findOne({ 'profile.username' : id }).profile.username;
    return thisId == myId;
  },
  color: function() {
    if(Session.get('account') == 'Personal') {
      return 'hblue';
    } else if(Session.get('account') == 'Business') {
      return 'hred';
    } else {
      return 'hviolet'
    }
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
