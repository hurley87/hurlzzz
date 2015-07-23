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

  Template.gallery.helpers({
    posts: function() {
      var id = Router.current().params._id;
            console.log(id);
      if(!id) { id = Meteor.users.findOne(Meteor.userId()).profile.username}
      return Meteor.users.findOne({ 'profile.username' : id }).profile.posts;
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
      if(!thisId) { thisId = Meteor.users.findOne(Meteor.userId()).profile.username}
      var myId = Meteor.users.findOne({ 'profile.username' : id }).profile.username;
      return thisId == myId;
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