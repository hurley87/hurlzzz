Template.updateUser.onRendered(function() {
    $('#datapicker2').datepicker();
});

Template.updateUser.helpers({
    user: function() {
      if(Meteor.userId()) {
        return Meteor.users.findOne(Meteor.userId()).profile;
      }  
    }
});

Template.updateUser.events({
    'click #update': function(evt, temp) {
        evt.preventDefault();
        var userDetails = {
                city: $('#city').val(),
                country: $('#country').val(),
                email: $('#email').val(),
                sex: $("#gender").val(),
                dob: $('#datapicker2').val()
            };
        var user = Meteor.users.findOne(Meteor.userId());
        Meteor.call('updateUser', userDetails, user);
        Router.go('/');
    }
});