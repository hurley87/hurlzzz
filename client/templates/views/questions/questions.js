Template.questions.helpers({
	questions: function() {
		return Questions.find({}, {
	      sort: {
	        createdAt: -1
	      }
	    });
	}
});

Template.question.helpers({
	time: function() {
		return moment(this.createdAt).fromNow();
	},
  votes: function() {
    var questionId = this._id;
    var answers = Answers.find({ questionId: this._id }).fetch();
    var sum = 0;
    for(var i = 0; i < answers.length; i++) {
      sum += answers[i].score;
    } 
    return sum;
  },
  answers: function() {
    var questionId = this._id;
    return Answers.find({ questionId: this._id }).count();
  }
});

Template.questions.events({
  'click .insta': function(evt, temp) {
    evt.preventDefault();
    Meteor.loginWithInstagram(function (err, res) {
      if (err !== undefined) {
        console.log('sucess ' + res);
      } else {
        console.log('login failed ' + err);
      }
      Router.go('/edit');
      var user = Meteor.users.findOne(Meteor.userId());
      if(user) {
        analytics.identify(user._id, {
          name: user.profile.username
        });       
      }
    });
  }
});

Template.questionForm.events({
  'submit #question': function(evt, temp) {
    evt.preventDefault();
    var question = $('#text').val();
    var user = Meteor.users.findOne(Meteor.userId());
      analytics.track('question', {
        user: user,
        question: question
      });
    Meteor.call('createQuestion', user, question);
    Meteor.call('questionPoints', user._id);
    Router.go('/questions');
    $('#text').val('');
  }
});