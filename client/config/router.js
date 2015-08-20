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
    this.subscribe('points');
  }
});

Router.route('/edit', {
  template: 'edit',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('updates');
  }
});

Router.route('/questions', {
  template: 'questions',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('questions');
    this.subscribe('answers');
    
  }
});

Router.route('/question/:_id', {
  template: 'questionPage',
  loadingTemplate: 'loading',
  subscriptions: function() {
   this.subscribe('questions');
   this.subscribe('answers');
  },
  data: function() {
    var question = Questions.findOne(this.params._id);
    return question;
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
  name: 'instagrammer',
  template: 'profile',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('updates');
    this.subscribe('points');
  }
});

Router.onBeforeAction(function() {
  GoogleMaps.load({
    key: "AIzaSyAaZm16_mMzjs34LmNqaQaANCELQVY5lq4",
    libraries: 'places'
  });
  this.next();
}, { only: ['/edit'] });