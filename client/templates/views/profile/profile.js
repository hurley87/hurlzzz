  
Template.timeChart.events({

});

Template.timeChart.onRendered(function() {
Tracker.autorun(function() {
    var username = Router.current().params._id;
    if(!username) { username = Meteor.users.findOne(Meteor.userId()).profile.username}
    var value = Meteor.users.findOne({ 'profile.username' : username }).profile.valueGrowth;
    var engagement = Meteor.users.findOne({ 'profile.username' : username }).profile.engagementGrowth;
    var followers  = Meteor.users.findOne({ 'profile.username' : username }).profile.followerGrowth;

    var valueLabel = [];
    var engagementLabel = [];
    var followersLabel = [];

    for(var i =1; i <= value.length; i++) {
      valueLabel.push(i);
    }

    for(var i =1; i <= value.length; i++) {
      engagementLabel.push(i);
    }

    for(var i =1; i <= value.length; i++) {
      followersLabel.push(i);
    }

    var line = {
      label: valueLabel,
      data: value
    };

    var lineData = {
        labels: line.label,
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(98,203,49,0.5)",
                strokeColor: "rgba(98,203,49,0.7)",
                pointColor: "rgba(98,203,49,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: line.data
            }
        ]
    };

    $('#value').on('click', function(evt) {
      evt.preventDefault();
      $('.graph-btn').addClass('btn-outline');
      $('#value').removeClass('btn-outline');
      line = {
        label: valueLabel,
        data: value
      };
lineData = {
        labels: line.label,
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(98,203,49,0.5)",
                strokeColor: "rgba(98,203,49,0.7)",
                pointColor: "rgba(98,203,49,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: line.data
            }
        ]
    };
    ctx = document.getElementById("lineOptions").getContext("2d");
    myNewChart = new Chart(ctx).Line(lineData, lineOptions);
    });

    $('#followers').on('click', function(evt) {
      evt.preventDefault();
      $('.graph-btn').addClass('btn-outline');
      $(this).removeClass('btn-outline');
      line = {
        label: followersLabel,
        data: followers
      };
      lineData = {
        labels: line.label,
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(98,203,49,0.5)",
                strokeColor: "rgba(98,203,49,0.7)",
                pointColor: "rgba(98,203,49,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: line.data
            }
        ]
    };
    ctx = document.getElementById("lineOptions").getContext("2d");
    myNewChart = new Chart(ctx).Line(lineData, lineOptions);
    });

    $('#engagement').on('click', function(evt) {
      evt.preventDefault();
      $('.graph-btn').addClass('btn-outline');
      $(this).removeClass('btn-outline');
      line = {
        label: engagementLabel,
        data: engagement
      };
lineData = {
        labels: line.label,
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(98,203,49,0.5)",
                strokeColor: "rgba(98,203,49,0.7)",
                pointColor: "rgba(98,203,49,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: line.data
            }
        ]
    };
    ctx = document.getElementById("lineOptions").getContext("2d");
    myNewChart = new Chart(ctx).Line(lineData, lineOptions);
    });
    
      var lineOptions = {
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        bezierCurve : false,
        pointDot : true,
        pointDotRadius : 3,
        pointDotStrokeWidth : 1,
        pointHitDetectionRadius : 20,
        datasetStroke : false,
        datasetStrokeWidth : 1,
        datasetFill : true,
        responsive: true,
        tooltipTemplate: "<%= value %>",
        showTooltips: true,
        onAnimationComplete: function()
        {
            this.showTooltip(this.datasets[0].points, true);
        },
        tooltipEvents: []

    };


    var ctx = document.getElementById("lineOptions").getContext("2d");
    var myNewChart = new Chart(ctx).Line(lineData, lineOptions);

  });
});

  Template.chats.helpers({
    chats: function() {
      var chats = Chats.find({
        $or: [{'thisUser._id' : Meteor.userId()}, {'thatUser._id' : Meteor.userId()}]
      },
      {
        createdAt : -1
      }).fetch();
      return chats;
    },
    chatCount: function() {
      var count = Chats.find({
        $or: [{'thisUser._id' : Meteor.userId()}, {'thatUser._id' : Meteor.userId()}]
      },
      {
        createdAt : -1
      }).count();
      return count < 1;
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
        sort: {
          createdAt: -1
        }
      });
      return messages;
    },
    time: function() {
      return moment(this.createdAt).format("MM-DD-YYYY HH:mm");
    },
    ago: function() {
      return moment(this.createdAt).fromNow();
    },
    chatsCount: function() {

    }
  });

  Template.chat.events({
    'click .stopChat': function(evt, templ) {
      Meteor.call('removeChat', this._id);
      analytics.track('End Chat', {
        chat: this,
        user: Meteor.users.findOne(Meteor.userId())
      });
    },
    'keypress .sendChat': function(evt, templ) {
      var user = Meteor.users.findOne(Meteor.userId());
      var text = $(evt.target).val();
      var createdAt = new Date();
      if(evt.which == 13) {
        Meteor.call('createMessage', this._id, user, text, createdAt);
        analytics.track('Send Message', {
          chat: this,
          user: Meteor.users.findOne(Meteor.userId())
        });
        $(evt.target).val('');
      }
    },
    'click .sendbtn': function(evt, templ) {
      var user = Meteor.users.findOne(Meteor.userId());
      var text = $(evt.target).siblings('.sendChat').val();
      var createdAt = new Date();
      Meteor.call('createMessage', this._id, user, text, createdAt);
      analytics.track('Send Message', {
        chat: this,
        user: Meteor.users.findOne(Meteor.userId())
      });
      $(evt.target).siblings('.sendChat').val('');
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
      Bert.alert('You rejected @' + this.send.profile.username + '\'s chat request.', 'danger');
      Meteor.call('requestRejectedEmail', this.send, this.receive);
      Meteor.call('removeRequest', this._id);
      analytics.track('Reject Request', {
        send: send,
        receive: receive,
        user: Meteor.users.findOne(Meteor.userId())
      });
    },
    'click #accept': function(evt, templ) {
      evt.preventDefault();
      Bert.alert('You accepted @' + this.send.profile.username + '\'s chat request.', 'info');
      Meteor.call('removeRequest', this._id);
      Meteor.call('createChat', this.send, this.receive);
      Meteor.call('requestAcceptedEmail', this.send, this.receive);
      analytics.track('Chat Start', {
        send: send,
        receive: receive,
        user: Meteor.users.findOne(Meteor.userId())
      });
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
      Bert.alert('You rejected @' + this.send.profile.username + '\'s chat request.', 'danger');
      Meteor.call('removeRequest', this._id);
      analytics.track('Accept Request', {
        send: send,
        receive: receive,
        user: Meteor.users.findOne(Meteor.userId())
      });
    },
    'click #accept': function(evt, templ) {
      evt.preventDefault();
      Meteor.call('removeRequest', this._id);
      Bert.alert('You accepted @' + this.send.profile.username + '\'s chat request.', 'info');
      Meteor.call('createChat', this.send, this.receive);
      analytics.track('Chat Start', {
        send: send,
        receive: receive,
        user: Meteor.users.findOne(Meteor.userId())
      });
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
    },
    growth: function() {
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      var length = Meteor.users.findOne({ 'profile.username' : id }).profile.followerGrowth.length;
      return length > 2;
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

  Template.myStats.events({
    'click #requestChat': function(evt, templ) {
      evt.preventDefault();
      $(evt.target).hide();
      var id = Router.current().params._id;
      if(!id) { id = Meteor.users.findOne(Meteor.users.findOne(Meteor.userId()).profile.username).profile.username }
      var receive = Meteor.users.findOne({ 'profile.username' : id });
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

Bert.defaults.hideDelay = 1500;