if(Meteor.isClient) {
	Template.registerHelper('shortentext', function(passedString) {
		if(passedString.length > 40) {
			passedString = passedString.substring(0,40) + ' ...' 
		} 
	    return new Spacebars.SafeString(passedString);
	});
	Template.registerHelper('getBody', function () {
	  return Session.get('splashLoaded') ? 'profile' : 'loading';
	});
	Template.registerHelper('time', function (time) {
	  return moment(time).fromNow();
	});
}
