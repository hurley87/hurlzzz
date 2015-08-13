(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

(function () {

//////////////////////////////////////////////////////////////////////////
//                                                                      //
// packages/okgrow:analytics/lib/browser-policy.js                      //
//                                                                      //
//////////////////////////////////////////////////////////////////////////
                                                                        //
if (Package["browser-policy-common"]) {                                 // 1
  var content = Package['browser-policy-common'].BrowserPolicy.content; // 2
  if (content) {                                                        // 3
    content.allowOriginForAll("www.google-analytics.com");              // 4
    content.allowOriginForAll("cdn.mxpnl.com");                         // 5
  }                                                                     // 6
}                                                                       // 7
                                                                        // 8
//////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////
//                                                                      //
// packages/okgrow:analytics/lib/server/publications.js                 //
//                                                                      //
//////////////////////////////////////////////////////////////////////////
                                                                        //
Meteor.publish(null, function() {                                       // 1
  if(this.userId) {                                                     // 2
    return Meteor.users.find(                                           // 3
      {_id: this.userId},                                               // 4
      {fields: {  'services.facebook.email': 1,                         // 5
                  'services.google.email': 1,                           // 6
                  'services.github.email': 1 }});                       // 7
  } else {                                                              // 8
    this.ready();                                                       // 9
  }                                                                     // 10
});                                                                     // 11
                                                                        // 12
//////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['okgrow:analytics'] = {};

})();

//# sourceMappingURL=okgrow_analytics.js.map
