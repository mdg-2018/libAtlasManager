const atlasrequest = require('./atlasrequest');
const fs = require('fs');
var config = require('../config');

function getclusterinfo(auth, clustername, callback) {
    console.log(auth.username);
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

        console.log(this.projectid);
        
    }

    printclusterinfo(clustername) {
        //todo: support looking for specific cluster
        getclusterinfo(this.auth, clustername, function (clusterdetails) {
            console.log(JSON.stringify(clusterdetails));
            process.exit();
        })
    }
    // getclusternames: function (projectid,callback) {
    //     getclusterinfo(projectid, null, function (clusterdetails) {
    //         var names = [];
    //         clusterdetails.results.forEach(function (cluster) {
    //             names.push(cluster.name);
    //         });
    //         console.log(names);
    //         if(callback != null){
    //             callback(names);
    //         } else {
    //             process.exit();
    //         }
    //     });

    // },
    // createcluster: function (projectid, clusterdefinition, clusterdefinitionfile) {
    //     var definition;

    //     if (clusterdefinition == null && clusterdefinitionfile == null) {

    //         //generate random name fo cluster, docker style
    //         var dockerNames = require('docker-names');
    //         var clustername = dockerNames.getRandomName().replace("_", "-");

    //         definition = config.defaultClusterSettings;
    //         definition.name = clustername;
    //     }

    //     if (clusterdefinition != null && clusterdefinitionfile != null) {
    //         throw new Error("Error: conflicting cluster definition information");
    //     }

    //     if (clusterdefinition != null) {
    //         definition = JSON.parse(clusterdefinition);
    //     }

    //     if (clusterdefinitionfile != null) {
    //         var input = fs.readFileSync(clusterdefinitionfile);
    //         definition = JSON.parse(input);
    //     }

    //     atlasrequest.doPost("/clusters", definition, projectid, function (err, result) {
    //         if (err) {
    //             console.log(err);
    //         }
    //         console.log(JSON.parse(result.body));
    //         process.exit();
    //     });
    // },
    // deletecluster: function (projectid, clustername, deleteall) {
    //     if (!deleteall) {
    //         var endpoint = "/clusters/" + clustername;
    //         atlasrequest.doDelete(endpoint, projectid, function (err, response) {
    //             if (err) {
    //                 console.log(err);
    //             }
    //             console.log(response);
    //         })
    //     } else if(deleteall){
    //         this.getclusternames(projectid,function(names){
    //             names.forEach(function(clustername){
    //                 var endpoint = "/clusters/" + clustername;
    //                 atlasrequest.doDelete(endpoint, projectid, function (err, response) {
    //                     if (err) {
    //                         console.log(err);
    //                     }
    //                     console.log(response);
    //                     process.exit();
    //                 })
    //             })
    //         })
    //     }

    // },
    // modifycluster: function(projectid, clustername, clusterdefinition, clusterdefinitionfile){
    //     var definition;

    //     if (clusterdefinition == null && clusterdefinitionfile == null) {
    //         throw new Error("Invalid argument: must provide cluster definition or path to cluster definition file");
    //     }

    //     if (clusterdefinition != null && clusterdefinitionfile != null) {
    //         throw new Error("Error: conflicting cluster definition information");
    //     }

    //     if (clusterdefinition != null) {
    //         definition = JSON.parse(clusterdefinition);
    //     }

    //     if (clusterdefinitionfile != null) {
    //         var input = fs.readFileSync(clusterdefinitionfile);
    //         definition = JSON.parse(input);
    //     }

    //     atlasrequest.doPatch("/clusters", projectid, clustername, definition, function (err, result) {
    //         if (err) {
    //             console.log(err);
    //         }
    //         console.log(JSON.parse(result.body));
    //         process.exit();
    //     });
    // },
    // pausecluster: function(projectid, clustername){
    //     var pause = '{"paused":true}';
    //     this.modifycluster(projectid,clustername,pause);
    // },
    // resumecluster: function(projectid, clustername){
    //     var pause = '{"paused":false}';
    //     this.modifycluster(projectid,clustername,pause);
    // }
}


module.exports = {
    AtlasApiClient
}