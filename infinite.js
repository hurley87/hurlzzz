if (Meteor.isServer) {
 
} 

if (Meteor.isClient) {
 
  var ITEMS_INCREMENT = 8;
  Session.setDefault('usersLimit', ITEMS_INCREMENT);
  Deps.autorun(function() {
    Meteor.subscribe('searchUsers', Session.get('usersLimit'));
  });
}