TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Users = new Tabular.Table({
  name: "Users",
  collection: Meteor.users,
  columns: [
    {data: "profile.username", title: "Handle"},
    {data: "profile.other.city", title: "City"},
    {data: "profile.other.country", title: "Country"},
    {data: "profile.other.age", title: "Birthdate"},
    {data: "profile.other.gender", title: "Gender"},
    {data: "profile.stats.followed_by", title: "Followers"},
    {data: "profile.data.avgLikes", title: "Likes"},
    {data: "profile.data.avgComments", title: "Comments"},
    {data: "profile.data.engagementValue", title: "Engagement"},
    {data: "profile.data.impressionValue", title: "Impression"},
    {data: "profile.data.postValue", title: "Value"}
  ]
});