require("dotenv").config();

var axios =  require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var keys = require("./keys.js");
const fs = require('fs');
var spotify = new Spotify(keys.spotify);
   

var command = process.argv[2];
var query = process.argv[3];

var makeCall = function(cmd , qry){
    if(cmd === 'spotify-this-song') {
        console.log(qry);
        //API query to Spotify
        spotify.search({ type: 'track', query: qry }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
           
          console.log(data); 
          });
    }
};

makeCall(command , query);