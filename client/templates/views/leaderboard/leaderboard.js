Template.leaderboard.helpers({
	users: function() {
		return Meteor.users.find({}, {
      sort: {
        'profile.data.postValue': -1
      }
    });
	},
  elites: function() {
    return Meteor.users.find({
      'profile.data.postValue' : {
        $gt : 100
      }
    },
    {
      sort: { 'profile.data.postValue': -1 }
    });
  },
  allstars: function() {
     return Meteor.users.find({
      'profile.data.postValue' : {
        $lt : 100
      }
    },
    {
      sort: { 'profile.data.postValue': -1 }
    });   
  },
  eliteCount: function() {
    return Meteor.users.find().count();
  } 
});

Template.leaderboard.onRendered(function() {
  $('table').css({'width': '100%'});
  $('.dataTables_length').parent().hide();
  $('.dataTables_info').parent().hide();
  $('.dataTables_paginate').parent().removeClass('col-xs-6').addClass('col-xs-8');
  $('#DataTables_Table_0_filter label').css({ 'float': 'left' });
  $('.dataTables_paginate').css({ 'float': 'left' });
});
