const dockerNames = require('docker-names');
const atlasrequest = require('./atlasrequest');
const fs = require('fs');
var config = require('../config');

function getclusterinfo(auth, clustername, callback) {
    atlasrequest.doGet("/clusters", auth, function (error, response, body) {
        if (error != null) {
            console.log("Error: " + error);
        }

        callback(JSON.parse(body));

    })
}

class AtlasApiClient {

    constructor(projectid,api_key,username,atlas_root){
        this.auth = {};
        this.auth.projectid = projectid;
        this.auth.api_key = api_key;
        this.auth.username = username;
        if(atlas_root){
            this.atlas_root = atlas_root;
        } else {
            this.atlas_root = config.atlas_root;
        }        
    }

    printclusterinfo(clustername) {
        //todo: support looking for specific cluster
        getclusterinfo(this.auth, clustername, function (clusterdetails) {
            console.log(JSON.stringify(clusterdetails));
            process.exit();
        })
    }

    getclusternames(callback) {
        getclusterinfo(this.auth, null, function (clusterdetails) {
            var names = [];
            clusterdetails.results.forEach(function (cluster) {
                names.push(cluster.name);
            });
            callback(names);
        });

    }
    createcluster(clusterdefinition, clusterdefinitionfile) {
        var definition;

        if (clusterdefinition == null && clusterdefinitionfile == null) {

            //generate random name fo cluster, docker style
            var clustername = dockerNames.getRandomName().replace("_", "-");

            definition = config.defaultClusterSettings;
            definition.name = clustername;
        }

        if (clusterdefinition != null && clusterdefinitionfile != null) {
            throw new Error("Error: conflicting cluster definition information");
        }

        if (clusterdefinition != null) {
            definition = JSON.parse(clusterdefinition);
        }

        if (clusterdefinitionfile != null) {
            var input = fs.readFileSync(clusterdefinitionfile);
            definition = JSON.parse(input);
        }

        atlasrequest.doPost("/clusters", definition, this.auth, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.log(JSON.parse(result.body));
            process.exit();
        });
    }
    deletecluster (clustername, deleteall) {
        if (!deleteall) {
            if(!clustername){
                throw "invalid argument - clustername must not be null"
            }
            var endpoint = "/clusters/" + clustername;
            atlasrequest.doDelete(endpoint, this.auth, function (err, response) {
                if (err) {
                    console.log(err);
                }
                console.log(response);
            })
        } else if(deleteall && !clustername){
            var self = this;
            this.getclusternames(function(names){
                names.forEach(function(clustername){
                    var endpoint = "/clusters/" + clustername;
                    atlasrequest.doDelete(endpoint, self.auth, function (err, response) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(response);
                        process.exit();
                    })
                })
            })
        }

    }
    modifycluster(clustername, clusterdefinition){
        atlasrequest.doPatch("/clusters", this.auth, clustername, clusterdefinition, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.log(JSON.parse(result.body));
            process.exit();
        });
    }
    pausecluster(clustername){
        var pause = {"paused":true};
        this.modifycluster(clustername,pause);
    }
    resumecluster(clustername){
        var pause = {"paused":false};
        this.modifycluster(clustername,pause);
    }
}


module.exports = {
    AtlasApiClient
}