Template.table.helpers({
	users: function() {
		return Meteor.users.find();
	}
});

Template.table.onRendered(function(){
    $('#table').dataTable({
        iDisplayLength: 25
    });
});