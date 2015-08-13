(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var _CS_Counts, getCollection;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/jchristman:collection-scroller/lib/collections.js                          //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
_CS_Counts = new Meteor.Collection('_cs_counts');                                      // 1
                                                                                       // 2
if (Meteor.isServer) {                                                                 // 3
    var _publicationsMap = {}                                                          // 4
    var _pub_expiration = 10;                                                          // 5
    Meteor.methods({                                                                   // 6
        _cs_createPublication : function(_src) {                                       // 7
            var _collection = getCollection(_src);                                     // 8
            if (_publicationsMap[_src] == undefined) {                                 // 9
                _publicationsMap[_src] = (new Date).getTime();                         // 10
                                                                                       // 11
                Meteor.publish(_src + '_count', function() {                           // 12
                    var countsStr = _src + '_count';                                   // 13
                    var self = this, first = true;                                     // 14
                    var count = function() {                                           // 15
                        var thisCount = _collection.find().count();                    // 16
                        if (first) {                                                   // 17
                            self.added('_cs_counts', countsStr, {count: thisCount});   // 18
                        } else {                                                       // 19
                            self.changed('_cs_counts', countsStr, {count: thisCount}); // 20
                        }                                                              // 21
                        first = false;                                                 // 22
                    }                                                                  // 23
                    var timeout = Meteor.setInterval(count, 1000); // every 1s         // 24
                    count();                                                           // 25
                    self.ready();                                                      // 26
                                                                                       // 27
                    self.onStop(function() {                                           // 28
                        Meteor.clearTimeout(timeout)                                   // 29
                    });                                                                // 30
                });                                                                    // 31
                                                                                       // 32
                Meteor.publish(_src, function(_offset, _limit, _sortVar, _sort) {      // 33
                    var args = { skip : _offset, limit : _limit, sort : {} };          // 34
                    args.sort[_sortVar] = _sort;                                       // 35
                    return _collection.find({}, args);                                 // 36
                });                                                                    // 37
            }                                                                          // 38
        }                                                                              // 39
    });                                                                                // 40
}                                                                                      // 41
                                                                                       // 42
getCollection = function(collectionName, createIfNotExist) {                           // 43
    if(collectionName == "users"){                                                     // 44
        return Meteor.users;                                                           // 45
    }                                                                                  // 46
    var globalScope = Meteor.isClient ? window : global;                               // 47
    for(var property in globalScope){                                                  // 48
        var object = globalScope[property];                                            // 49
        if(object instanceof Meteor.Collection && object._name == collectionName){     // 50
            return object;                                                             // 51
        }                                                                              // 52
    }                                                                                  // 53
    if (createIfNotExist != undefined && createIfNotExist == true) {                   // 54
        return new Meteor.Collection(collectionName);                                  // 55
    } else {                                                                           // 56
        throw Meteor.Error(500, "No collection named " + collectionName);              // 57
    }                                                                                  // 58
};                                                                                     // 59
                                                                                       // 60
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jchristman:collection-scroller'] = {};

})();

//# sourceMappingURL=jchristman_collection-scroller.js.map
