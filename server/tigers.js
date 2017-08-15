// TODO: make a new router for the tigers resource
// and make some REST routes for it, exactly like for lions
// make a middleware that just logs the word 'tiger' to the console
// when a request comes in to the server

var tigersRouter = require('express').Router();

let db = require('./db')
var tigers = db.tigers;
var id = db.id;

var updateId = function(req, res, next) {
  if (!req.body.id) {
    req.body.id = ++id;
  }
  next();
};

tigersRouter.param('id', function(req, res, next, id) {
  var todo = tigers.find(item => item.id == id);

  if (todo) {
    req.todo = todo;
    next();
  } else {
    next(404)
  }
});

tigersRouter.use((req,res,next) => {
	console.log('GO TIGERS!')
	next()
})

tigersRouter.get('/', function(req, res){
  res.json(tigers);
});

tigersRouter.get('/:id', function(req, res){
  var tiger = req.todo;
  res.json(tiger || {});
});

tigersRouter.post('/', updateId, function(req, res) {
  var tiger = req.body;

  tigers.push(tiger);

  res.json(tiger);
});


tigersRouter.put('/:id', function(req, res) {
  var update = req.body;
  if (update.id) {
    delete update.id
  }

  var tiger = _.findIndex(tigers, {id: req.params.id});
  if (!tigers[tiger]) {
    res.send();
  } else {
    var updatedLion = _.assign(tigers[tiger], update);
    res.json(updatedLion);
  }
});

module.exports = tigersRouter;
