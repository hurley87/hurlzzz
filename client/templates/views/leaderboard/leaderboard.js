
Template.userDescription.helpers({
  user: function() {
    return this.profile
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

Template.userDescription.onRendered(function() {
  $('.userCard').on('click', function() {
    var btns = $(this).find('.actionBtns');
    console.log(btns);
    if (btns.hasClass('hideMe')) {
      btns.removeClass('hideMe');
    } else {
      btns.addClass('hideMe');
    }
  }); 
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
  },
  'click .viewProfile': function(evt, templ) {
      evt.preventDefault();
      Router.go('/'+this.profile.username);
      var profile =  $('.thisProfile');
      var search = $('.thisSearch');
      profile.removeClass('hideMe');
      search.addClass('hideMe');
      $('.searchHeader h4').text('Search');
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

Template.profile.onRendered(function() {
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
      if(requests[i].send && requests[i].send._id == id) {
        receivers.push(requests[i].receive._id);
      }
      if(requests[i].send && requests[i].receive._id == id) {
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

Template.directMessage.helpers({
  online: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var user = Meteor.users.findOne({ 'profile.username' : id });
    if(user.status) {
      return user.status.online;
    }
  }
});

Template.topAccounts.helpers({
  users: function() {
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

