Slacks = new Mongo.Collection('slacks');

/*
* Allow
*/
Slacks.allow({
  insert: function(){
    return true;
  }
});
