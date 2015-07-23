
Template.userDescription.helpers({
  user: function() {
    return this.profile.other;
  },
  img: function() {
    return this.profile.profile_picture;
  },
  handle: function() {
    return this.profile.username;
  },
  age: function() {
    var birthdate = this.profile.other.age;
    var year = parseInt(birthdate.substr(birthdate.length - 4));
    var currentTime = new Date();
    var yearNow = currentTime.getFullYear();
    return yearNow - year;
  },
  id: function() {
    return this.profile.username;
  },
  value: function() {
    return this.profile.data.postValue;
  },
  followers: function() {
    return this.profile.stats.followed_by;
  },
  engage: function() {
    return this.profile.data.engagement;
  },
  userInfo: function() {
    return this.profile.other.gender != '' && this.profile.other.age != '' && this.profile.other.city != "" && this.profile.other.city != "--";;
  }
});

Template.leaderboard.events({
  'change #valueInput': function(evt, temp) {
    evt.preventDefault();
    var newValue = parseInt($('#valueInput').val());
    Session.set('value', newValue);
  },
  'change #followingInput': function(evt, temp) {
    evt.preventDefault();
    var newValue = parseInt($('#followingInput').val());
    Session.set('flow', newValue);
  }
});

Template.leaderboard.helpers({
	users: function() {
		return Meteor.users.find({}, {
      sort: {
        'profile.data.postValue': -1
      }
    });
	},
  eliteCount: function() {
    return Meteor.users.find().count();
  },
  selector: function() { return { 'profile.data.postValue' : { $gt : Session.get('value') }, 'profile.stats.followed_by': { $lt : Session.get('flow') } }; 
  },
  value: function() {
    return Session.get('value');
  },
  flow: function() {
    return Session.get('flow');
  }
});

Template.leaderboard.onRendered(function() {
  $('table').css({'width': '100%'});
  $('.dataTables_length').parent().hide();
  $('.dataTables_info').parent().hide();
  $('.dataTables_paginate').parent().removeClass('col-xs-6').addClass('col-xs-8');
  $('#DataTables_Table_0_filter label').css({ 'float': 'left'});
  $('.dataTables_paginate').css({ 'float': 'left' });

  $("#valueInput").TouchSpin({
      min: 0,
      max: 100000000000,
      step: 5,
      boostat: 5,
      maxboostedstep: 10
  }); 

  $('#followingInput').TouchSpin({
      min: 0,
      max: 1000000000000000,
      step: 100,
      boostat: 2000,
      maxboostedstep: 30000
  }); 
});
