  
  Template.chats.helpers({
    chats: function() {
      var user = Meteor.users.findOne(Meteor.userId());
      var chats = Chats.find({
        $or: [{'thisUser._id' : Meteor.userId()}, {'thatUser._id' : Meteor.userId()}]
      },
      {
        createdAt : -1
      }).fetch();
      return chats;
    }
  }); 

  Template.chat.helpers({
    thisUser: function() {
      var id = Meteor.userId();
      if(id == this.thatUser._id) {
        return this.thisUser;
      } else {
        return this.thatUser;
      }
    },
    messages: function() {
      var id = this._id;
      var messages = Messages.find({
        chat_id: id
      },
      {
        createdAt: -1
      });
      return messages;
    }
  });

  Template.chat.events({
    'click .stopChat': function(evt, templ) {
      Meteor.call('removeChat', this._id);
    },
    'keypress #sendChat': function(evt, templ) {
      var user = Meteor.users.findOne(Meteor.userId());
      var text = $('#sendChat').val();
      if(evt.which == 13) {
        Meteor.call('createMessage', this._id, user, text);
        $('#sendChat').val('');
      }
    }
  })

  Template.requests.helpers({
    requests: function() {
      var requests = Requests.find({ 
        'receive._id' : Meteor.userId()
      },
      {
        createdAt : -1
      }).fetch();
      return requests;
    },
    noRequests: function() {
      var count = Requests.find({ 
        'receive._id' : Meteor.userId()
      },
      {
        createdAt : -1
      }).count();
      return count < 1;
    },
    'click #reject': function(evt, templ) {
      evt.preventDefault();
      console.log(this._id);
      Meteor.call('removeRequest', this._id);
    },
    'click #accept': function(evt, templ) {
      evt.preventDefault();
      Meteor.call('removeRequest', this._id);
      
    }
  });  

Template.request.helpers({
  user: function() {
    return this.send.profile.other;
  },
  img: function() {
    return this.send.profile.profile_picture;
  },
  handle: function() {
    return this.send.profile.username;
  },
  age: function() {
    var birthdate = this.send.profile.other.age;
    var year = parseInt(birthdate.substr(birthdate.length - 4));
    var currentTime = new Date();
    var yearNow = currentTime.getFullYear();
    return yearNow - year;
  },
  id: function() {
    return this.send.profile.username;
  },
  value: function() {
    return this.send.profile.data.postValue;
  },
  followers: function() {
    return this.send.profile.stats.followed_by;
  },
  engage: function() {
    return this.send.profile.data.engagement;
  },
  userInfo: function() {
    return this.send.profile.other.gender != '' && this.send.profile.other.age != '' && this.send.profile.other.city != "" && this.send.profile.other.city != "--";;
  },
  rank: function() {
    return this.send.profile.data.rank;
  },
  panelColor: function() {
    var account = this.send.profile.other.account;
    if(account == 'Personal') {
      return 'hblue';
    } else if(account == 'Business'){
      return 'hred';
    } else {
      return 'hviolet';
    }   
  },
  online: function() {
    var user = Meteor.users.findOne(this.send._id);
    if(user.status) {
      return user.status.online;
    }
  },
  thisUser: function() {
    return this.send._id != Meteor.userId();
  }
});

  Template.request.events({
    'click #reject': function(evt, templ) {
      evt.preventDefault();
      Meteor.call('removeRequest', this._id);
    },
    'click #accept': function(evt, templ) {
      evt.preventDefault();
      Meteor.call('removeRequest', this._id);
      Meteor.call('createChat', this.send, this.receive);
    }
  });

  Template.profile.helpers({
    user: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.users.findOne(Meteor.userId()).profile.username).profile.username }
      return Meteor.users.findOne({ 'profile.username' : id }).profile
    },
    stats: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      return Meteor.users.findOne({ 'profile.username' : id }).profile.stats;
    }
  });

  Template.profile.events({
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
  });

  Template.gallery.helpers({
    posts: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      return Meteor.users.findOne({ 'profile.username' : id }).profile.posts.slice(0,5);
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
    }    
  });

  Template.myStats.helpers({
    user: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      return Meteor.users.findOne({ 'profile.username' : id }).profile;
    },
    thisUser: function() {
      var thisId = Router.current().params._id;
      var myId = Meteor.users.findOne({ _id : Meteor.userId() }).profile.username;
      return thisId == myId;
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
            grid: {
                tickColor: "#e4e5e7",
                borderWidth: 1,
                borderColor: '#e4e5e7',
                color: '#6a6c6f'
            },
            yaxis: {
                min: 0,
                max: max
            },
            colors: [ "#3498DB", "#efefef"],
        }
        ;

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
    console.log(engagement);
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

Template.engagementGrowth.onRendered(function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.engagementGrowth;
    var engageData = [];

    for (var i =0; i < engagement.length; i++) {
      engageData.push([i+1, engagement[i]]);
    }
    var chartIncomeData = [
        {
            label: "line",
            data: engageData
        }
    ];

    var chartIncomeOptions = {
        series: {
            lines: {
                show: true,
                lineWidth: 0,
                fill: true,
                fillColor: "#64cc34"

            }
        },
        colors: ["#62cb31"],
        grid: {
            show: false
        },
        legend: {
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

    for (var i =0; i < followers.length; i++) {
      followerData.push([i+1, followers[i]]);
    }
    var chartIncomeData = [
        {
            label: "line",
            data: followerData
        }
    ];

    var chartIncomeOptions = {
        series: {
            lines: {
                show: true,
                lineWidth: 0,
                fill: true,
                fillColor: "#64cc34"

            }
        },
        colors: ["#62cb31"],
        grid: {
            show: false
        },
        legend: {
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
    var followers = Meteor.users.findOne({ 'profile.username' : id }).profile.valueGrowth;
    var followerData = [];

    for (var i =0; i < followers.length; i++) {
      followerData.push([i+1, followers[i]]);
    }
    var chartIncomeData = [
        {
            label: "line",
            data: followerData
        }
    ];

    var chartIncomeOptions = {
        series: {
            lines: {
                show: true,
                lineWidth: 0,
                fill: true,
                fillColor: "#64cc34"

            }
        },
        colors: ["#62cb31"],
        grid: {
            show: false
        },
        legend: {
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