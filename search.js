EasySearch.createSearchIndex('users', {
  field: ['profile.username', 'profile.other.city', 'profile.other.country'],
  collection: Meteor.users,
  use: 'mongo-db',
  query: function (searchString, opts) {
    // Default query that is used for searching
    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

    return query;
  }
});