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
var makeCall = function (cmd, qry) {
    switch (cmd) {
        case "spotify-this-song":
            spotifyAPI(query);
            break;

        case "concert-this":
            bandsInTownAPI(query);
            break;

        case "movie-this":
            omdbAPI(query);
            break;

        case "do-what-it-says":
            doWhatItSays(query);
            break;

        default:
            console.log("work in progress");
    }
};
//Spotify API call
function spotifyAPI() {
    console.log("search");
    spotify.search({ type: 'track', query: query }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        let songInfo = data.tracks.items;
        for (let i = 0; i < 5; i++) {
            console.log("=========================================")
            console.log("Artist: " + songInfo[i].artists[0].name);
            console.log("Song Title: " + songInfo[i].name);
            console.log("Preview Url: " + songInfo[i].preview_url);
            console.log("Album Name: " + songInfo[i].album.name);
        }
        console.log("=========================================");

    });
}


//Bandsintown API call
function bandsInTownAPI(query) {
    axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=" + keys.bandsInTown.id)
        .then(function (response) {
            //if input is valid, but there is no info available, display this
            if (response.data === 'undefined' || response.data === "") {
                console.log("No tour data available for this artist.");
                //if the API call succeeds and there is info on this band, display it like so

            } else {
                for (var i = 0; i < response.data.length; i++) {
                    var momentDate = moment(response.data[i].datetime);
                    //output
                    console.log("=========================================")
                    console.log(artist + " CONCERT SHOWTIMES:")
                    console.log("Concert Date: " + momentDate.format("MM/DD/YYYY"));
                    console.log("Venue Name: " + response.data[i].venue.name);
                    console.log("City: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                }
                console.log("=========================================")
            }

        })
        //if we get an error, this will tell us
        .catch((err) => console.log(err))
};

//OMDb API call
function omdbAPI(query) {
    axios.get("http://www.omdbapi.com/?apikey=" + keys.omdb.id + "&t=" + query)
        .then(function (response) {
            //if input is valid, but there is no info available, display this
            if (response.data === 'undefined' || response.data === "") {
                console.log("No information about this movie is available.");
                //if the API call succeeds and there is info on this band, display it like so

            } else {
                for (var i = 0; i < 1; i++) {
                    //output
                    console.log("=========================================")
                    console.log("Movie Title: " + response.data.Title); //Object.keys(myObject);
                    console.log("Year released: " + response.data.Year);
                    console.log("IMDb Rating: " + response.data.Ratings[0].Value);
                    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                    console.log("Country: " + response.data.Country);
                    console.log("Language: " + response.data.Language);
                    console.log("Plot: " + response.data.Plot);
                    console.log("Actors: " + response.data.Actors);
                }
                 console.log("=========================================")
             }

        })
        //if we get an error, this will tell us
        .catch((err) => console.log(err))
};

var doWhatItSays = function () {
    console.log("work in progress")
}


makeCall(command, query);