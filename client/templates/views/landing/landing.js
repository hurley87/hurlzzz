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
        Router.go('/edit'); 
      });
    }
  });

Template.updateUser.onRendered(function() {
    $('#datapicker2').datepicker();
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
    return Session.get('country');
  },
  city: function() {
    return Session.get('city');
  },
  gender: function() {
    return Session.get('gender');
  },
  age: function() {
    var birthdate = Session.get('datapicker2');
    var year = parseInt(birthdate.substr(birthdate.length - 4));
    var currentTime = new Date();
    var yearNow = currentTime.getFullYear();
    return yearNow - year;
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