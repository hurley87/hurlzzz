Template.post.helpers({
});

Template.post.onRendered(function() {
	$(document).ready(function() {
		var content = $('#postContent').data('content');
		console.log(content);
	});
});