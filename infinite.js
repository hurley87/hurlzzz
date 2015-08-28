if (Meteor.isClient) {
  var ITEMS_INCREMENT = 7;
  Session.setDefault('usersLimit', ITEMS_INCREMENT);
  Deps.autorun(function() {
    Meteor.subscribe('searchUsers', Session.get('usersLimit'));
  });
}