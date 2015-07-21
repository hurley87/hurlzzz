// TabularTables = {};

// Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

// TabularTables.Users = new Tabular.Table({
//   name: "Users",
//   collection: Meteor.users,
//   columns: [
//     {data: "profile.username", title: "Handle"},
//     {data: "profile.data.postValue", title: "Value"},
//     {data: "profile.other.city", title: "City"},
//     {data: "profile.other.country", title: "Country"},
//     {data: "profile.other.age", title: "Birthdate"},
//     {data: "profile.other.gender", title: "Gender"},
//     {data: "profile.stats.followed_by", title: "Followers"},
//     {data: "profile.data.avgLikes", title: "Avg Likes"},
//     {data: "profile.data.avgComments", title: "Avg Comments"},
//     {data: "profile.data.engagement", title: "Engagement"},
//     {data: "profile.data.consistency", title: "Consistency"},
//   ],
//   responsive: true
// });

exampleCollection = new Meteor.Collection('_example_collection');

if (Meteor.isServer) {
    Meteor.startup(function() {
        exampleCollection.remove({});
        Meteor.defer(function() {
        	var users = Meteor.users.find({}, { 'profile.data.postValue': -1 }).fetch();
            console.log(users);
            var count = 1;
	    	users.forEach(function(user) {
	    		exampleCollection.insert({ rowNum : count, data_1 : user.profile.stats.followed_by, data_2 : user.profile.other.gender });
	    		count += 1;
	    	});   
        });
    });
}
