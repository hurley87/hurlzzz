Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

Router.route('/', {
  template: 'dashboard',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
  }
});

Router.route('/updateUsers', {
  template: 'updateAllUsers',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
  }  
});

Router.route('/edit', {
  template: 'edit',
  loadingTemplate: 'loading'
});


Router.route('/explore', {
  template: 'leaderboard',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('requests');
  }
});

Router.route('/faq', function () {
    this.render('faq');
});

Router.route('/about', function () {
    this.render('about');
});

Router.route('/:_id', {
  template: 'profile',
  loadingTemplate: 'loading',
  data: function() {
    return Meteor.users.findOne({ username: this.params._id });
  },
  waitOn: function() {
    return [Meteor.subscribe('allLeaderboardUsers')];
  }
});

// var mustBeSignedIn = function(pause) {
//   if (!(Meteor.user() || Meteor.loggingIn())) {
//     Router.go('landingPage');
//     this.next();
//   }
// };

// var goToProfile = function(pause) {
//   if (Meteor.user()) {
//     console.log(Meteor.user());
//     Router.go('/');
//     this.next();
//   }
// };

// Router.onBeforeAction(mustBeSignedIn, {except: ['signin']});
// Router.onBeforeAction(goToProfile, {only: ['landingPage']});
