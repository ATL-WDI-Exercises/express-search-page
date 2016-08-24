var mongoose = require('mongoose');
var Movie = require('./models/movie');

mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/movies');

// our script will not exit until we have disconnected from the db.
function quit() {
  mongoose.disconnect();
  console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
  console.error('ERROR:', err);
  quit();
  return err;
}

console.log('removing old movies...');
Movie.remove({})
.then(function() {
  console.log('old movies removed');
  console.log('creating some new movies...');
  var starWars     = new Movie({ title: 'Star Wars',       genre: 'Science Fiction', year: 1976 });
  var terminator   = new Movie({ title: 'The  Terminator', genre: 'Science Fiction', year: 1984 });
  var groundhogDay = new Movie({ title: 'Groundhog Day',   genre: 'Comedy', year: 1993 });
  return Movie.create([starWars, terminator, groundhogDay]);
})
.then(function(savedMovies) {
  console.log('Just saved', savedMovies.length, 'movies.');
  return Movie.find({});
})
.then(function(allMovies) {
  console.log('Printing all movies:');
  allMovies.forEach(function(movie) {
    console.log(movie);
  });
  quit();
}, function(err) {
  return handleError(err);
});
