Template.layout.events({
	'click .logout': function(evt) {
		evt.preventDefault();
		Meteor.logout();
		Router.go('/');
	}
});

Template.layout.onRendered(function() {	
  	var snapper = new Snap({
    	element: document.getElementById('snapper')
  	});

	$('#myMenu, .leftNav').on('click', function(){
	    if( snapper.state().state == "left" ){
	        snapper.close();
	        
	    } else {
	        snapper.open('left');
	       
	    }

	});

	$('#mySearch, .rightNav').on('click', function(){
	    if( snapper.state().state == "right" ){
	        snapper.close();
	    } else {
	        snapper.open('right');
	    
	    }

	});	
	$('.snap-drawer-left ul li a, .closeMe').on('click', function(){
		snapper.close();
	});

	$('.profile-img').on('click', function(){
		snapper.close();
		Router.go('/');
	});

});