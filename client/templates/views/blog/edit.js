Template.editpost.onRendered(function() {
    $('.summernote').summernote({
        airMode: true
    });
});	

Template.editpost.helpers({
	thisUser: function() {
		if(this.user) {
			return this.user._id == Meteor.userId();
		} else {
			return false;
		}
		
	}
});

Template.editpost.events({
	'click #updatePost': function(evt, temp) {
		evt.preventDefault();
		var user = Meteor.users.findOne(Meteor.userId());
		var title = $('.title').code();
		var tagline = $('.tagline').code();
		var content = $('.content').code();
		var div = document.createElement("div");
		div.innerHTML = $('.title').code();
		var text = div.textContent || div.innerText || "";
		var slug = slugify(text, '_');

		var post = {
			title: title, 
			tagline: tagline,
			content: content,
			user: user,
			createdAt: new Date(),
			slug: slug
		};	

		Meteor.call('updatePost', post, this._id);
		Router.go('/blog');
	},
	'click #deletePost': function(evt, templ) {
		evt.preventDefault();
		Meteor.call('removePost', this);
		Router.go('/blog');
	}
});