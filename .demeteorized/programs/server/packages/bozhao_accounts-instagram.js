(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;

/* Package-scope variables */
var Instagram;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/bozhao:accounts-instagram/instagram_server.js                                              //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
Instagram = {};                                                                                        // 1
                                                                                                       // 2
Oauth.registerService('instagram', 2, null, function(query) {                                          // 3
                                                                                                       // 4
  var response = getTokenResponse(query);                                                              // 5
  var accessToken = response.access_token;                                                             // 6
  var identity = response.user;                                                                        // 7
                                                                                                       // 8
  var serviceData = _.extend(identity, {accessToken: response.access_token});                          // 9
                                                                                                       // 10
  return {                                                                                             // 11
    serviceData: serviceData,                                                                          // 12
    options: {                                                                                         // 13
      profile: { name: identity.full_name },                                                           // 14
      services: { instagram: identity }                                                                // 15
    }                                                                                                  // 16
  };                                                                                                   // 17
});                                                                                                    // 18
                                                                                                       // 19
var getTokenResponse = function (query) {                                                              // 20
  var config = ServiceConfiguration.configurations.findOne({service: 'instagram'});                    // 21
                                                                                                       // 22
  if (!config)                                                                                         // 23
    throw new ServiceConfiguration.ConfigError();                                                      // 24
                                                                                                       // 25
  var response;                                                                                        // 26
  try {                                                                                                // 27
    response = HTTP.post(                                                                              // 28
      "https://api.instagram.com/oauth/access_token", {                                                // 29
        params: {                                                                                      // 30
          code: query.code,                                                                            // 31
          client_id: config.clientId,                                                                  // 32
          redirect_uri: OAuth._redirectUri("instagram", config),                                       // 33
          client_secret: OAuth.openSecret(config.secret),                                              // 34
          grant_type: 'authorization_code'                                                             // 35
        }                                                                                              // 36
      });                                                                                              // 37
                                                                                                       // 38
    if (response.error) // if the http response was an error                                           // 39
        throw response.error;                                                                          // 40
    if (typeof response.content === "string")                                                          // 41
        response.content = JSON.parse(response.content);                                               // 42
    if (response.content.error)                                                                        // 43
        throw response.content;                                                                        // 44
  } catch (err) {                                                                                      // 45
    throw _.extend(new Error("Failed to complete OAuth handshake with Instagram. " + err.message),     // 46
                   {response: err.response});                                                          // 47
  }                                                                                                    // 48
                                                                                                       // 49
  return response.content;                                                                             // 50
};                                                                                                     // 51
                                                                                                       // 52
Instagram.retrieveCredential = function(credentialToken, credentialSecret) {                           // 53
  return Oauth.retrieveCredential(credentialToken, credentialSecret);                                  // 54
};                                                                                                     // 55
                                                                                                       // 56
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/bozhao:accounts-instagram/instagram.js                                                     //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
Accounts.oauth.registerService('instagram');                                                           // 1
                                                                                                       // 2
if (Meteor.isClient) {                                                                                 // 3
  Meteor.loginWithInstagram = function(options, callback) {                                            // 4
    // support a callback without options                                                              // 5
    if (! callback && typeof options === "function") {                                                 // 6
      callback = options;                                                                              // 7
      options = null;                                                                                  // 8
    }                                                                                                  // 9
                                                                                                       // 10
    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback); // 11
    Instagram.requestCredential(options, credentialRequestCompleteCallback);                           // 12
  };                                                                                                   // 13
} else {                                                                                               // 14
  Accounts.addAutopublishFields({                                                                      // 15
    forLoggedInUser: ['services.instagram'],                                                           // 16
    forOtherUsers: [                                                                                   // 17
      'services.instagram.username',                                                                   // 18
      'services.instagram.full_name',                                                                  // 19
      'services.instagram.profile_picture'                                                             // 20
    ]                                                                                                  // 21
  });                                                                                                  // 22
}                                                                                                      // 23
                                                                                                       // 24
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['bozhao:accounts-instagram'] = {
  Instagram: Instagram
};

})();

//# sourceMappingURL=bozhao_accounts-instagram.js.map
