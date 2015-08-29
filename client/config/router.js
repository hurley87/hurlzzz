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

Router.route('/edit', {
  template: 'edit',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
  }
});

Router.route('/search', {
  name: 'search',
  template: 'infiniteSearch',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('usersCount');
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
    this.subscribe('updates');
  }
});
