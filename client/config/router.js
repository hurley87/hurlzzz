Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

Router.route('/', {
  template: 'dashboard',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('requests');
    this.subscribe('chats');
    this.subscribe('messages');
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
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
  }
});


Router.route('/explore', {
  template: 'leaderboard',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('requests');
    this.subscribe('chats');
    this.subscribe('messages');
  }
});

Router.route('/requests', {
  template: 'requests',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('requests');
  }
});

Router.route('/chats', {
  template: 'chats',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('requests');
    this.subscribe('chats');
    this.subscribe('messages');
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
    return [Meteor.subscribe('allLeaderboardUsers'), Meteor.subscribe('requests'), Meteor.subscribe('chats'), Meteor.subscribe('messages')];
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
