Updates = new Mongo.Collection('updates');
/*
* Allow
*/
Updates.allow({
  insert: function(){
    // Deny user inserts on the client by default.
    return true;
  }
});
