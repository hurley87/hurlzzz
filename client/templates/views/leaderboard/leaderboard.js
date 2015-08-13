
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
    if(user && user.status) {
      return user.status.online;
    } else {
      return false;
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
  'change #thisValue': function(evt, temp) {
    evt.preventDefault();
    var newValue = parseInt($('#thisValue').val());
    Session.set('thisValue', newValue);
  }
});

Template.explore.helpers({
  value: function() {
    return Session.get('value');
  },
  thisValue: function() {
    return Session.get('thisValue');
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
    return { 
       'profile.data.postValue' : { $gt : Session.get('value'), $lt: Session.get('thisValue') }
    }; 
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

  $('#thisValue').TouchSpin({
      min: 0,
      max: 100000000000,
      step: 5,
      boostat: 5,
      maxboostedstep: 10
  }); 
});


