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
  let searchOptions = {};
  // We only set searchOptions for truthy values (such as non-empty strings)
  if (req.query.title) {
    // searchOptions.title = req.query.title;
    searchOptions.title = new RegExp(req.query.title, 'i');
  }
  if (req.query.genre) {
    // searchOptions.genre = req.query.genre;
    searchOptions.genre = new RegExp(req.query.genre, 'i');
  }
  Movie.find(searchOptions).sort('-createdAt')
  .then(function(movies) {
    // Note that we call render with the original searchOptions
    // so that the search inputs can be rendered with that data displayed.
    res.render('movies/index', { movies: movies,
                                 searchOptions: req.query
                               } );
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
