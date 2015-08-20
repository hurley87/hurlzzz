Template.answerForm.events({
	'click .answerQuestion': function(evt) {
		evt.preventDefault();
		var user = Meteor.users.findOne(Meteor.userId());
		var answer = $('#answer').val();
		var createdAt = new Date();
		var questionId = Router.current().params._id;
		
		var answer = {
			user: user,
			answer: answer,
			createdAt: createdAt,
			questionId: questionId,
			score: 0
		};

		Meteor.call('createAnswer', answer);
		Meteor.call('answerPoints', Meteor.userId());
		$('#answer').val('');
	}
});

Template.answers.helpers({
	answers: function() {
		var questionId = Router.current().params._id;
		return Answers.find({ questionId : questionId }, 
			{
				sort: {
					score: -1,
					createdAt: -1
				}
			});
	},
	numberOf: function() {
		var questionId = Router.current().params._id;
		var count =  Answers.find({ questionId : questionId }, 
			{
			sort: {
				createdAt: -1
			}
		}).count();	
		if (count == 1) {
			return '1 Answer';
		} else {
			return count + ' Answers';
		}
	}
});

Template.answer.helpers({
	time: function() {
		return moment(this.createdAt).fromNow();
	},
	thisUser: function() {
		var answer = Answers.findOne({ _id : this._id });
		return answer.user._id == Meteor.userId();
	}
});

Template.answer.events({
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
    },
    'click .mySearch':function(evt) {
	    evt.preventDefault();
	    var snapper = new Snap({
	      element: document.getElementById('snapper')
	    });
	    $('.mySearch').on('click', function(){
	      if( snapper.state().state == "right" ){
	        snapper.close();
	      } else {
	        snapper.open('right');
	      }
	    });
	  },
	  'click .vote': function(evt) {
	  	var answerId = this._id;
		var answer =  Answers.findOne({ _id : answerId});
	  	Meteor.call('updateScore', answer);
	  	Meteor.call('heartPoints', answer.user._id);
	  	analytics.track('heart', {
	  		userId: Meteor.userId()
	  	});
	  }

});