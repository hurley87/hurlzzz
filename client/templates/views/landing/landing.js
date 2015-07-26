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

Template.updateUser.onRendered(function() {
  $(document).ready(function() {
    $('#datapicker2').datepicker();
    $('#datapicker').datepicker();
  });
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
                dob: $('#datapicker2').val()
            };
        var user = Meteor.users.findOne(Meteor.userId());
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
    'change #datapicker2': function(evt, templ) {
      evt.preventDefault();
      Session.set('datapicker2', $('#datapicker2').val());
    }
});

Template.instaWorth.helpers({
  country: function() {
    if(Session.get('country')) {
      return Session.get('country');
    } else {
      return '';
    }
  },
  city: function() {
    if(Session.get('city')) {
      return Session.get('city');
    } else {
      return '';
    }    
  },
  gender: function() {
    if(Session.get('gender')) {
      return Session.get('gender');
    } else {
      return '';
    }
  },
  age: function() {
    if(Session.get('datapicker2')) {
      var birthdate = Session.get('datapicker2');
      var year = parseInt(birthdate.substr(birthdate.length - 4));
      var currentTime = new Date();
      var yearNow = currentTime.getFullYear();
      return yearNow - year;     
    } else {
      return '';
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
