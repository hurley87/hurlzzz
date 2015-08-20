Questions = new Mongo.Collection('questions');


Questions.allow({
  update: function (userId, user, fields, modifier) {
    if(user._id === userId) {
      Meteor.users.update({_id: userId}, modifier);
      return true;
    }
    else return false;
  },
  insert: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});


Questions.deny({
  insert: function(){
    // Deny user inserts on the client by default.
    return true;
  },
  update: function(){
    // Deny user updates on the client by default.
    return true;
  },
  remove: function(){
    // Deny user removes on the client by default.
    return true;
  }
});