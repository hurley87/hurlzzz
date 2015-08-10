
  Template.profile.helpers({
    user: function() {
      var id = Router.current().params._id;
      if(id == undefined) { id = Meteor.users.findOne(Meteor.userId()).profile.username; }
      return Meteor.users.findOne({ 'profile.username' : id }).profile;
    },
    stats: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      return Meteor.users.findOne({ 'profile.username' : id }).profile.stats;
    },
    growth: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      var length = Meteor.users.findOne({ 'profile.username' : id }).profile.followerGrowth.length;
      return length > 2;
    },
    ratio: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username }
      var followed = Meteor.users.findOne({ 'profile.username' : id }).profile.stats.followed_by;
      var followers = Meteor.users.findOne({ 'profile.username' : id }).profile.stats.follows;
      return (followed/followers).toFixed(2);
    },
    thisUser: function() {
      var homePath = Router.current().location.get().path;
      var path = Router.current().params._id;
      var username = Meteor.users.findOne(Meteor.userId()).profile.username;

      if(homePath == '/' || path == username ) {
        return true;
      } else {
        return false;
      }
    },
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
  },
  joined: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var createdAt = Meteor.users.findOne({ 'profile.username' : id }).createdAt;
    return moment(createdAt).fromNow();
  },
  myList: function() {

  } 
  });

  Template.profile.events({
    'click #signMeUp': function(evt, temp) {
        evt.preventDefault();
        Meteor.loginWithInstagram(function (err, res) {
          if (err !== undefined) {
            console.log('sucess ' + res);
          } else {
            console.log('login failed ' + err);
          }
          var users = Meteor.users.find({}, { sort: { 'profile.data.postValue': -1 } }).fetch();
          Router.go('/edit'); 
        });
    },
    'click .moreInfo': function(evt, templ) {
      evt.preventDefault();
      var analytics = $('.analytics');
      if(analytics.hasClass('hideMe')) {
        analytics.removeClass('hideMe').addClass('showMe');
      } else {
        analytics.removeClass('showMe').addClass('hideMe');
      }
    },
    'click .searchHeader': function(evt, templ) {
      evt.preventDefault();
      var profile =  $('.thisProfile');
      var search = $('.thisSearch');

      if(profile.hasClass('hideMe')) {
        profile.removeClass('hideMe');
        search.addClass('hideMe');
        $('.searchHeader h4').text('Search');
      } else {
        search.removeClass('hideMe');
        profile.addClass('hideMe');
        $('.searchHeader h4').text('Profile');
      }
    } 
  });

Template.slackMessage.helpers({
  ago: function() {

  },
  text: function() {
    var text = this.text;
    return $('<div/>').html(text).text();
  }
});

Template.slackMessage.onRendered(function() {
  $('.thisText').each(function() {
    var text  = $(this).data('text');
    $(this).html(text);
  });
});

Template.slackChat.onRendered(function() {
    $('.summerNote').trigger('focus');
    $(".slackMessages").animate({ scrollTop: $('.slackMessages')[0].scrollHeight}, 1000);
});

Template.slackChat.events({
  'click .clearMessage':function(evt, templ) {
    $('.summerNote').val('');
  },
  'click .sendMessage':function(evt, templ) {
    var thisUser = Meteor.users.findOne(Meteor.userId());
    var id = Router.current().params._id;
    var thatUser = Meteor.users.findOne({ 'profile.username' : id });
    var text = $('.summerNote').val();
    var createdAt = new Date();
    Meteor.call('createMessage', thatUser, thisUser, text, createdAt);
    analytics.track('Send Message', {
      chat: this,
      user: Meteor.users.findOne(Meteor.userId())
    });
    $('.summerNote').val('');  
    $(".slackMessages").animate({ scrollTop: $('.slackMessages')[0].scrollHeight}, 1000);  
  }
});

Template.slackChat.helpers({
  thisUser: function() {
    var path = Router.current().location.get().path;
    var username ='/' + Meteor.users.findOne(Meteor.userId()).profile.username;
    if(path == '/' || path == username) {
      return true;
    } else {
      return false;
    }
  },
  user: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    return Meteor.users.findOne({ 'profile.username' : id });
  },
  messages: function() {
    var id = Router.current().params._id;
    var thatUser = Meteor.users.findOne({ 'profile.username' : id });
    var messages = Messages.find({
      $or: [{'thatUser._id' : thatUser._id, 'thisUser._id': Meteor.userId()}, 
      {'thatUser._id' : Meteor.userId(), 'thisUser._id': thatUser._id }]
    },
    {

    });
    return messages;
  }
});

  Template.gallery.helpers({
    posts: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      return Meteor.users.findOne({ 'profile.username' : id }).profile.posts;
    },
    backColor: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      var account = Meteor.users.findOne({ 'profile.username' : id }).profile.other.account;
      if(account == 'Business') {
        return 'backBlue';
      } else if(account == 'Personal'){
        return 'backBlue';
      } else {
        return 'backBlue';
      }   
    }    
  });

  Template.myStats.helpers({
    user: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      return Meteor.users.findOne({ 'profile.username' : id }).profile;
    },
    thisUser: function() {
      var path = Router.current().location.get().path;
      var username ='/' + Meteor.users.findOne(Meteor.userId()).profile.username;
      if(path == '/' || path == username) {
        return true;
      } else {
        return false;
      }
    },
    age: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      var birthdate = Meteor.users.findOne({ 'profile.username' : id }).profile.other.age;
      var birthdate = Session.get('datapicker2');
      if(birthdate) {
        var year = parseInt(birthdate.substr(birthdate.length - 4));
        var currentTime = new Date();
        var yearNow = currentTime.getFullYear();
        return yearNow - year;
      } else {
        return '';
      }
      },
  showRequest: function() {
    var chats =  Chats.find({}).fetch();
    var inChat = false;
    var id = Router.current().params._id;
    var userId = Meteor.users.findOne({ 'profile.username' : id })._id;

    for (var i=0; i < chats.length; i++) {
      if(chats[i].thisUser._id == userId && chats[i].thatUser._id == Meteor.userId()) {
        inChat = true;
      }
      if(chats[i].thatUser._id == userId && chats[i].thisUser._id == Meteor.userId()) {
        inChat = true;
      }
    }
    return !inChat;
    },
    panelColor: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      var account = Meteor.users.findOne({ 'profile.username' : id }).profile.other.account;
      if(account == 'Personal') {
        return 'hblue';
      } else if(account == 'Business'){
        return 'hred';
      } else {
        return 'hviolet';
      }   
    },
    backColor: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      var account = Meteor.users.findOne({ 'profile.username' : id }).profile.other.account;
      if(account == 'Business') {
        return 'backRed';
      } else if(account == 'Personal'){
        return 'backBlue';
      } else {
        return 'backPurple';
      }   
    },
    type: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      var account = Meteor.users.findOne({ 'profile.username' : id }).profile.other.account;
      if(account == 'Business') {
        return 'Business';
      } else if(account == 'Personal'){
        return 'Personal';
      } else {
        return 'Animal';
      }   
    },
    joined: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      var createdAt = Meteor.users.findOne({ 'profile.username' : id }).createdAt;
      return moment(createdAt).fromNow();
    }
  });


  Template.analytics.helpers({
    user: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      return Meteor.users.findOne({ 'profile.username' : id }).profile;
    },
    textColor: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      var account = Meteor.users.findOne({ 'profile.username' : id }).profile.other.account;
      if(account == 'Personal') {
        return 'blueText';
      } else if(account == 'Business'){
        return 'redText';
      } else {
        return 'purpleText';
      }
    },
    panelColor: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      var account = Meteor.users.findOne({ 'profile.username' : id }).profile.other.account;
      if(account == 'Personal') {
        return 'hblue';
      } else if(account == 'Business'){
        return 'hred';
      } else {
        return 'hviolet';
      }   
    }
  });

  Template.analytics.onRendered(function(){
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var likes = Meteor.users.findOne({ 'profile.username' : id }).profile.data.likes;
    var comments = Meteor.users.findOne({ 'profile.username' : id }).profile.data.comments;
    var max = _.max(_.flatten(likes))

    var data5 = [
        { data: likes, label: "likes"},
        { data: comments, label: "comments"}
    ];

    var chartUsersOptions5 = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            yaxis: {
                min: 0,
                max: max
            },
            colors: [ "#3498DB", "#efefef"],
            labels: {
              show: false
            }
        };

    $.plot($("#flot-line-chart"), data5, chartUsersOptions5);


});

Template.engagementGrowth.helpers({
  today: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.engagementGrowth;
    return engagement[engagement.length - 1];
  },
  lastWeek: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.engagementGrowth;
    return engagement[0];
  },
  increase: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.engagementGrowth;
    var big = engagement[engagement.length - 1]; 
    var small = engagement[0];
    return ((big - small)/small*100 ).toFixed(1);
  }
});  

Template.engagementGrowth.onRendered(function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.engagementGrowth;
    var engageData = [];
    var max = _.max(_.flatten(engagement))*1.25;

    for (var i =0; i < engagement.length; i++) {
      engageData.push([i+1, engagement[i]]);
    }
    var chartIncomeData = [
        {
            label: "engagement",
            data: engageData
        }
    ];

    var chartIncomeOptions = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            yaxis: {
                min: 0,
                max: max
            },
            colors: [ "#3498DB"],
            labels: {
              show: false
            }
        };

    $.plot($("#engagement-chart"), chartIncomeData, chartIncomeOptions);
}); 

Template.followerGrowth.helpers({
  today: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.followerGrowth;
    return engagement[engagement.length - 1];
  },
  lastWeek: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.followerGrowth;
    return engagement[0];
  },
  increase: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.followerGrowth;
    var big = engagement[engagement.length - 1]; 
    var small = engagement[0];
    return ((big - small)/small*100 ).toFixed(1);
  },
  textColor: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var account = Meteor.users.findOne({ 'profile.username' : id }).profile.other.account;
    if(account == 'Personal') {
      return 'blueText';
    } else if(account == 'Business'){
      return 'redText';
    } else {
      return 'purpleText';
    }
  },
  panelColor: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var account = Meteor.users.findOne({ 'profile.username' : id }).profile.other.account;
    if(account == 'Personal') {
      return 'hblue';
    } else if(account == 'Business'){
      return 'hred';
    } else {
      return 'hviolet';
    }   
  }
}); 

Template.followerGrowth.onRendered(function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var followers = Meteor.users.findOne({ 'profile.username' : id }).profile.followerGrowth;
    var followerData = [];
    var max = _.max(_.flatten(followers))*1.25;

    for (var i =0; i < followers.length; i++) {
      followerData.push([i+1, followers[i]]);
    }

    var chartIncomeData = [
        {
            label: "followers",
            data: followerData
        }
    ];

    var chartIncomeOptions = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            yaxis: {
                min: 0,
                max: max
            },
            colors: [ "#3498DB"],
            labels: {
              show: false
            }
        };

    $.plot($("#follower-chart"), chartIncomeData, chartIncomeOptions);
});

Template.valueGrowth.helpers({
  today: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.valueGrowth;
    return engagement[engagement.length - 1];
  },
  lastWeek: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.valueGrowth;
    return engagement[0];
  },
  increase: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.valueGrowth;
    var big = engagement[engagement.length - 1]; 
    var small = engagement[0];
    return ((big - small)/small*100 ).toFixed(1);
  },
    textColor: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      var account = Meteor.users.findOne({ 'profile.username' : id }).profile.other.account;
      if(account == 'Personal') {
        return 'blueText';
      } else if(account == 'Business'){
        return 'redText';
      } else {
        return 'purpleText';
      }
    },
    panelColor: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      var account = Meteor.users.findOne({ 'profile.username' : id }).profile.other.account;
      if(account == 'Personal') {
        return 'hblue';
      } else if(account == 'Business'){
        return 'hred';
      } else {
        return 'hviolet';
      }   
    }
}); 

Template.valueGrowth.onRendered(function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var value = Meteor.users.findOne({ 'profile.username' : id }).profile.valueGrowth;
    var followerData = [];
    var max = _.max(_.flatten(value))*1.25;

    for (var i =0; i < value.length; i++) {
      followerData.push([i+1, value[i]]);
    }
    var chartIncomeData = [
        {
            label: "value",
            data: followerData
        }
    ];

    var chartIncomeOptions = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            yaxis: {
                min: 0,
                max: max
            },
            colors: [ "#3498DB"],
            labels: {
              show: false
            }
        };

    $.plot($("#value-chart"), chartIncomeData, chartIncomeOptions);
});  

 

  Meteor.Spinner.options = {
    lines: 10, 
    length: 40, // The length of each line
    width: 15, // The line thickness
    radius: 15, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#517fa4', // #rgb or #rrggbb
    speed: 1.4, // Rounds per second
    trail: 75, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '300px', // Top position relative to parent in px
    left: '50%' // Left position relative to parent in px
};

Bert.defaults.hideDelay = 1500;