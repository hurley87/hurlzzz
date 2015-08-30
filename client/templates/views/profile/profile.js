Template.profile.helpers({
  growth: function() {
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var user = Meteor.users.find({ 'profile.username' : id }).fetch()[0];
    if(user) {
      return user.profile.followerGrowth.length > 1;
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
  thatUser: function() {
    var username = Router.current().params._id;
    if(username) { 
      return Meteor.users.find({ 'profile.username' : username }).fetch()[0];
    }
  },
  engagement: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var engagement = Meteor.users.findOne({ 'profile.username' : id }).profile.engagementGrowth; 
    var engageData = [];
    var max = _.max(_.flatten(engagement))*1.25;
    var last = _.last(engagement); 
    var first = engagement[0];
    var increase = ((last - first)/first*100 ).toFixed(1);
    for (var i =0; i < engagement.length; i++) {
      engageData.push([i+1, engagement[i]]);
    } 
    return {
      max: max,
      data: engageData,
      increase: increase,
      today: last
    };  
  },
  followers: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var followers = Meteor.users.findOne({ 'profile.username' : id }).profile.followerGrowth; 
    var followerData = [];
    var max = _.max(_.flatten(followers))*1.25;
    var last = _.last(followers); 
    var first = followers[0];
    var increase = ((last - first)/first*100 ).toFixed(1);
    for (var i =0; i < followers.length; i++) {
      followerData.push([i+1, followers[i]]);
    } 
    return {
      max: max,
      data: followerData,
      increase: increase,
      today: last
    };   
  },
  value: function() {
    var id = Router.current().params._id;
    if(!id) {id = Meteor.users.findOne(Meteor.userId()).profile.username;}
    var value = Meteor.users.findOne({ 'profile.username' : id }).profile.valueGrowth; 
    var valueData = [];
    var max = _.max(_.flatten(value))*1.25;
    var last = _.last(value); 
    var first = value[0];
    var increase = ((last - first)/first*100 ).toFixed(1);
    for (var i =0; i < value.length; i++) {
      valueData.push([i+1, value[i]]);
    } 
    return {
      max: max,
      data: valueData,
      increase: increase,
      today: last
    };   
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

      return today < dayAfter;
    } else {
      return false;
    }
  },
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
  posts: function() {
    return Posts.find({});
  }
});

Template.profile.events({ 
  'click .insta': function(evt, temp) {
    evt.preventDefault();
    Meteor.loginWithInstagram(function (err, res) {
      if (err !== undefined) {
        console.log('sucess ' + res);
        
      } else {
        console.log('login failed ' + err);
      }
    });
    Router.go('/edit');       
  },
  'click .updateThisUser': function(evt) {
    $(evt.target).hide();
    $('.igniteMe').hide();
    var updater = Meteor.users.findOne(Meteor.userId());
    var id = Router.current().params._id;
    if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
    var user = Meteor.users.find({ 'profile.username' : id }).fetch()[0];
    if(user) {
      Meteor.call('updateAnalytics', user, updater);
      Session.set('splashLoaded', false);
      var loading = window.pleaseWait({
        logo: '/logo.png',
        backgroundColor: '#303232',
        loadingHtml: '<p class="loading-message">' + pickRandom(messages) + '</p>'
              +   '<div class="sk-spinner sk-spinner-wave">'
          + ' <div class="sk-rect1"></div>'
          + ' <div class="sk-rect2"></div>'
          + ' <div class="sk-rect3"></div>'
          + ' <div class="sk-rect4"></div>'
          + ' <div class="sk-rect5"></div>'
          + '</div>'
      });
      Meteor.setTimeout(function () {
        loading.finish();
        Session.set('splashLoaded', true);
      }, 4000);
      analytics.track('Ignite', {
        user: user
      });
    }  
  },
  'click .mySearch':function(evt) {
    evt.preventDefault();
    var snapper = new Snap({
      element: document.getElementById('snapper')
    });
    $('.mySearch').on('click', function(){
      if( snapper.state().state == "right" ){
        snapper.close();
      } else {
        snapper.open('right');
      }
    });
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

Template.growthChart.rendered=function(){
    var data = this.data.thisData;
    var max = this.data.max;

    var chartData = [
        {
            data: data
        }
    ];

    var options = {
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

    $.plot($("#" + this.data.title), chartData, options);
};

Template.loading.rendered = function () {

  var loading = window.pleaseWait({
    logo: '/logo.png',
    backgroundColor: '#303232',
    loadingHtml: '<p class="loading-message">' + pickRandom(messages) + '</p>'
          +   '<div class="sk-spinner sk-spinner-wave">'
      + ' <div class="sk-rect1"></div>'
      + ' <div class="sk-rect2"></div>'
      + ' <div class="sk-rect3"></div>'
      + ' <div class="sk-rect4"></div>'
      + ' <div class="sk-rect5"></div>'
      + '</div>'
  });

  Meteor.setTimeout(function () {
    loading.finish();
    Session.set('splashLoaded', true);
  }, 4000);
};

Template.loading.destroyed = function () {
  this.loading.finish();
};

var pickRandom = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var messages = [
  'Hey you. Welcome back!',
  'You look nice today',
  'Amazing things come to those who wait',
  'You usually have to wait for that which is worth waiting for',
  'Don\'t wait for opportunity. Create it.',
  'Pro Tip: Don\'t use Instagram to take photos',
  'Pro Tip: Be consitent — Work in square',
  'Pro Tip: Avoid Instagram Filters—Use editing apps',
  'Pro Tip: Avoid Zoom',
  'Pro Tip:  Staging is important',
  'Pro Tip: Re-think perspective',
  'Pro Tip: Take your time - do not hurry'
];
