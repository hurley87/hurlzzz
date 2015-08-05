  
  Template.chats.helpers({
    chats: function() {
      var chats = Chats.find({
        $or: [{'thisUser._id' : Meteor.userId()}, {'thatUser._id' : Meteor.userId()}]
      },
      {
        createdAt : -1
      }).fetch();
      return chats;
    },
    chatCount: function() {
      var count = Chats.find({
        $or: [{'thisUser._id' : Meteor.userId()}, {'thatUser._id' : Meteor.userId()}]
      },
      {
        createdAt : -1
      }).count();
      return count < 1;
    }
  }); 

  Template.chat.helpers({
    thisUser: function() {
      var id = Meteor.userId();
      if(id == this.thatUser._id) {
        return this.thisUser;
      } else {
        return this.thatUser;
      }
    },
    messages: function() {
      var id = this._id;
      var messages = Messages.find({
        chat_id: id
      },
      {
        sort: {
          createdAt: -1
        }
      });
      return messages;
    },
    time: function() {
      return moment(this.createdAt).format("MM-DD-YYYY HH:mm");
    },
    ago: function() {
      return moment(this.createdAt).fromNow();
    },
    chatsCount: function() {

    }
  });

  Template.chat.events({
    'click .stopChat': function(evt, templ) {
      Meteor.call('removeChat', this._id);
      analytics.track('End Chat', {
        chat: this,
        user: Meteor.users.findOne(Meteor.userId())
      });
    },
    'keypress .sendChat': function(evt, templ) {
      var user = Meteor.users.findOne(Meteor.userId());
      var text = $(evt.target).val();
      var createdAt = new Date();
      if(evt.which == 13) {
        Meteor.call('createMessage', this._id, user, text, createdAt);
        analytics.track('Send Message', {
          chat: this,
          user: Meteor.users.findOne(Meteor.userId())
        });
        $(evt.target).val('');
      }
    },
    'click .sendbtn': function(evt, templ) {
      var user = Meteor.users.findOne(Meteor.userId());
      var text = $(evt.target).siblings('.sendChat').val();
      var createdAt = new Date();
      Meteor.call('createMessage', this._id, user, text, createdAt);
      analytics.track('Send Message', {
        chat: this,
        user: Meteor.users.findOne(Meteor.userId())
      });
      $(evt.target).siblings('.sendChat').val('');
    }
  });
