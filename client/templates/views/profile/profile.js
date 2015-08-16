Template.profile.helpers({
  growth: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var user = Meteor.users.find({ 'profile.username' : id }).fetch()[0];
    if(user) {
      return user.profile.followerGrowth.length > 2;
    } 
  },
  thisUser: function() {
    var path = Router.current().location.get().path;
    if(Meteor.userId()) {
      var username = '/' + Meteor.users.findOne(Meteor.userId()).profile.username;
      if(path == '/' || path == username) {
        return true;
      } else {
        return false;
      }
    }
  }
});

Template.profile.onRendered(function() {
  $(document).ready(function() {
    $('.moreInfo').hide();
    $('#moreInfo').on('click', function() {
        $('.moreInfo').toggle(100);
        $('#recentPosts').toggle(100);
    });
  });
});


Template.proposal.events({
  'submit #createProposal': function(evt, temp) {
    evt.preventDefault();
    var intro = $('#intro').val();
    var plan = $('#plan').val();
    var perks = $('#perks').val();
    var budget = $('#budget').val();
    var sender = Meteor.users.findOne(Meteor.userId());
    var receiver = Meteor.users.find({ 'profile.username' : Router.current().params._id}).fetch()[0];

    var proposal = {
      intro: intro,
      plan: plan,
      perks: perks,
      sender: sender,
      budget: budget,
      receiver: receiver,
      createdAt: new Date()      
    };
    Bert.alert('Proposal Sent!', 'info');
    analytics.track('Proposal Sent', {
      sender: sender,
      budget: budget,
      receiver: receiver
    });
    Meteor.call('proposal', proposal);
    $('#intro').val('');
    $('#plan').val('');
    $('#perks').val('');
    $('#budget').val('10');
  }
});

Template.proposal.helpers({
  thatUser: function() {
    var username = Router.current().params._id;
    if(username) { 
      return Meteor.users.find({ 'profile.username' : username }).fetch()[0];
    }
  }
});

Template.gallery.helpers({
  posts: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var user = Meteor.users.find({ 'profile.username' : id }).fetch()[0];
    if(user) {
      return user.profile.posts.slice(0,4);
    }
  }   
});

Template.myStats.events({
  'click .updateThisUser': function() {
    var updater = Meteor.users.findOne(Meteor.userId());
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var user = Meteor.users.find({ 'profile.username' : id }).fetch()[0];
    if(user) {
      Meteor.call('updateAnalytics', user, updater);
    }
  }
}); 

Template.myStats.helpers({
  user: function() {
    var id = Router.current().params._id;
    if(!id && Meteor.userId()) { 
      var user = Meteor.users.findOne(Meteor.userId());
      if(user) {
        return user.profile;
      }
    } else {
      var user = Meteor.users.find({ 'profile.username' : id }).fetch()[0];
      if(user) {
        return user.profile;
      }
    }
  },
  joined: function() {
    var id = Router.current().params._id;
    if(!id && Meteor.userId()) { 
      var user = Meteor.users.findOne(Meteor.userId());
    } else {
      var user = Meteor.users.find({ 'profile.username' : id }).fetch()[0];
    }
    if(user) {
      return moment(user.createdAt).fromNow();
    } else {
      return
    }
  },    
  growth: function() {
    var id = Router.current().params._id;
    if(!id && Meteor.userId()) { 
      var user = Meteor.users.findOne(Meteor.userId());
    } else {
      var user = Meteor.users.find({ 'profile.username' : id }).fetch()[0];
    }
    if(user) {
      return user.profile.followerGrowth.length > 2;
    } else {
      return
    } 
  },
  online: function() {
    var id = Router.current().params._id;
    if(!id && Meteor.userId()) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var user = Meteor.users.find({ 'profile.username' : id }).fetch()[0];
    if(user && user.status) {
      return user.status.online;
    }
  },
  beenUpdated: function() {
    var username = Router.current().params._id;
    if(username) { 
      var userId =  Meteor.users.find({ 'profile.username' : username }).fetch()[0]._id;
    } else {
      var userId = Meteor.userId();
    }
    var updates = Updates.find({
      'updated._id' : userId
    }).fetch();
    var lastUpdate = _.last(updates);
      if(lastUpdate) {
      var time = lastUpdate.createdAt
      var future = moment(lastUpdate.createdAt).add(1, 'days').calendar();
      var dayAfter = time.setDate(time.getDate() + 1);
      var today = new Date();

      return today > dayAfter;
    } else {
      return true;
    }
  },
  updater: function() {
    var username = Router.current().params._id;
    if(username) { 
      var user = Meteor.users.find({ 'profile.username' : username }).fetch()[0]
      var userId =  user._id;
    } else {
      var userId = Meteor.userId();
    }

    var updates = Updates.find({
      'updated._id' : userId
    }).fetch();
    
    var lastUpdate = _.last(updates);
    if(lastUpdate) {
      return {
        name: lastUpdate.updater.profile.username,
        time: moment(lastUpdate.createdAt).fromNow()
      };
    } else {
      return {
        name: 'n/a',
        time: 'n/a'
      };
    }
  }
});


Template.analytics.helpers({
  user: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    return Meteor.users.findOne({ 'profile.username' : id }).profile;
  }
});

Template.analytics.onRendered(function(){
  $(document).ready(function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var likes = Meteor.users.find({ 'profile.username' : id }).fetch()[0].profile.data.likes;
    var comments = Meteor.users.find({ 'profile.username' : id }).fetch()[0].profile.data.comments;
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

});

Template.engagementGrowth.helpers({
  today: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.engagementGrowth;
    return engagement[engagement.length - 1];
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
  increase: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.followerGrowth;
    var big = engagement[engagement.length - 1]; 
    var small = engagement[0];
    return ((big - small)/small*100 ).toFixed(1);
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
  increase: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.valueGrowth;
    var big = engagement[engagement.length - 1]; 
    var small = engagement[0];
    return ((big - small)/small*100 ).toFixed(1);
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