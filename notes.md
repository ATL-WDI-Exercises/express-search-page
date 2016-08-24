# How to do search

1. Use a form with method="GET" that reloads the same page the form is on.

For example:

URL: /todos

```html
<form method="GET" action="/todos">
  <input type="text" name="search"  value="">
  <input type="text" name="zipcode" value="">
  <input type="text" name="city"    value="">
  <input type="submit" value="Submit">
</form>

<!-- show search results here -->

```

Express Server Router code:

```javascript

router.get('/', function(req, res, next) {
  var searchOptions = {};

  if (req.query.search) {
    searchOptions.title = req.query.search;
  }
  if (req.query.location) {
    searchOptions['location.zipcode'] = req.query.zipcode;
  }
  if (req.query.city) {
    searchOptions[]
  }

  Todo.find(searchOptions)
  .then(function(todos) {
    res.render('todos/index', todos);
  }, function(err) {
    return next(err);
  });
});
