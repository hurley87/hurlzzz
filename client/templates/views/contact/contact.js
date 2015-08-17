Template.contactForm.events({
  'submit #create': function(evt, temp) {
    evt.preventDefault();
    var email = $('#email').val();
    var message = $('#message').val();
    var name = $('#name').val();
    Bert.alert('Thanks for saying hello.', 'info');
    analytics.track('Hot Lead', {
      email: email,
      message: message,
      name: name
    });
    var username = Meteor.users.findOne(Meteor.userId()).profile.username;
    Meteor.call('addContact', email, name, message, username);
    $('#email').val('');
    $('#name').val('');
    $('#message').val('');
  }
});