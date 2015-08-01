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

Template.updateUser.onRendered(function() {
  $(".js-source-states-2").select2();
});  

Template.updateUser.helpers({
    user: function() {
      return Meteor.users.findOne(Meteor.userId()).profile;
    }
});

Template.contact.events({
  'submit #create': function(evt, temp) {
    evt.preventDefault();
    Bert.alert('Thanks for saying hello.', 'info');
    Meteor.call('addContact', $('#email').val(), $('#name').val(), $('#message').val());
    $('#email').val('');
    $('#name').val('');
    $('#message').val('');
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
                account: $('#account').val(),
                frequency: $('#frequency').val(),
                categories: $('#categories').val()
            };
        var user = Meteor.users.findOne(Meteor.userId());
        Meteor.call('updateUser', userDetails, user);
        Bert.alert('Your so good looking. That is all.', 'info');
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
      Session.set('age', $('#age').val());
    },
    'input #account':function(evt, templ) {
      evt.preventDefault();
      Session.set('account', $('#account').val());
    },
    'change #categories': function(evt, templ) {
      evt.preventDefault();
      var cats = $('#categories').val();
      Session.set('cats', cats);
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
    return Meteor.users.findOne(Meteor.userId()).profile;
  },
  thisUser: function() {
    var account = Meteor.users.findOne(Meteor.userId()).profile.other.account;
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
  },
    backColor: function() {
      var currentAccount = Session.get('accountType');
      if(currentAccount) {
        if(currentAccount == 'Business') {
          return 'backRed';
        } else if(account == 'Personal'){
          return 'backBlue';
        } else {
          return 'backPurple';
        } 
      } else {
        var account = Meteor.users.findOne(Meteor.userId()).profile.other.account;
        if(account == 'Business') {
          return 'backRed';
        } else if(account == 'Personal'){
          return 'backBlue';
        } else {
          return 'backPurple';
        }
      }
    },
    type: function() {
      var account = Meteor.users.findOne(Meteor.userId()).profile.other.account;
      if(account == 'Business') {
        return 'Business';
      } else if(account == 'Personal'){
        return 'Personal';
      } else {
        return 'Animal';
      }   
    },
    cats: function() {
      return Session.get('cats');
    }  
});

Template.instaWorth.onRendered(function() {
  if(Meteor.userId()){
    var account = Meteor.users.findOne(Meteor.userId()).profile.other.account;
    if(account == 'Personal') {
      Session.set('account', 'Personal');
    } else if(account == 'Business') {
     Session.set('account', 'Business');
    } else {
      Session.set('account', 'Animal');
    }
  } else {
    Session.set('account', 'Personal');
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
