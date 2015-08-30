Template.blog.helpers({
	items: function() {
		return Posts.find({});
	}
});

Template.item.helpers({
	time: function() {
		return moment(this.createdAt).fromNow();
	}
});

Template.blog.events({
'click .insta': function(evt, temp) {
  evt.preventDefault();
  Meteor.loginWithInstagram(function (err, res) {
    if (err !== undefined) {
      console.log('sucess ' + res);
    } else {
      console.log('login failed ' + err);
    }
    Router.go('/blog');
    analytics.identify(Meteor.userId()); 
  });
}
});