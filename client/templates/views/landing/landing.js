  Template.landing.events({
    'click .insta': function(evt, temp) {
      evt.preventDefault();
      Meteor.loginWithInstagram(function (err, res) {
        if (err !== undefined) {
          console.log('sucess ' + res);
        } else {
          console.log('login failed ' + err);
        }
        Router.go('/edit');
        analytics.identify(Meteor.userId()); 
      });
    }
  });

  function grabUser() {
    var users = Meteor.users.find({}).fetch()
    var user = _.first(_.sample(users, 1));
    Session.set('user', user);
  }

  Meteor.setInterval(grabUser, 2000);

  Template.landing.helpers({
    featured: function() {
      return Session.get('user');
    }
  });

Template.landing.rendered = function () {
  $(document).ready(function(){
    $('#slider').slick({
        arrows: false,
        verticalSwiping: true,
        vertical: true,
        adaptiveHeight: true,
        centerPadding: '0px',
        autoplay: true
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
    setInterval(function(){ 
      var search = $('.searchBtn');
      if(search.hasClass('pulse')) {
        search.removeClass('pulse')
      } else {
        search.addClass('pulse'); 
      }
    }, 2000);
    
  });
};

 

