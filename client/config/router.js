Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

Router.route('/', {
  template: 'dashboard',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
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

Router.route('/contact', {
  template: 'contact',
  loadingTemplate: 'loading'
});

Router.route('/edit', {
  template: 'edit',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
  }
});


Router.route('/search', {
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
  subscriptions: function() {
    this.subscribe('allLeaderboardUsers');
    this.subscribe('messages');
  }
});