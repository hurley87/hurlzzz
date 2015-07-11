  Template.profile.helpers({
    user: function() {
      var id = Router.current().params._id;
      return Meteor.users.findOne(id).profile;
    },
    stats: function() {
      var id = Router.current().params._id;
      return Meteor.users.findOne(id).profile.stats;
    }
  });

  Template.gallery.helpers({
    posts: function() {
      var id = Router.current().params._id;
      return Meteor.users.findOne(id).profile.posts;
    }    
  });

  Template.myStats.helpers({
    user: function() {
      var id = Router.current().params._id;
      return Meteor.users.findOne(id).profile;
    }
  });


  Template.analytics.helpers({
    user: function() {
      var id = Router.current().params._id;
      return Meteor.users.findOne(id);
    },
    avgLikes: function() {
      var id = Router.current().params._id;
        return Meteor.users.findOne(id).profile.data.avgLikes.toFixed(2);
    },
    avgComments: function() {
      var id = Router.current().params._id;
        return Meteor.users.findOne(id).profile.data.avgComments.toFixed(2);
    }
  });

  Template.analytics.onRendered(function(){
    var id = Router.current().params._id;
    var likes = Meteor.users.findOne(id).profile.data.likes;
    var comments = Meteor.users.findOne(id).profile.data.comments;
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

  Meteor.Spinner.options = {
    lines: 13, 
    length: 10, // The length of each line
    width: 5, // The line thickness
    radius: 15, // The radius of the inner circle
    corners: 0.7, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#fff', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};