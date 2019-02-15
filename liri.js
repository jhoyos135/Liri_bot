let dotenv = require("dotenv").config();
var keys = require("./keys.js");
var axios = require('axios');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var action = process.argv[2];
var result = process.argv[3];



switch (action) {

	case "spotify-this-song":
	spotify(result);
	break;

	case "movie-this":
	movie(result);
    break;
    
    case "concert-this":
    concert(result);
    break;

	case "do-what-it-says":
	doit();
	break;
};

// spotify 
function spotify(result){

	let spotify = new Spotify(keys.spotify_keys);
		if (!result){
        	result = "the sign ace of base";
        }

		spotify.search({ type: 'track', query: result }, (err, data) => {

			if (err){
	            console.log('Error occurred: ' + err);
	            return;
            }
            // console.log(data.tracks.items);
            
	        let songInfo = data.tracks.items;
	        console.log(`Artist(s): ${songInfo[0].artists[0].name}`);
            console.log(`Song Name: ${songInfo[0].name}`);
	        console.log(`Preview Link: ${songInfo[0].preview_url}`);
	        console.log(`Album: ${songInfo[0].album.name}`);
	});
};

//movie OMDB
function movie(result) {
    if (!result){
        result = 'Mr Nobody';
    }

    let movie_url = `http://www.omdbapi.com/?t=${result}&y=&plot=short&apikey=40e9cece`;
    
    axios.get(movie_url).then((res) => {
        let data = res.data;

            console.log("Title: " + data.Title);
		    console.log("Release Year: " + data.Year);
		    console.log("IMDB Rating: " + data.imdbRating);
		    console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
		    console.log("Country: " + data.Country);
		    console.log("Language: " + data.Language);
		    console.log("Plot: " + data.Plot);
		    console.log("Actors: " + data.Actors);
		
    });
};

// concert
function concert(result) {
    let concert_url = `https://rest.bandsintown.com/artists/${result}/events?app_id=codingbootcamp`
    
    axios.get(concert_url).then((res) => {
        
        let data = res.data
        for(let i in data) {
            let date = data[i].datetime;
            let venue_name = data[i].venue.name;
            let venue_city = data[i].venue.city;
            let venue_country = data[i].venue.country;

            console.log(`Venue: ${venue_name}`);
            console.log(`Location: ${venue_country}, ${venue_city}`);
            console.log(`Date: ${date}`)
            console.log(`------------------------`)
            
        };

    });

};
