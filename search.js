EasySearch.createSearchIndex('users', {
  field: ['profile.username', 'profile.other.city', 'profile.other.country', 'profile.data.value'],
  collection: Meteor.users,
  use: 'mongo-db',
  query: function (searchString, opts) {
    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

    query.$or.push({
      'profile.data.postValue': {
        $gt: 50
      }
    });
    
    return query;
  },
  sort: function() {
    return { 'profile.data.postValue': -1 };
  }
});