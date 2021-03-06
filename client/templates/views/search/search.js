 Template.infiniteSearch.helpers({
 	users: function() {
 		return Meteor.users.find({});
 	},
 	moreResults: function() {
 		return !(Meteor.users.find({}).count() < Session.get("usersLimit"));
 	},
 	lt: function() {
 		return Session.get("lt");
 	},
 	gt: function() {
		return Session.get("gt");
 	}
 });

 Template.infiniteSearch.events({
 	'click .loadMore': function(evt, templ) {
 		evt.preventDefault();
 		Session.set("usersLimit", Session.get("usersLimit") + 8);
 	},
  'click .insta': function(evt, temp) {
    evt.preventDefault();
    Meteor.loginWithInstagram(function (err, res) {
      if (err !== undefined) {
        console.log('sucess ' + res);
      } else {
        console.log('login failed ' + err);
      }
      Router.go('/thanks');
      analytics.identify(Meteor.userId()); 
    });
  }
 });

  Template.infiniteSearch.rendered = function () {
    this.$("#range").noUiSlider({
      start: Session.get("slider"),
      connect: true,
      behaviour: 'tap-drag',
      range: {
  		'min': 40,
  		'max': 500
      },
	  pips: { // Show a scale with the slider
		  mode: 'steps',
		  density: 2
	  }
    }).on('change', function (ev, val) {
      Session.set('slider', [Math.round(val[0]), Math.round(val[1])]);
      Session.set('lt', Math.round(val[1]) );
      Session.set('gt', Math.round(val[0]) );
    });
  };
