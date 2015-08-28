if (Meteor.isClient) {
  Session.setDefault("slider", [75, 500]);
  Session.setDefault('gt', 75);
  Session.setDefault('lt', 350);
  Session.setDefault('usersLimit', 7);
  Deps.autorun(function() {
    Meteor.subscribe('searchUsers', Session.get('usersLimit'), Session.get('gt'), Session.get('lt'));
  });
}