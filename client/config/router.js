Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

Router.route('/', {
  template: 'dashboard',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('updates');
  }
});

Router.route('/contact', {
  template: 'contact',
  loadingTemplate: 'loading'
});

Router.route('/edit', {
  template: 'edit',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('updates');
  }
});

Router.route('/search', {
  template: 'leaderboard',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('updates');
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
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('updates');
  }
});

Router.onBeforeAction(function() {
  GoogleMaps.load({
    key: "AIzaSyAaZm16_mMzjs34LmNqaQaANCELQVY5lq4",
    libraries: 'places'
  });
  this.next();
}, { only: ['/edit'] });