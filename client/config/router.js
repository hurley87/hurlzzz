Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

//
// Landing page route
//

// Router.route('/', function () {
//     this.render('landingPage');
//     this.layout('landingLayout');
// });

Router.route('/', function () {
    this.render('dashboard');
});

Router.route('/faq', function () {
    this.render('faq');
});

Router.route('/about', function () {
    this.render('about');
});

Router.route('/leaderboard', {
	template: 'leaderboard',
	loadingTemplate: 'loading',
	subscriptions: function() {
		this.subscribe('allLeaderboardUsers');
	}
});

var OnBeforeActions;

OnBeforeActions = {
    loginRequired: function(pause) {
      if (!Meteor.userId()) {
        this.render('dashboard');
        return pause();
      } else {
        this.render('dashboard');
      }
    }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    only: ['settings', 'anotherPriveRoute']
});

