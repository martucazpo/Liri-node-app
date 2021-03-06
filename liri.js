
require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var fs = require("fs");

var moment = require("moment");

var action = process.argv[2];

var noArgument = process.argv[3];

var nodeArgs = process.argv;

var thisName = "";


for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {
    thisName = thisName + "+" + nodeArgs[i];
  } else {
    thisName += nodeArgs[i];

  }
}


switch (action) {
    case "movie-this":
        movieThis(thisName);
        break;

    case "concert-this":
        concertThis(thisName);
        break;

    case "spotify-this-song":
        spotifyThisSong(thisName);
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    default:
        break;
}


// `concert-this`
function concertThis(thisName) {
console.log(thisName);
    if(thisName == ""){
        thisName = "Celine Dion"
    }

    var queryUrl = "https://rest.bandsintown.com/artists/" + thisName + "/events?app_id=codingbootcamp";

    console.log(queryUrl);

    axios.get(queryUrl).then(
        function (response) {
            var respond = response.data;
            console.log("Lineup: " + JSON.stringify(respond[1].lineup));
            console.log("Location: " + respond[1].venue.name + ", " + respond[1].venue.city + ", " + respond[1].venue.country);
            console.log(moment(respond[1].datetime).format("MM/DD/YYYY"));
        })

        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });

}

function getArtistName(artist){
    return artist.name;
}

function spotifyThisSong(thisName) {

    if(thisName == ""){
        thisName = "The Sign"
    }
        
        spotify.search({ type: 'track', query: thisName, limit: 5 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

           var handleData = data.tracks.items
        
            for (var h = 0; h < handleData.length; h++) {

                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                previewUrl = data.tracks.items[h].preview_url;
                album = data.tracks.items[h].album.name;
                artists = data.tracks.items[h].album.artists.map(getArtistName);
                console.log("Song: " + thisName );
                console.log("Preview Url if available:" + previewUrl);
                console.log("Album: " + album);
                console.log("Artists: " + artists);
            }
        })
    

};


function movieThis(thisName) {
console.log(thisName);
    if (thisName == "") {
        thisName = "Mr. Nobody"}

        var queryUrl = "http://www.omdbapi.com/?t=" + thisName + "&y=&plot=short&apikey=trilogy";

        console.log(queryUrl);

        axios.get(queryUrl).then(
            function (response) {
                var respond = response.data;
                console.log("Movie Title: " + respond.Title);
                console.log("Year Movie Came Out: " + respond.Year);
                console.log("imdb Rating: " + respond.imdbRating);
                console.log("Rotten Tomatoes Rating: " + respond.Ratings[1].Value);
                console.log("Country: " + respond.Country);
                console.log("Primary Language: " + respond.Language);
                console.log("Plot: " + respond.Plot);
                console.log("Actors: " + respond.Actors);

            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("---------------Data---------------");
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });
    
};

// `do-what-it-says`
function doWhatItSays() {

    var dataArr = [];

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        dataArr = data.split(",");
        console.log(JSON.stringify(dataArr, null, 2))


        doSpotifySong();
        doMovieThis();
        doConcertThis();

    });

    function doSpotifySong() {
        action = dataArr[0];
        doSong = dataArr[1];

        spotify.search({ type: 'track', query: doSong, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            handleData = data.tracks.items

            for (var h = 0; h < handleData.length; h++) {

                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

                previewUrl = data.tracks.items[h].preview_url;
                album = data.tracks.items[h].album.name;
                artists = data.tracks.items[h].album.artists.map(getArtistName);
                console.log("Song: " + doSong);
                console.log("Preview Url if available:" + previewUrl);
                console.log("Album: " + album);
                console.log("Artists: " + artists);
            }

        });
    }

    function doMovieThis() {

        action = dataArr[2];
        myMovie = dataArr[3];

        var queryUrl = "http://www.omdbapi.com/?t=" + myMovie + "&y=&plot=short&apikey=trilogy";

        console.log("****************************************************************************");

        axios.get(queryUrl).then(
            function (response) {
                var respond = response.data;
                console.log("Movie Title: " + respond.Title);
                console.log("Year Movie Came Out: " + respond.Year);
                console.log("imdb Rating: " + respond.imdbRating);
                console.log("Rotten Tomatoes Rating: " + respond.Ratings[1].Value);
                console.log("Country: " + respond.Country);
                console.log("Primary Language: " + respond.Language);
                console.log("Plot: " + respond.Plot);
                console.log("Actors: " + respond.Actors);

            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("---------------Data---------------");
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });
    }

    function doConcertThis() {

        action = dataArr[4];
        myConcert = dataArr[5];

        var queryUrl = "https://rest.bandsintown.com/artists/" + myConcert + "/events?app_id=codingbootcamp";
        console.log(queryUrl);

        axios.get(queryUrl).then(
            function (response) {
                var respond = response.data;
                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                console.log("Lineup: " + JSON.stringify(respond[1].lineup));
                console.log("Location: " + respond[1].venue.name + ", " + respond[1].venue.city + ", " + respond[1].venue.country);
                console.log(moment(respond[1].datetime).format("MM/DD/YYYY"));
            })

            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });
    }



}