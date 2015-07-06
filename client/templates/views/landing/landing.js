  Template.hey.events({
    'click .insta': function(evt, temp) {
      evt.preventDefault();
      Meteor.loginWithInstagram(function (err, res) {
      	console.log(res);
        if (err !== undefined) {
          console.log('sucess ' + res);
        } else {
          console.log('login failed ' + err);
        }
        $("body").removeClass("hide-sidebar").addClass("show-sidebar");
        Router.go('/'); 
      });
    }
  });