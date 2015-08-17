Template.proposal.events({
  'submit #createProposal': function(evt, temp) {
    evt.preventDefault();
    var intro = $('#intro').val();
    var plan = $('#plan').val();
    var perks = $('#perks').val();
    var budget = $('#budget').val();
    var sender = Meteor.users.findOne(Meteor.userId());
    var receiver = Meteor.users.find({ 'profile.username' : Router.current().params._id}).fetch()[0];

    var proposal = {
      intro: intro,
      plan: plan,
      perks: perks,
      sender: sender,
      budget: budget,
      receiver: receiver,
      createdAt: new Date()      
    };
    Bert.alert('Proposal Sent!', 'info');
    analytics.track('Proposal Sent', {
      sender: sender,
      budget: budget,
      receiver: receiver
    });
    Meteor.call('proposal', proposal);
    $('#intro').val('');
    $('#plan').val('');
    $('#perks').val('');
    $('#budget').val('10');
  }
});

Template.proposal.helpers({
  thatUser: function() {
    var username = Router.current().params._id;
    if(username) { 
      return Meteor.users.find({ 'profile.username' : username }).fetch()[0];
    }
  }
});