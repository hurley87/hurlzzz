Answers = new Mongo.Collection('answers');


Answers.allow({
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


Answers.deny({
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