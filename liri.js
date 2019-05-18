// code to read and set any environment variables with the dotenv package:
require("dotenv").config();

var keys = require("./keys.js"); // code to import the `keys.js` file and store it in a variable.
var axios = require("axios"); // code to Include the axios npm package.
var fs = require("fs"); // code to require fs.
var Spotify = require("node-spotify-api"); // code to include spotify.
var moment = require("moment"); // code to include date/time library.


var command = process.argv[2] || null; // code to set the user command in Node.
var userInput = process.argv.slice(3).join(" ") || null; // code to set the user input in Node.


// function for the liri command `concert-this`
function concert() {

    if (userInput === null){
        return console.log("Please add an artist after the liri command.")
    };

    var artist = userInput;

    artist     = artist.replace(/\//g, "%252F");
    artist     = artist.replace(/\?/g, "%253F");
    artist     = artist.replace(/\*/g, "%252A");
    artist     = artist.replace(/\s/g, "%20");

    var queryUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;

    axios.get(queryUrl)
        .then(function(response){
            var concerts = response.data;
            if (concerts.length > 0){
                console.log(`
                \n---------------
                \n${command}
                \n${userInput}
                `);
                concerts.forEach(function(concert){
                    console.log(`\n------------
                    \n Venue: ${concert.venue.name}
                    \n Location: ${concert.venue.city}, ${concert.venue.region} ${concert.venue.country}
                    \n Date: ${moment(concert.datetime).format("MM/DD/YYYY")}
                    \n Time: ${moment(concert.datetime).format("hh:mm A")}
                    `)
                });
            } else {
                console.log(`Sorry, no concert data found for ${userInput}, please try another artist.`)
            }
           
        })
        .catch(function(err){
            console.log(err);
        })
};


// function for the liri command `spotify-this-song`
function spotify(){
    if (userInput === null) {
        userInput = "The Sign Ace of Base"
    };

    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: userInput, limit: 10 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      var songs = data.tracks.items;

      if (songs.length > 0){
          console.log(`
          \n---------------
          \n${command}
          \n${userInput}
          `);
          songs.forEach(function(song){
              console.log(`\n------------
              \nArtist('s): ${song.artists[0].name}
              \nSong Name: ${song.name}
              \nPreview Link: ${song.preview_url || "N/A"} 
              \nAlbum: ${song.album.name}
              `)
          });
      } else {
          console.log(`Sorry, no song data found for ${userInput}, please try another song.`)
      }
    });
};


// function for the liri command `movie-this`
function movie() {

    if (userInput === null){
        userInput = "Mr. Nobody."
    };

    var title = userInput;

    var queryUrl= `http://www.omdbapi.com/?t=${title}&apikey=trilogy`

    axios.get(queryUrl)
        .then(function(response){
            var movies = response.data;
                console.log(`\n------------
                \n Title: ${movies.Title}
                \n Year : ${movies.Year}
                \n IMDB Rating: ${movies.Ratings[0].Value}
                \n Rotten Tomatoes Rating: ${movies.Ratings[1].Value}
                \n Country: ${movies.Country}
                \n Plot: ${movies.Plot}
                \n Actors: ${movies.Actors}
                \n------------
                `)
            })
        .catch(function(err){
            console.log(err);
        });
};

// function for the liri command `do-what-it-says`
function doSomething() {

    fs.readFile('random.txt', "UTF8", function read(err, data) {
        if (err) {
            console.log(err);
        }
        
        var content = data.split(",");
        console.log(content);
        if (content.length === 0){
            console.log("Random.txt is empty.");
        }
        if (content.lenth === 1){
            command = content[0]
            liri();
        }   else {
            command = content[0];
            userInput = content[1];
            liri();
        }
    });
};


// function for the user commands in liri
function liri() {
    if (command !== null){
        switch(command){
            case "concert-this":
                concert();
                break;
            case "spotify-this-song":
                spotify();
                break;
            case "movie-this":
                movie();
                break;
            case "do-what-it-says":
                doSomething();
                break;
            default: 
                console.log(`\n-----------------------------------
                \nI don't know "${command}" as a Liri command.`);
                userCommandError();
        }
    } else {
        userCommandError();
    }

}

// function for error with user commands in liri
function userCommandError(){
    console.log(`
        \n-----------------------------------\n
        \nPlease input a Liri Command:
        \n-----------------------------------\n
        \nconcert-this\n
        \nspotify-this-song\n
        \nmovie-this\n
        \ndo-what-it-says\n
        \n-----------------------------------\n
        `)
};

// call the liri function
liri();
