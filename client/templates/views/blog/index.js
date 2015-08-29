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