<h1>Atlas API Helper Library</h1>
<h2>A node.js library wrapping MongoDB Atlas API calls</h2>
<p>This library contains helper functions to more easily make calls to Atlas via its REST api.</p>
<p>To use this library, add it as a dependeny to your node.js project:<br>
<code>"dependencies": {
    "atlasmanager": "github:mdg-2018/libAtlasManager"
  }</code><br> Then run: <br><code>npm install</code></p>
<h2><b>AtlasApiClient</b></h2>
<p>The AtlasApiClient class manages credentials for connecting to an Atlas project and has functions to manipulate Atlas clusters. Each AtlasApiClient handles a single Atlas project, so you'll need multiple AtlasApiClients if you want to make changes to clusters in many different projects</p>

<code>const AtlasApiClient = require('atlasmanager').AtlasApiClient;
<br>var atlasApiClient = new AtlasApiClient("ProjectId","ApiKey","PublicApiKey","AtlasRoot" [optional])</code>

<p>Constructor Arguments</p>
<ul>
<li> ProjectId: the ID of the Atlas project you want to target</li>
<li> ApiKey: An Atlas API key</li>
<li> PublicApiKey: Your Atlas public api key (usually a string with 8 characters)</li>
<li> AtlasRoot: Optional URL for the <a href="https://docs.atlas.mongodb.com/reference/api/root/"> Atlas API starting point.</a> Defaults to <code>https://cloud.mongodb.com/api/atlas/v1.0/</code></li>
</ul>

<h3>API client functions</h3>

<code>clusterinfo(clustername, callback)</code><br>
<p>Gets information about clusters in a project. In the future you will be able to pass in a clustername and get information about only a specific cluster, but I haven't gotten around to implementing it yet. For now just use it like this:</p>
<code>clusterinfo(null, function(clusters){
  //do something
});</code>
<br><br>
<code>getclusternames(callback)</code><br>
<p>Returns an array containing the name of each cluster in a project</p>
<br><br>
<code>createcluster(clusterdefinition, callback)</code><br>
<p>Creates a new cluster. clusterdefinition should be a json object describing the new state of the cluster. See the Atlas API docs for details. If no cluster definition is supplied, a cluster will be created based on default settings in the config.js file and given a random name.</p>
<span>No cluster definition: </span><code>createcluster(null,null,function(result){
  // do something
})</code><br><br>
<span>With json string defintion: </span><code>createcluster("{ // cluster defintion, see Atlas api docs }",null,function(result){
  // do something
})</code><br><br>
<span>With cluster definition file: </span><code>createcluster(null,"/home/you/Documents/mycluster.json",function(result){
  // do something
})</code>
<br><br><br>
<code>deletecluster(clustername, deleteall, callback)</code><br>
<p>Terminates either a single cluster or all clusters in a project. To delete a single cluster:<br>
<code>deletecluster(myClusterName,false,function(result){ // do something })</code><br>
To delete all clusters in a project: <code>deletecluster(null, true, function(result){ // do something })</code></p>
<br><br>
<code>modifycluster(clusterename, clusterdefinition, callback)</code><br>
<p>Changes configuration of a single cluster. clusterdefinition should be a json object describing the new state of the cluster. See the Atlas API docs for details. </p>
<br><br>
<code>pausecluster(clustername, callback)</code><br>
<p>Pauses a cluster</p>
<br><br>
<code>resumecluster(clustername, callback)</code><br>
<p>Resumes a cluster</p>