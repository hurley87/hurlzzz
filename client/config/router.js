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


Router.route('/faq', function () {
    this.render('faq');
});

Router.route('/about', function () {
    this.render('about');
});

Router.route('/elites', {
	template: 'leaderboard',
	loadingTemplate: 'loading',
	subscriptions: function() {
		this.subscribe('allLeaderboardUsers');
	}
});


Router.route('/elites/:_id', {
  template: 'profile2',
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
