  Template.landing.events({
    'click .insta': function(evt, temp) {
      evt.preventDefault();
      Meteor.loginWithInstagram(function (err, res) {
        if (err !== undefined) {
          console.log('sucess ' + res);
        } else {
          console.log('login failed ' + err);
        }
        var users = Meteor.users.find({}, { sort: { 'profile.data.postValue': -1 } }).fetch();
        Router.go('/edit'); 
      });
    }
  });

Template.landing.rendered = function () {
  $(document).ready(function(){
    $('#slider').slick({
        arrows: false,
        verticalSwiping: true,
        vertical: true,
        adaptiveHeight: true,
        centerPadding: '0px'
    });
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
  });
};

 

