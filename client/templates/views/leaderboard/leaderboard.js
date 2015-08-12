
Template.userDescription.helpers({
  img: function() {
    return this.profile.profile_picture;
  },
  handle: function() {
    return this.profile.username;
  },
  id: function() {
    return this.profile.username;
  },
  value: function() {
    return this.profile.data.postValue;
  },
  online: function() {
    var user = Meteor.users.findOne(this._id);
    if(user.status) {
      return user.status.online;
    }
  }
});

Template.userDescription.onRendered(function() {
  $('.userCard').on('click', function() {
    var snapper = new Snap({
      element: document.getElementById('snapper')
    });
    snapper.close();
  }); 
}); 

Template.explore.events({
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

Template.explore.helpers({
  value: function() {
    return Session.get('value');
  },
  flow1: function() {
    var followers = Session.get('flow');
    var num = accounting.formatNumber(parseInt(followers));
    return num;
  },
  flow2: function() {
    return Session.get('flow');
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
  selector: function() { 
    if(Meteor.users.findOne(Meteor.userId())) { 
      var myUsername = Meteor.users.findOne(Meteor.userId()).profile.username;
      var id = Meteor.userId();
      var requests = Requests.find({}).fetch();
      var receivers = [];

      for(var i=0; i < requests.length; i++) {
        if(requests[i].send && requests[i].send._id == id) {
          receivers.push(requests[i].receive._id);
        }
        if(requests[i].send && requests[i].receive._id == id) {
          receivers.push(requests[i].send._id);
        }
      } 
      return { 
        'profile.data.postValue' : { $gt : Session.get('value') }, 
        'profile.stats.followed_by': { $lt : Session.get('flow') }, 
        'profile.username' : { $ne : myUsername },
        _id: { $not : { $in : receivers }}
      };
    } else {
      return { 
         'profile.data.postValue' : { $gt : Session.get('value') },
         'profile.stats.followed_by': { $lt : Session.get('flow') }
      }; 
    } 
  }
});

Template.leaderboard.onRendered(function() {
  $('table').css({'width': '100%'});
  $('.dataTables_length').parent().hide();
  $('.dataTables_info').parent().hide();
  $('.dataTables_paginate').parent().removeClass('col-xs-6').addClass('col-xs-12');
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


