ServiceConfiguration.configurations.remove({
  service: "instagram"
});
ServiceConfiguration.configurations.insert({
  service: "instagram",
  clientId: Meteor.settings.instagram_id,
  scope:'basic',
  secret: Meteor.settings.instagram_secret
});

var ig = Meteor.npmRequire('instagram-node').instagram(); 
ig.use({ client_id: Meteor.settings.instagram_id,
     client_secret: Meteor.settings.instagram_secret });
var Future = Npm.require('fibers/future');

Accounts.onCreateUser(function(options, user) {	
  var recentPosts = new Future();
  var stats = new Future();
  var data = new Future();
  

  if (options.profile)
  user.profile = options.services.instagram;

  ig.user_media_recent( user.profile.id, function(err, medias, pagination, remaining, limit) {
  	recentPosts.return(medias);
  }); 

  ig.user(user.profile.id, function(err, result, remaining, limit) {
  	stats.return(result.counts);
  });

  Meteor.call('getData', recentPosts.wait(), stats.wait(), function(error, result) {
    data.return(result);
  });

  user.profile.stats = stats.wait();
  user.profile.posts = recentPosts.wait();
  user.profile.data = data.wait();

  var other = {
    age: '',
    city: '',
    country: '',
    gender: '',
    email: ''
  };

  user.profile.other = other;

  return user;
});
