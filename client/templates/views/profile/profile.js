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
  },
});

Template.profile.events({
  'click .searchBtn': function(evt, templ) {
      var snapper = new Snap({
        element: document.getElementById('snapper')
      });

      if( snapper.state().state == "closed" ) {
        snapper.open('right');
      } else {
        snapper.close();
      } 
  } 
});

Template.gallery.helpers({
  posts: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var user = Meteor.users.find({ 'profile.username' : id }).fetch()[0];
    if(user) {
      return user.profile.posts;
    }
  }   
});

Template.myStats.helpers({
  user: function() {
    var id = Router.current().params._id;
    if(!id && Meteor.userId()) { 
      return Meteor.users.findOne(Meteor.userId()).profile;
    } else {
      return Meteor.users.find({ 'profile.username' : id }).fetch()[0].profile;
    }
  },
  joined: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var createdAt = Meteor.users.find({ 'profile.username' : id }).createdAt;
    return moment(createdAt).fromNow();
  },    
  growth: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var user = Meteor.users.find({ 'profile.username' : id }).fetch()[0];
    if(user) {
      return user.profile.followerGrowth.length > 2;
    } 
  },
  online: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var user = Meteor.users.find({ 'profile.username' : id }).fetch()[0];
    if(user && user.status) {
      return user.status.online;
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