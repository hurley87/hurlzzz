  Template.profile.helpers({
    user: function() {
      return Meteor.users.findOne(Meteor.userId()).profile;
    },
    stats: function() {
      return Meteor.users.findOne(Meteor.userId()).profile.stats;
    },
    unfinishedProfile: function() {
      var user = Meteor.users.findOne(Meteor.userId()).profile.other;
      if (user.age == '' || user.gender == '' || user.city == ''){
        return true;
      } else {
        return false;
      }
    }
  });

  Template.gallery.helpers({
    posts: function() {
      return Meteor.users.findOne(Meteor.userId()).profile.posts;
    }    
  });

  Template.myStats.helpers({
    user: function() {
      return Meteor.users.findOne(Meteor.userId());
    }
  });

  Template.tour.events({
    'click #startTour': function() {
        var tour = new Tour({
            backdrop: true,
            onShown: function(tour) {
                $('.animated').removeClass('fadeIn');
                $('.animated-panel').removeClass('zoomIn');

            },
            steps: [
                {
                    element: ".tour1",
                    title: "The Start",
                    content: "The value of your post is just a number. How we calculate that number is more important.",
                    placement: "bottom"

                },
                {
                    element: ".tour2",
                    title: "Followers",
                    content: "Followers are important. The more followers you have the more your worth but followers isn't the whole story. ",
                    placement: "top"

                },
                {
                    element: ".tour3",
                    title: "Posts",
                    content: "Likes and comments are also important! We call this engagment. How often are your followers engaging on your posts?",
                    placement: "top"

                },
                {
                    element: ".tour4",
                    title: "Likes and Comments",
                    content: "Calculating engagment is easy, we take your average comments and likes per post and add those values together.",
                    placement: "top"

                },
                {
                    element: ".tour5",
                    title: "Engagement Value",
                    content: "There's value in each like or comment you get on a post. The higher the numer here the better.",
                    placement: "top"

                },
                {
                    element: ".tour6",
                    title: "Impression Value",
                    content: "There's value with how many people see your post. The lower the number here the better.",
                    placement: "top"

                },
                {
                    element: ".tour7",
                    title: "The End",
                    content: "Hope you enjoyed the tour. Fill out this form to continue the fun. Thanks!",
                    placement: "top"

                }
            ]});

        // Initialize the tour
        tour.init();
        tour.restart();
    }
  });

  Template.myStatsForm.helpers({
    finishedProfile: function() {
      var user = Meteor.users.findOne(Meteor.userId()).profile.other;
      if (user.age == '' || user.gender == '' || user.city == ''){
        return false;
      } else {
        return true;
      }
    }
  });

  Template.myStatsForm.events({
    'click #updateProfile': function(evt, temp) {
      evt.preventDefault();
      var user = Meteor.users.findOne(Meteor.userId());
      var arguments = {
        city: $('#city').text(),
        country: $('#country').text(),
        email: $('#email').text(),
        sex: $('#sex').text(),
        dob: $('#birthdate').text()
      };

      Meteor.call('updateUser', arguments, user, function() {
        Router.go('/leaderboard');
      });
    }
  });

  Template.myStatsForm.onRendered(function() {

    // Defaults
    $.fn.editable.defaults.mode = 'inline';
    $.fn.editable.defaults.url = '#';

    $('#city').editable({
        validate: function(value) {
            if($.trim(value) == '') return 'This field is required';
        }
    });

    $('#city').on('save.newuser', function() {
      $('#country').editable('show');
      checkProgress();
    });    

    $('#country').editable({
        validate: function(value) {
            if($.trim(value) == '') return 'This field is required';
        }
    });

    $('#country').on('save.newuser', function() {
      $('#sex').editable('show');
      checkProgress();
    });

    $('#sex').editable({
        prepend: "not selected",
        source: [
            {value: 1, text: 'Male'},
            {value: 2, text: 'Female'}
        ]
    });

      $('#sex').on('save.newuser', function() {
        $('#birthdate').editable('show');
        checkProgress();
      });

    $('#birthdate').editable();

    $('#birthdate').on('save.newuser', function() { 
      $('#email').editable('show'); 
      checkProgress();
    });

    $('#email').editable({
        validate: function(value) {
            if($.trim(value) == '') return 'This field is required';
        }
    });

    $('#email').on('save.newuser', function() { 
      checkProgress();
    });

    function checkProgress() {
      var progress = $('#progressbar').attr('style');

      if(progress == 'width: 50%') {
        $("#progressbar").css({
          width: '60%',
        }, 500);
        $('#progressbar').text('60%');
      } 

      if(progress == 'width: 60%;') {
        $("#progressbar").css({
          width: '70%',
        }, 500);
        $('#progressbar').text('70%');
      }       

      if(progress == 'width: 70%;') {
        $("#progressbar").css({
          width: '80%',
        }, 500);
        $('#progressbar').text('80%');
      } 

      if (progress == 'width: 80%;') {
        $("#progressbar").css({
          width: '90%',
        }, 500);
        $('#progressbar').text('90%');
      } 

      if(progress == 'width: 90%;') {
         $('#progressbar').text('100%');
        $("#progressbar").css({
            width: '100%',
          }, 500);
          setTimeout( function() {
            $(".welcome1").addClass('fade out').hide();
          }, 500);
          setTimeout( function() {
            $(".welcome2").removeClass('hide').addClass('fade in');
          }, 500);
       }
    }        
    
  });

  Template.form.helpers({
    age: function() {
      var age =  Meteor.users.findOne(Meteor.userId()).profile.other.age;
      if(age == '') {
        return 'edit';
      } else {
        return age;
      }
    },
    city: function() {
      var location =  Meteor.users.findOne(Meteor.userId()).profile.other.city;
      if(location == '') {
        return 'edit';
      } else {
        return location;
      }
    },
    country: function() {
      var country =  Meteor.users.findOne(Meteor.userId()).profile.other.country;
      if(country == '') {
        return 'edit';
      } else {
        return country;
      }
    },    
    gender: function() {
      var gender =  Meteor.users.findOne(Meteor.userId()).profile.other.gender;
      if(gender == '') {
        return 'edit';
      } else {
        return gender;
      }
    },
    email: function() {
      var email =  Meteor.users.findOne(Meteor.userId()).profile.other.email;
      if(email == '') {
        return 'edit';
      } else {
        return email;
      }
    },    
  });

  Template.analytics.helpers({
    user: function() {
      return Meteor.users.findOne(Meteor.userId());
    },
    avgLikes: function() {
        return Meteor.users.findOne(Meteor.userId()).profile.data.avgLikes.toFixed(2);
    },
    avgComments: function() {
        return Meteor.users.findOne(Meteor.userId()).profile.data.avgComments.toFixed(2);
    }
  });

  Template.analytics.onRendered(function(){

    var likes = Meteor.users.findOne(Meteor.userId()).profile.data.likes;
    var comments = Meteor.users.findOne(Meteor.userId()).profile.data.comments;
    var max = _.max(_.flatten(likes))

    var data5 = [
        { data: likes, label: "likes"},
        { data: comments, label: "comments"}
    ];

    var chartUsersOptions5 = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            grid: {
                tickColor: "#e4e5e7",
                borderWidth: 1,
                borderColor: '#e4e5e7',
                color: '#6a6c6f'
            },
            yaxis: {
                min: 0,
                max: max
            },
            colors: [ "#3498DB", "#efefef"],
        }
        ;

    $.plot($("#flot-line-chart"), data5, chartUsersOptions5);


});

  Meteor.Spinner.options = {
    lines: 13, 
    length: 10, // The length of each line
    width: 5, // The line thickness
    radius: 15, // The radius of the inner circle
    corners: 0.7, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#fff', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};