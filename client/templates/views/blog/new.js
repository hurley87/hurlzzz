Template.newpost.onRendered(function() {
    $('.summernote').summernote({
        airMode: true
    });
});	

Template.newpost.events({
	'click #submitPost': function(evt, temp) {
		evt.preventDefault();
		var user = Meteor.users.findOne(Meteor.userId());
		var title = $('.title').code();
		var tagline = $('.tagline').code();
		var content = $('.content').code();
		var html = "<p>Some HTML</p>";
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

		console.log(post);
		Meteor.call('createPost', post);
		Router.go('/blog');
	}
});