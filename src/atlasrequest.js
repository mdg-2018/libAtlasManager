const request = require('request');
const config = require('../config');

var uri = config.atlas_root + "groups/";

// var auth = {
//   'auth': {
//     'user': config.username,
//     'pass': config.api_key,
//     'sendImmediately': false
//   }
// }

function getAuth(credentials) {
  return {
    'auth': {
      'user': credentials.username,
      'pass': credentials.api_key,
      'sendImmediately': false
    }
  }
}

module.exports = {
  doGet: function (endpoint, credentials, callback) {
    endpoint = uri + credentials.projectid + endpoint;
    request.get(endpoint, getAuth(credentials), callback);
  },
  doPost: function (endpoint, postbody, credentials, callback) {
    endpoint = uri + credentials.projectid + endpoint;

    opts = {
      headers: { "content-type": "application/json" },
      uri: endpoint,
      body: JSON.stringify(postbody),
    }

    opts.auth = getAuth(credentials).auth;

    request.post(opts, callback);
  },
  doDelete: function (endpoint, credentials, callback) {
    endpoint = uri + credentials.projectid + endpoint;
    console.log(credentials);

    request.delete(endpoint, getAuth(credentials), callback);
  },
  doPatch: function (endpoint, credentials, clustername, body, callback) {
    endpoint = uri + credentials.projectid + endpoint + `/${clustername}`;
    var opts = {};
    opts.headers = { "content-type": "application/json" };
    opts.auth = getAuth(credentials).auth;
    opts.uri = endpoint;
    opts.body = JSON.stringify(body);

    console.log(opts);

    request.patch(endpoint, opts, callback);
  }
}

