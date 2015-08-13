(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Tabular, tablesByName;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/aldeed:tabular/common.js                                                        //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/* global Tabular:true, tablesByName:true, Mongo, _, Meteor */                              // 1
                                                                                            // 2
Tabular = {}; //exported                                                                    // 3
                                                                                            // 4
tablesByName = {};                                                                          // 5
                                                                                            // 6
Tabular.Table = function (options) {                                                        // 7
  var self = this;                                                                          // 8
                                                                                            // 9
  if (!options) {                                                                           // 10
    throw new Error('Tabular.Table options argument is required');                          // 11
  }                                                                                         // 12
                                                                                            // 13
  if (!options.name) {                                                                      // 14
    throw new Error('Tabular.Table options must specify name');                             // 15
  }                                                                                         // 16
  self.name = options.name;                                                                 // 17
                                                                                            // 18
  if (!(options.collection instanceof Mongo.Collection)) {                                  // 19
    throw new Error('Tabular.Table options must specify collection');                       // 20
  }                                                                                         // 21
  self.collection = options.collection;                                                     // 22
                                                                                            // 23
  self.pub = options.pub || 'tabular_genericPub';                                           // 24
                                                                                            // 25
  // By default we use core `Meteor.subscribe`, but you can pass                            // 26
  // a subscription manager like `sub: new SubsManager({cacheLimit: 20, expireIn: 3})`      // 27
  self.sub = options.sub || Meteor;                                                         // 28
                                                                                            // 29
  self.onUnload = options.onUnload;                                                         // 30
  self.allow = options.allow;                                                               // 31
  self.allowFields = options.allowFields;                                                   // 32
  self.changeSelector = options.changeSelector;                                             // 33
                                                                                            // 34
  if (_.isArray(options.extraFields)) {                                                     // 35
    var fields = {};                                                                        // 36
    _.each(options.extraFields, function (fieldName) {                                      // 37
      fields[fieldName] = 1;                                                                // 38
    });                                                                                     // 39
    self.extraFields = fields;                                                              // 40
  }                                                                                         // 41
                                                                                            // 42
  self.selector = options.selector;                                                         // 43
                                                                                            // 44
  if (!options.columns) {                                                                   // 45
    throw new Error('Tabular.Table options must specify columns');                          // 46
  }                                                                                         // 47
                                                                                            // 48
  self.options = _.omit(options, 'collection', 'pub', 'sub', 'onUnload', 'allow', 'allowFields', 'extraFields', 'name', 'selector');
                                                                                            // 50
  tablesByName[self.name] = self;                                                           // 51
};                                                                                          // 52
                                                                                            // 53
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/aldeed:tabular/server/tabular.js                                                //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/* global check, Match, Meteor, tablesByName, _ */                                          // 1
                                                                                            // 2
/*                                                                                          // 3
 * These are the two publications used by TabularTable.                                     // 4
 *                                                                                          // 5
 * The genericPub one can be overridden by supplying a `pub`                                // 6
 * property with a different publication name. This publication                             // 7
 * is given only the list of ids and requested fields. You may                              // 8
 * want to override it if you need to publish documents from                                // 9
 * related collections along with the table collection documents.                           // 10
 *                                                                                          // 11
 * The getInfo one runs first and handles all the complex logic                             // 12
 * required by this package, so that you don't have to duplicate                            // 13
 * this logic when overriding the genericPub function.                                      // 14
 *                                                                                          // 15
 * Having two publications also allows fine-grained control of                              // 16
 * reactivity on the client.                                                                // 17
 */                                                                                         // 18
                                                                                            // 19
Meteor.publish("tabular_genericPub", function (tableName, ids, fields) {                    // 20
  var self = this;                                                                          // 21
                                                                                            // 22
  check(tableName, String);                                                                 // 23
  check(ids, Array);                                                                        // 24
  check(fields, Match.Optional(Object));                                                    // 25
                                                                                            // 26
  var table = tablesByName[tableName];                                                      // 27
  if (!table) {                                                                             // 28
    // We throw an error in the other pub, so no need to throw one here                     // 29
    self.ready();                                                                           // 30
    return;                                                                                 // 31
  }                                                                                         // 32
                                                                                            // 33
  // Extend fields list with extra fields from the table definition                         // 34
  if (table.extraFields) {                                                                  // 35
    _.extend(fields, table.extraFields);                                                    // 36
  }                                                                                         // 37
                                                                                            // 38
  // Check security. We call this in both publications.                                     // 39
  if (typeof table.allow === 'function' && !table.allow(self.userId, fields)) {             // 40
    self.ready();                                                                           // 41
    return;                                                                                 // 42
  }                                                                                         // 43
                                                                                            // 44
  // Check security for fields. We call this only in this publication                       // 45
  if (typeof table.allowFields === 'function' && !table.allowFields(self.userId, fields)) { // 46
    self.ready();                                                                           // 47
    return;                                                                                 // 48
  }                                                                                         // 49
                                                                                            // 50
  return table.collection.find({_id: {$in: ids}}, {fields: fields});                        // 51
});                                                                                         // 52
                                                                                            // 53
Meteor.publish("tabular_getInfo", function(tableName, selector, sort, skip, limit) {        // 54
  var self = this;                                                                          // 55
                                                                                            // 56
  check(tableName, String);                                                                 // 57
  check(selector, Match.Optional(Match.OneOf(Object, null)));                               // 58
  check(sort, Match.Optional(Match.OneOf(Array, null)));                                    // 59
  check(skip, Number);                                                                      // 60
  check(limit, Number);                                                                     // 61
                                                                                            // 62
  var table = tablesByName[tableName];                                                      // 63
  if (!table) {                                                                             // 64
    throw new Error('No TabularTable defined with the name "' + tableName + '". Make sure you are defining your TabularTable in common code.');
  }                                                                                         // 66
                                                                                            // 67
  // Verify that limit is not 0, because that will actually                                 // 68
  // publish all document _ids.                                                             // 69
  if (limit === 0) {                                                                        // 70
    limit = 1;                                                                              // 71
  }                                                                                         // 72
                                                                                            // 73
  // Check security. We call this in both publications.                                     // 74
  // Even though we're only publishing _ids and counts                                      // 75
  // from this function, with sensitive data, there is                                      // 76
  // a chance someone could do a query and learn something                                  // 77
  // just based on whether a result is found or not.                                        // 78
  if (typeof table.allow === 'function' && !table.allow(self.userId)) {                     // 79
    self.ready();                                                                           // 80
    return;                                                                                 // 81
  }                                                                                         // 82
                                                                                            // 83
  selector = selector || {};                                                                // 84
                                                                                            // 85
  // Allow the user to modify the selector before we use it                                 // 86
  if (typeof table.changeSelector === 'function') {                                         // 87
    selector = table.changeSelector(selector, self.userId);                                 // 88
  }                                                                                         // 89
                                                                                            // 90
  // Apply the server side selector specified in the tabular                                // 91
  // table constructor. Both must be met, so we join                                        // 92
  // them using $and, allowing both selectors to have                                       // 93
  // the same keys.                                                                         // 94
  if (typeof table.selector === 'function') {                                               // 95
    var tableSelector = table.selector(self.userId);                                        // 96
    if (_.isEmpty(selector)) {                                                              // 97
      selector = tableSelector;                                                             // 98
    } else {                                                                                // 99
      selector = {$and: [tableSelector, selector]};                                         // 100
    }                                                                                       // 101
  }                                                                                         // 102
                                                                                            // 103
  var findOptions = {                                                                       // 104
    skip: skip,                                                                             // 105
    limit: limit,                                                                           // 106
    fields: {_id: 1}                                                                        // 107
  };                                                                                        // 108
                                                                                            // 109
  // `sort` may be `null`                                                                   // 110
  if (_.isArray(sort)) {                                                                    // 111
    findOptions.sort = sort;                                                                // 112
  }                                                                                         // 113
                                                                                            // 114
  var filteredCursor = table.collection.find(selector, findOptions);                        // 115
                                                                                            // 116
  var filteredRecordIds = filteredCursor.map(function (doc) {                               // 117
    return doc._id;                                                                         // 118
  });                                                                                       // 119
                                                                                            // 120
  var countCursor = table.collection.find(selector, {fields: {_id: 1}});                    // 121
                                                                                            // 122
  var recordReady = false;                                                                  // 123
  function updateRecords() {                                                                // 124
    var currentCount = countCursor.count();                                                 // 125
                                                                                            // 126
    var record = {                                                                          // 127
      ids: filteredRecordIds,                                                               // 128
      // count() will give us the updated total count                                       // 129
      // every time. It does not take the find options                                      // 130
      // limit into account.                                                                // 131
      recordsTotal: currentCount,                                                           // 132
      recordsFiltered: currentCount                                                         // 133
    };                                                                                      // 134
                                                                                            // 135
    if (recordReady) {                                                                      // 136
      //console.log("changed", tableName, record);                                          // 137
      self.changed('tabular_records', tableName, record);                                   // 138
    } else {                                                                                // 139
      //console.log("added", tableName, record);                                            // 140
      self.added("tabular_records", tableName, record);                                     // 141
      recordReady = true;                                                                   // 142
    }                                                                                       // 143
  }                                                                                         // 144
                                                                                            // 145
  // Handle docs being added or removed from the result set.                                // 146
  var initializing1 = true;                                                                 // 147
  var handle1 = filteredCursor.observeChanges({                                             // 148
    added: function (id) {                                                                  // 149
      if (initializing1) {                                                                  // 150
        return;                                                                             // 151
      }                                                                                     // 152
                                                                                            // 153
      //console.log("ADDED");                                                               // 154
      filteredRecordIds.push(id);                                                           // 155
      updateRecords();                                                                      // 156
    },                                                                                      // 157
    removed: function (id) {                                                                // 158
      //console.log("REMOVED");                                                             // 159
      filteredRecordIds = _.without(filteredRecordIds, id);                                 // 160
      updateRecords();                                                                      // 161
    }                                                                                       // 162
  });                                                                                       // 163
  initializing1 = false;                                                                    // 164
                                                                                            // 165
  // Handle docs being added or removed from the non-limited set.                           // 166
  // This allows us to get total count available.                                           // 167
  var initializing2 = true;                                                                 // 168
  var handle2 = countCursor.observeChanges({                                                // 169
    added: function () {                                                                    // 170
      if (initializing2) {                                                                  // 171
        return;                                                                             // 172
      }                                                                                     // 173
      updateRecords();                                                                      // 174
    },                                                                                      // 175
    removed: function () {                                                                  // 176
      updateRecords();                                                                      // 177
    }                                                                                       // 178
  });                                                                                       // 179
  initializing2 = false;                                                                    // 180
                                                                                            // 181
  updateRecords();                                                                          // 182
  self.ready();                                                                             // 183
                                                                                            // 184
  // Stop observing the cursors when client unsubs.                                         // 185
  // Stopping a subscription automatically takes                                            // 186
  // care of sending the client any removed messages.                                       // 187
  self.onStop(function () {                                                                 // 188
    handle1.stop();                                                                         // 189
    handle2.stop();                                                                         // 190
  });                                                                                       // 191
});                                                                                         // 192
                                                                                            // 193
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['aldeed:tabular'] = {
  Tabular: Tabular
};

})();

//# sourceMappingURL=aldeed_tabular.js.map
