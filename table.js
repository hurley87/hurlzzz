TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

if (Meteor.isClient) {
  Session.set('value', 30);
  Session.set('flow', 9000);
  Session.set('filterAccount', 9000);
  Session.set('accountType', 'Personal');
}

TabularTables.Users = new Tabular.Table({
  name: "Users",
  collection: Meteor.users,
  columns: [
    {
      tmpl: Meteor.isClient && Template.userDescription
    },
    {data: "profile.data.postValue", title: "Value"},
    {data: "profile.username", title: "Handle"},
    {data: "profile.other.city", title: "City"},
    {data: "profile.other.country", title: "Country"},
    {data: "profile.other.age", title: "Birthdate", searchable: false},
    {data: "profile.other.gender", title: "Gender", searchable: false},
    {data: "profile.stats.followed_by", title: "Followers", searchable: false},
    {data: "profile.data.avgLikes", title: "Avg Likes", searchable: false},
    {data: "profile.data.avgComments", title: "Avg Comments", searchable: false},
    {data: "profile.data.engagement", title: "Engagement", searchable: false},
    {data: "profile.data.consistency", title: "Consistency", searchable: false},
  ],
  responsive: true,
  order : [[ 1, "desc" ]],
  pageLength: 10,
  scrollCollapse: true,
  columnDefs : [
    {className: 'imgCol', 'targets':[1,2,3,4,5,6,7,8,9,10,11]}
  ]
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}

// Bert = {
//  defaults: {
//   animated: true,
//   // Accepts: true or false.
//   animationSpeed: 100,
//   // Accepts: integer value in milliseconds.
//   // Note: this value needs to match the speed of the CSS transition-duration
//   // property on the .bert-alert.animated class. If it doesn't, Bert will freak out.
//   autoHide: true,
//   // Accepts: true or false.
//   dismissable: true,
//   // Accepts: true or false.
//   hideDelay: 1000,
//   // Accepts: integer value in milliseconds.
//   style: "growl-top-right",
//   // Accepts: fixed-top, fixed-bottom, growl-top-left, growl-top-right,
//   // growl-bottom-left, growl-bottom-right.
//   type: "info"
//   // Accepts: default, success, info, warning, danger.
//  }
// }