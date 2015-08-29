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
 	}
 });

  Template.infiniteSearch.rendered = function () {
    this.$("#range").noUiSlider({
      start: Session.get("slider"),
      connect: true,
      margin: 150,
      limit: 150,
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
      // round off values on 'change' event
      Session.set('slider', [Math.round(val[0]), Math.round(val[1])]);
      Session.set('lt', Math.round(val[1]) );
      Session.set('gt', Math.round(val[0]) );
    });
  };
