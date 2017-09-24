var express = require('express');
var app = express();
var api = require('./api/api');

// setup the app middlware
require('./middleware/appMiddlware')(app);

// setup the api
app.use('/api/', api);

// error response
app.use((err, req, res, next) => {
  switch (err) {
    case 404:
      res.status(404).send({message: 'Item not found'});
      break;
    default:
      res.status(500).send(err);
      break;
  }
});

// export the app for testing
module.exports = app;
