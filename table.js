TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

if (Meteor.isClient) {
  Session.set('value', 30);
  Session.set('flow', 9000);
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
  pageLength: 20,
  scrollCollapse: true,
  columnDefs : [
    {className: 'imgCol', 'targets':[1,2,3,4,5,6,7,8,9,10,11]}
  ]
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}