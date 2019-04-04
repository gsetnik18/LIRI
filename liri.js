require("dotenv").config();

var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var keys = require("./keys.js");
const fs = require('fs');
var spotify = new Spotify(keys.spotify);
var artist;

var command = process.argv[2];
var query = process.argv.slice(3).join(" ");
console.log(keys);
var makeCall = function (cmd, qry) {
    if (cmd === 'spotify-this-song') {
        console.log(qry);
        //API query to Spotify
        //spotify = process.argv.slice(3).join(" ");
        spotifyAPI();
    }

    else if (cmd === 'concert-this') {
        console.log(qry);
        bandsInTown = process.argv.slice(3).join(" ");
        //API query to Bandsintown
        bandsInTownAPI();
    }

    else if (cmd === 'movie-this') {
        console.log(qry);
        omdb = process.argv.slice(3).join(" ");
        //API query to OMDb
        omdbAPI();
    }

    // else if (cmd === 'do-what-it-says') {
    //     fs.readFile("random.txt", "utf8", function (error, data) {

    //         // If the code experiences any errors it will log the error to the console.
    //         if (error) {
    //           return console.log(error);
    //         }
    //         // We will then print the contents of data  
    //         console.log(data);
    //         // Then split it by commas (to make it more readable)
    //         var dataArr = data.split(",");
    //         spotify = dataArr[1];
    //         // We will then re-display the content as an array for later use.
    //         console.log(dataArr[1]);
    //         spotifyApi();
    //       });
    // }
};
//Spotify API call
function spotifyAPI() {
    console.log("search");
    spotify.search({ type: 'track', query: query }, function (err , data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("=========================================")
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Preview Url: " + data.tracks.items[0].preview_url);
        console.log("Album Name: " + data.tracks.items[0].album.name);
        console.log("=========================================");

    });
}


    //Bandsintown API call
    function bandsInTownAPI() {
    axios.get("https://rest.bandsintown.com/artists/" + query + "/events?API_key=" + keys.bandsInTown.id)
        .then(function (response) {
            if (response.data == 'undefined' || response.data === "") {
                console.log("No tour data available for this artist.");
            }
            else {
                for (var i = 0; i < response.data.length; i++) {
                    var momentDate = moment(response.data[i].datetime);
                    //output
                    console.log("=========================================")
                    console.log(artist + " CONCERT SHOWTIMES:")
                    console.log("Concert Date: " + momentDate.format("MM/DD/YYYY"));
                    console.log("Venue Name: " + response.data[i].venue.name);
                    console.log("City: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                    console.log("=========================================")
                }
            }
        
        })
        .catch((err) => console.log('err'))
    };
    

makeCall(command, query);