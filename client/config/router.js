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
    var username = Meteor.users.findOne(Meteor.userId()).profile.username;
    this.subscribe('userPosts', username);
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

Router.route('/about', function () {
    this.render('about');
});

Router.route('/blog', {
  name: 'blog',
  template: 'blog',
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('posts');
  }
});

Router.route('/blog/new', {
  name: 'newpost',
  template: 'newpost',
  loadingTemplate: 'loading'
});

Router.route('/blog/:_id', {
  name: 'post',
  template: 'post',
  loadingTemplate: 'loading',
  data: function() {
    var slug = this.params._id;
    var thisPost = Posts.find({ slug: slug }).fetch()[0];
    return thisPost;   
  },
  subscriptions: function() {
    this.subscribe('thisPost', this.params._id).wait();
  }    
});


Router.route('/:_id', {
  name: 'instagrammer',
  template: 'profile',
  loadingTemplate: 'loading',
  subscriptions: function() {   
    this.subscribe('updates');
    this.subscribe('userPosts', this.params._id);
  }
});



