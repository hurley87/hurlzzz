TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

if (Meteor.isClient) {
  Session.set('value', 30);
  Session.set('thisValue', 150);
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
    {data: "profile.other.country", title: "Country"}
  ],
  responsive: true,
  order : [[ 1, "desc"]],
  pageLength: 10,
  scrollCollapse: true,
  columnDefs : [
    {className: 'imgCol', 'targets':[1,2,3]}
  ]
});

