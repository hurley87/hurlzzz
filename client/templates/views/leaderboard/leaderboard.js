
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
  },
  online: function() {
    var user = Meteor.users.findOne(this._id);
    if(user.status) {
      return user.status.online;
    }
  },
  showRequest: function() {
    var chats =  Chats.find({}).fetch();
    console.log(chats);
    var inChat = false;
    for (var i=0; i < chats.length; i++) {
      
      if(chats[i].thisUser._id == this._id && chats[i].thatUser._id == Meteor.userId()) {
        inChat = true;
      }
      if(chats[i].thatUser._id == this._id && chats[i].thisUser._id == Meteor.userId()) {
        inChat = true;
      }
    }
    if(inChat) {
      return false;
    } else {
      return this._id != Meteor.userId();
    }
  }
});

Template.userDescription.events({
  'click .request': function(evt, templ) {
    evt.preventDefault();
    var receive = Meteor.users.findOne(this._id);
    var send = Meteor.users.findOne(Meteor.userId());
    Meteor.call('requestEmail', send, receive);
    Meteor.call('sendRequest', send, receive);
    analytics.track('Request', {
      send: send,
      receive: receive
    });
    Bert.alert('Chat request sent to @' + receive.profile.username, 'info');
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
  selector: function() { 
    if(Meteor.userId()) { 
      var myUsername = Meteor.users.findOne(Meteor.userId()).profile.username;
      var id = Meteor.userId();
      var requests = Requests.find({}).fetch();
      var receivers = [];

      for(var i=0; i < requests.length; i++) {
        if(requests[i].send._id == id) {
          receivers.push(requests[i].receive._id);
        }
        if(requests[i].receive._id == id) {
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

Template.leaderboard.events({
  'click #signMeUp': function(evt, temp) {
      evt.preventDefault();
      Meteor.loginWithInstagram(function (err, res) {
        if (err !== undefined) {
          console.log('sucess ' + res);
        } else {
          console.log('login failed ' + err);
        }
        var users = Meteor.users.find({}, { sort: { 'profile.data.postValue': -1 } }).fetch();
        Meteor.call('setRank', users);
        Bert.alert('Welcome! Have a nice day.', 'info');
        Router.go('/edit'); 
      });
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

Template.topAccounts.helpers({
  firstFive: function() {
    var id = Meteor.userId();
    var requests = Requests.find({}).fetch();
    var receivers = [];
    for(var i=0; i < requests.length; i++) {
      if(requests[i].send._id == id) {
        receivers.push(requests[i].receive._id);
      }
      if(requests[i].receive._id == id) {
        receivers.push(requests[i].send._id);
      }
    }

    return Meteor.users.find({
      _id: { $not : { $in : receivers }}
    }, {
      sort: {
        'profile.data.postValue': -1
      },
      limit: 10
    });
  }
});

Template.recentlyAdded.helpers({
  users: function() {
    var id = Meteor.userId();
    var requests = Requests.find({}).fetch();
    var receivers = [];
    for(var i=0; i < requests.length; i++) {
      if(requests[i].send._id == id) {
        receivers.push(requests[i].receive._id);
      }
      if(requests[i].receive._id == id) {
        receivers.push(requests[i].send._id);
      }
    }

    return Meteor.users.find({
      _id: { $not : { $in : receivers }}
    }, {
      sort: {
        createdAt: -1
      },
      limit: 5
    });
  }
});

Template.activeUsers.helpers({
  users: function() {
    var id = Meteor.userId();
    var requests = Requests.find({}).fetch();
    var receivers = [];
    for(var i=0; i < requests.length; i++) {
      if(requests[i].send._id == id) {
        receivers.push(requests[i].receive._id);
      }
      if(requests[i].receive._id == id) {
        receivers.push(requests[i].send._id);
      }
    }

    return Meteor.users.find({
      'status.online' : true,
      _id: { $not : { $in : receivers }}
    }, {
      sort: {
        'profile.data.postValue': -1
      },
      limit: 10
    });
  }
});

Template.valueChart.onRendered(function() {
  Session.set('accountType', 'Personal');
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

  console.log(singleBarData);

  var ctx = document.getElementById("singleBarOptions").getContext("2d");
  var myNewChart = new Chart(ctx).Bar(singleBarData, singleBarOptions);
});

Template.featuredAccounts.helpers({
  randos: function() {
    var id = Meteor.userId();
    var requests = Requests.find({}).fetch();
    var receivers = [];
    for(var i=0; i < requests.length; i++) {
      if(requests[i].send._id == id) {
        receivers.push(requests[i].receive._id);
      }
      if(requests[i].receive._id == id) {
        receivers.push(requests[i].send._id);
      }
    }

    var users = Meteor.users.find({
      _id: { $not : { $in : receivers }}
    }).fetch();
    return _.shuffle(users).slice(0,10);
  }  
});
