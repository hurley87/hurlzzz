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

Router.route('/edit', {
  template: 'edit',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
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
  name: 'search',
  template: 'infiniteSearch',
  loadingTemplate: 'loading'
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
  }
});
