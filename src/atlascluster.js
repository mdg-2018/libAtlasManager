const dockerNames = require('docker-names');
const atlasrequest = require('./atlasrequest');
const fs = require('fs');
var config = require('../config');

function getclusterinfo(auth, clustername, callback) {
    atlasrequest.doGet("/clusters", auth, function (error, response, body) {
        callback(error, JSON.parse(body));
    })
}

class AtlasApiClient {

    constructor(projectid, api_key, username, atlas_root) {
        this.auth = {};
        this.auth.projectid = projectid;
        this.auth.api_key = api_key;
        this.auth.username = username;
        if (atlas_root) {
            this.atlas_root = atlas_root;
        } else {
            this.atlas_root = config.atlas_root;
        }
    }

    printclusterinfo(clustername) {
        //todo: support looking for specific cluster
        getclusterinfo(this.auth, clustername, function (err, clusterdetails) {
            console.log(JSON.stringify(clusterdetails));
            process.exit();
        })
    }

    clusterinfo(clustername, callback) {
        getclusterinfo(this.auth, clustername, callback);
    }

    getclusternames(callback) {
        getclusterinfo(this.auth, null, function (err, clusterdetails) {
            var names = [];
            clusterdetails.results.forEach(function (cluster) {
                names.push(cluster.name);
            });
            callback(err, names);
        });

    }
    createcluster(clusterdefinition, callback) {
        var definition;

        if (clusterdefinition == null) {

            //generate random name fo cluster, docker style
            var clustername = dockerNames.getRandomName().replace("_", "-");

            definition = config.defaultClusterSettings;
            definition.name = clustername;
        }

        if (clusterdefinition != null) {
            definition = clusterdefinition;
        }

        atlasrequest.doPost("/clusters", definition, this.auth, function (err, result) {
            if (callback) {
                callback(err, JSON.parse(result.body));
            }
        });
    }
    deletecluster(clustername, deleteall, callback) {
        if (!deleteall) {
            if (!clustername) {
                throw "invalid argument - clustername must not be null"
            }
            var endpoint = "/clusters/" + clustername;
            atlasrequest.doDelete(endpoint, this.auth, function (err, response) {
                
                if (callback) {
                    callback(err, JSON.parse(response.body));
                }
            })
        } else if (deleteall && !clustername) {
            var self = this;
            this.getclusternames(function (names) {
                names.forEach(function (clustername) {
                    var endpoint = "/clusters/" + clustername;
                    atlasrequest.doDelete(endpoint, self.auth, function (err, response) {
                        if (callback) {
                            callback(err, JSON.parse(response.body));
                        }
                    })
                })
            })
        }

    }
    modifycluster(clustername, clusterdefinition, callback) {
        atlasrequest.doPatch("/clusters", this.auth, clustername, clusterdefinition, function (err, result) {
            if (callback) {
                callback(err, JSON.parse(result.body))
            } else {
                process.exit();
            }

        });
    }
    pausecluster(clustername, callback) {
        var pause = { "paused": true };
        this.modifycluster(clustername, pause, callback);
    }
    resumecluster(clustername, callback) {
        var pause = { "paused": false };
        this.modifycluster(clustername, pause, callback);
    }
}


module.exports = {
    AtlasApiClient
}
