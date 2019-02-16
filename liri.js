
let dotenv = require("dotenv").config();
var keys = require("./keys.js");
var axios = require('axios');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var action = process.argv[2];
var result = process.argv[3];
let moment = require('moment');
 

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
	doIt();
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
            let artist = songInfo[0].artists[0].name;
            let song = songInfo[0].name;
            let album = songInfo[0].album.name;

	        console.log(`Artist(s): ${artist}`);
            console.log(`Song Name: ${song}`);
	        console.log(`Preview Link: ${songInfo[0].preview_url}`);
            console.log(`Album: ${album}`);
            
            //logs
            logger(artist + ' ' + song + ' ' + album)
            
	});
};

// movie OMDB
function movie(result) {
    if (!result){
        result = 'Mr Nobody';
    }

    let movie_url = `http://www.omdbapi.com/?t=${result}&y=&plot=short&apikey=trilogy`;

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
            
            //logs
            logger(data.Title + ' ' + data.Year + ' ' + data.Actors+ ' ' + data.Plot);

		
    });
};

// concert
function concert(result) {
    if (!result){
        result = 'Tiesto';
    }

    let concert_url = `https://rest.bandsintown.com/artists/${result}/events?app_id=codingbootcamp`;

    axios.get(concert_url).then( (res) => {

        let data = res.data;
        for(let i in data) {

            let date = data[i].datetime;
            let new_date = moment(date).format("MM/DD/YYYY");
            let venue_name = data[i].venue.name;
            let venue_city = data[i].venue.city;
            let venue_country = data[i].venue.country;

            console.log(`Venue: ${venue_name}`);
            console.log(`Location: ${venue_country}, ${venue_city}`);
            console.log(`Date: ${new_date}`);
            console.log(`<-------------------------------->`);

            logger(new_date + ' ' + venue_name + ' ' + venue_country + ' ' + venue_city);
     
        };
    });
};

// do what it says
function doIt() {
	fs.readFile('random.txt', "utf8", (error, data) => {

		if (error) {
    		return console.log(error);
  		};

		let dataArr = data.split(",");

		if (dataArr[0] === "spotify-this-song") {
			let spotify_this = dataArr[1].slice(1, -1);
			spotify(spotify_this);
		} else if (dataArr[0] === "concert-this") {
			let concert_this = dataArr[1].slice(1, -1);
			concert(concert_this);
		} else if(dataArr[0] === "movie-this") {
			let movie_this = dataArr[1].slice(1, -1);
			movie(movie_this);
		}
  	});
};  

//logger  
function logger(args) {
    fs.appendFileSync('log.txt', `
    ${moment(new Date()).format('MMM Do YY')}
    -- ${args}
`, function(err) {
        if(err) throw err;
    });
};