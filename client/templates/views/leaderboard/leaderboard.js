
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
    return this._id;
  },
  value: function() {
    return this.profile.data.postValue;
  }
});

Template.leaderboard.events({
  'change #valueInput': function(evt, temp) {
    evt.preventDefault();
    var newValue = parseInt($('#valueInput').val());
    Session.set('value', newValue);
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
  selector: function() { return { 'profile.data.postValue' : { $gt : Session.get('value') } }; 
  },
  value: function() {
    return Session.get('value');
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
});
