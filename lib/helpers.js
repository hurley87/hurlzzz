if(Meteor.isClient) {
	Template.registerHelper('text', function(passedString) {
		if(passedString.length > 35) {
			passedString = passedString.substring(0,35) + ' ...' 
		} 
	    return new Spacebars.SafeString(passedString);
	});
	Template.registerHelper('getBody', function () {
	  return Session.get('splashLoaded') ? 'profile' : 'loading';
	});
}
