Referrals = new Mongo.Collection('referrals');


Referrals.allow({
  insert: function(){
    return true;
  }
});


Referrals.deny({
  insert: function(){
    // Deny user inserts on the client by default.
    return true;
  }
});