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

