
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
  },
  rank: function() {
    return this.profile.data.rank;
  },
  panelColor: function() {
    var account = this.profile.other.account;
    if(account == 'Personal') {
      return 'hblue';
    } else if(account == 'Business'){
      return 'hred';
    } else {
      return 'hviolet';
    }   
  }
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
  selector: function() { return { 'profile.data.postValue' : { $gt : Session.get('value') }, 'profile.stats.followed_by': { $lt : Session.get('flow') } }; 
  }
});

Template.leaderboard.events({
  'click #signMeUp': function(evt, temp) {
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
})

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

Template.topAccounts.helpers({
  firstFive: function() {
    return Meteor.users.find({}, {
      sort: {
        'profile.data.postValue': -1
      },
      limit: 5
    });
  },

});

Template.valueChart.onRendered(function() {

  var lessFifty = Meteor.users.find({ 'profile.data.postValue' : { $lt: 50 }}).count(); 
  var lessHundred = Meteor.users.find({ 'profile.data.postValue' : { $lt: 100, $gt:50 }}).count();
  var lessOneFifty = Meteor.users.find({ 'profile.data.postValue' : { $lt: 150, $gt:100 }}).count();
  var lessTwoHund = Meteor.users.find({ 'profile.data.postValue' : { $lt: 200, $gt:150 }}).count();
  var lessTwoFifty = Meteor.users.find({ 'profile.data.postValue' : { $lt: 250, $gt:200 }}).count();
  var greaterTwoHun = Meteor.users.find({ 'profile.data.postValue' : { $gt:200 }}).count();

  var singleBarData = {
      labels: ["$0-$50", "$50-$99", "$100-$149", "$150-$199", "$200-$249", "$250+"],
      datasets: [
          {
              label: "My Second dataset",
              fillColor: "rgba(98,203,49,0.5)",
              strokeColor: "rgba(98,203,49,0.8)",
              highlightFill: "rgba(98,203,49,0.75)",
              highlightStroke: "rgba(98,203,49,1)",
              data: [lessFifty, lessHundred, lessOneFifty, lessTwoHund, lessTwoFifty, greaterTwoHun]
          }
      ]
  };

  var ctx = document.getElementById("singleBarOptions").getContext("2d");
  var myNewChart = new Chart(ctx).Bar(singleBarData, singleBarOptions);
});

Template.featuredAccounts.helpers({
  randos: function() {
    var users = Meteor.users.find().fetch();
    return _.shuffle(users).slice(0,5);
  }  
});
