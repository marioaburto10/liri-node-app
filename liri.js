// code to grab keys from keys.js
var keys = require('./keys.js');

var request = require('request');
var twitter = require('twitter');
var spotify = require('spotify');
var client = new twitter(keys.twitterKeys);
var fs = require('fs');

// User Arguements
var nodeArg = process.argv;
var command = process.argv[2];

// movie/song
var movieSong = "";

for (var i = 3; i < nodeArg.length; i++) {
  if(i>3 && i<nodeArg.length){
    movieSong = movieSong + "+" + nodeArg[i];
  } else{
    movieSong = movieSong + nodeArg[i];
  }
}

// switch case for commands
switch(command){
  case "my-tweets":
    displayTweets();
    break;

  case "spotify-this-song":
    if (movieSong){
      spotifySong(movieSong);
    } else{
      spotifySong("The Sign");
    }
    break;

  case "movie-this":
    if(movieSong){
      movieSearch(movieSong);
    } else{
      movieSearch("Mr.Nobody")
    }
    break;

  case "do-what-it-says":
    doSomething();
    break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

//displays last 20 tweets
function displayTweets(){
  var screenName = {screen_name: 'MarioAburto33'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for (var i = 0; i < tweets.length; i++) {
        var date = tweets[i].created_at;
        console.log("@MarioAburto33: " + tweets[i].text + " Created At: " + date.substring(0,19));
        console.log("--------------------------------");
      }
    } else{
      console.log("error");
    }
  });
}

// Displays song info
function spotifySong(song){
  spotify.search({type: 'track', query: song}, function(error, data){
    if(!error){
        var song = data.tracks.items[0];

        console.log("----------------------")
        // artist
        console.log("Artist: " + song.artists[0].name);
        // name of song
        console.log("Song: " + song.name);
        // preview link
        console.log("Preview Link: " + song.preview_url);
        // album name
        console.log("Album: " + song.album.name);
        console.log("----------------------")

    } else{
      console.log("error");
    }
  });
}

// Displays movie info
function movieSearch (movie){
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true';
  request(omdbURL, function(error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("-----------------------------");
      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);
      console.log("-----------------------------");
    } else{
      console.log("error");
    }
  });
}

// displays info for "I Want it That Way" song. Reads song name from random.text file
function doSomething(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var readText = data.split(',');

    spotifySong(readText[1]);
  });
}