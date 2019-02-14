let dotenv = require("dotenv").config();
var keys = require("./keys.js");
var axios = require('axios');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var input = process.argv;
var action = input[2];
var inputs = input[3];

switch (action) {

	case "spotify-this-song":
	spotify(inputs);
	break;

	case "movie-this":
	movie(inputs);
	break;

	case "do-what-it-says":
	doit();
	break;
};

function spotify(inputs){

	let spotify = new Spotify(keys.spotifyKeys);
		if (!inputs){
        	inputs = 'The Sign';
    	}
		spotify.search({ type: 'track', query: inputs }, (err, data) => {
            
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
            }
            
	        let songInfo = data.tracks.items;
	        console.log("Artist(s): " + songInfo[0].artists[0].name);
	        console.log("Song Name: " + songInfo[0].name);
	        console.log("Preview Link: " + songInfo[0].preview_url);
	        console.log("Album: " + songInfo[0].album.name);
	});
}