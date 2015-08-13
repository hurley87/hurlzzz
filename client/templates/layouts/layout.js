Template.layout.events({
	'click .logout': function(evt) {
		evt.preventDefault();
		Meteor.logout();
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
		console.log(snapper.state().state);
	    if( snapper.state().state == "right" ){
	 
	        snapper.close();
	    } else {
	        snapper.open('right');
	    
	    }

	});	
	$('.snap-drawer-left ul li a').on('click', function(){
		snapper.close();
	});

	$('.profile-img').on('click', function(){
		snapper.close();
		Router.go('/');
	});

});