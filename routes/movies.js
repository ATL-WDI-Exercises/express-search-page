var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

// INDEX
router.get('/', function(req, res, next) {
  // get all the movies and render the index view
  Movie.find({}).sort('-createdAt')
  .then(function(movies) {
    res.render('movies/index', { movies: movies } );
  }, function(err) {
    return next(err);
  });
});

// NEW
router.get('/new', function(req, res, next) {
  var movie = {
    title: '',
    genre: '',
    year: 2016
  };
  res.render('movies/new', { movie: movie } );
});

// CREATE
router.post('/', function(req, res, next) {
  var movie = new Movie(req.body);
  movie.save()
  .then(function(saved) {
    res.redirect('/movies');
  }, function(err) {
    return next(err);
  });
});

// SHOW
router.get('/:id', function(req, res, next) {
  Movie.findById(req.params.id)
  .then(function(movie) {
    if (!movie) return next(makeError(res, 'Document not found', 404));
    res.render('movies/show', { movie: movie });
  }, function(err) {
    return next(err);
  });
});

// EDIT
router.get('/:id/edit', function(req, res, next) {
  Movie.findById(req.params.id)
  .then(function(movie) {
    if (!movie) return next(makeError(res, 'Document not found', 404));
    res.render('movies/edit', { movie: movie });
  }, function(err) {
    return next(err);
  });
});

// UPDATE
router.put('/:id', function(req, res, next) {
  Movie.findById(req.params.id)
  .then(function(movie) {
    if (!movie) return next(makeError(res, 'Document not found', 404));
    movie.title = req.body.title;
    movie.genre = req.body.genre;
    movie.year  = req.body.year;
    return movie.save();
  })
  .then(function(saved) {
    res.redirect('/movies');
  }, function(err) {
    return next(err);
  });
});

// DESTROY
router.delete('/:id', function(req, res, next) {
  Movie.findByIdAndRemove(req.params.id)
  .then(function() {
    res.redirect('/movies');
  }, function(err) {
    return next(err);
  });
});

module.exports = router;
